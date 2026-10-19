#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
AI Agent 科普视频 —— SFX 校验脚本

只读已落盘的 public/sfx/*.wav（不依赖 make_sfx 的内存状态），逐枚校验：
  · 规格：48kHz / 立体声 / 16-bit PCM
  · 时长：与配方表一致（±2ms）
  · 峰值：-12 ~ -6 dBFS，硬红线 < -1 dBFS
  · 首尾：首尾样本为 0；首/尾 5ms 内电平 ≤ 峰值-12dB（渐入渐出到位）
  · 爆音：首/尾 5ms 内相邻样本跳变 ≤ 0.05 FS；无削波样本
  · 直流偏置 |mean| < 1e-4；非空（有实际内容）

用法：
  python tools/check_sfx.py            # 打印表格
  python tools/check_sfx.py --quiet    # 只打印结论
  python tools/check_sfx.py --hash     # 附带 sha256（用于确定性复跑比对）
退出码：全过 0，任一 FAIL 1。
"""
from __future__ import annotations

import argparse
import hashlib
import math
import os
import sys
import wave

import numpy as np
from scipy.io import wavfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX = os.path.join(ROOT, "public", "sfx")
SR_EXPECT = 48000
CH_EXPECT = 2
BITS_EXPECT = 16
PEAK_MIN_DB, PEAK_MAX_DB, PEAK_REDLINE_DB = -12.0, -6.0, -1.0
EDGE_MS = 5.0
EDGE_REL_DB = 12.0          # 首尾 5ms 电平需比峰值低至少这么多
EDGE_JUMP = 0.05            # 首尾 5ms 内相邻样本最大跳变（FS）
DC_MAX = 1e-4

# 配方时长（秒）——与 KIT.md 第 6 节清单一一对应
SPEC = {
    "paper-drop.wav": 0.5,
    "page-flip.wav": 0.4,
    "key-type.wav": 0.8,
    "enter-click.wav": 0.2,
    "ui-ping.wav": 0.6,
    "success-chime.wav": 0.9,
    "coin-chime.wav": 0.5,
    "timer-bell.wav": 0.8,
    "low-hit.wav": 1.2,
    "confirm-click.wav": 0.5,
    "whoosh.wav": 0.9,
}


def db(x: float) -> float:
    return 20.0 * math.log10(max(float(x), 1e-12))


def check_one(path: str, name: str) -> dict:
    errs: list[str] = []
    with wave.open(path, "rb") as w:
        nch, sw, fr, nfr = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
    sr, data = wavfile.read(path)
    x = np.asarray(data).astype(np.float64) / 32768.0
    if x.ndim == 1:
        x = x[:, None]

    # 规格
    if sr != SR_EXPECT:
        errs.append(f"采样率 {sr}")
    if nch != CH_EXPECT:
        errs.append(f"声道 {nch}")
    if sw * 8 != BITS_EXPECT:
        errs.append(f"位深 {sw*8}")
    if data.dtype != np.int16:
        errs.append(f"dtype {data.dtype}")

    dur = x.shape[0] / float(sr)
    want = SPEC.get(name)
    if want is None:
        errs.append("不在配方表内（文件名/数量被改动）")
    elif abs(dur - want) > 0.002:
        errs.append(f"时长 {dur:.3f}s ≠ {want}s")

    peak = float(np.max(np.abs(x)))
    rms = float(np.sqrt(np.mean(x ** 2)))
    pk_db = db(peak)
    if peak <= 0.0:
        errs.append("全静音")
    if pk_db >= PEAK_REDLINE_DB:
        errs.append(f"峰值 {pk_db:.2f} ≥ {PEAK_REDLINE_DB} dBFS（红线）")
    elif not (PEAK_MIN_DB <= pk_db <= PEAK_MAX_DB):
        errs.append(f"峰值 {pk_db:.2f} 不在 {PEAK_MIN_DB}~{PEAK_MAX_DB} dBFS")

    # 削波
    if int(np.max(np.abs(data))) >= 32766:
        errs.append("存在削波样本")

    # 直流
    dc = float(np.max(np.abs(x.mean(axis=0))))
    if dc > DC_MAX:
        errs.append(f"直流 {dc:.2e}")

    # 首尾 5ms：样本为 0 + 电平已收 + 无跳变
    nf = int(round(EDGE_MS / 1000.0 * sr))
    head, tail = x[:nf], x[-nf:]
    h_max, t_max = float(np.max(np.abs(head))), float(np.max(np.abs(tail)))
    for v in (x[0, 0], x[0, 1], x[-1, 0], x[-1, 1]):
        if abs(float(v)) > 1e-6:
            errs.append("首/尾样本非零")
            break
    if h_max > 0 and db(h_max) > pk_db - EDGE_REL_DB:
        errs.append(f"起音 5ms 电平 {db(h_max):.1f}（未收）")
    if t_max > 0 and db(t_max) > pk_db - EDGE_REL_DB:
        errs.append(f"尾端 5ms 电平 {db(t_max):.1f}（未收）")
    d_head = float(np.max(np.abs(np.diff(x[:nf], axis=0)))) if nf > 1 else 0.0
    d_tail = float(np.max(np.abs(np.diff(x[-nf:], axis=0)))) if nf > 1 else 0.0
    if max(d_head, d_tail) > EDGE_JUMP:
        errs.append(f"边界跳变 {max(d_head, d_tail):.3f} FS")

    if pk_db < -20.0 or db(rms) < -60.0:
        errs.append("内容过弱")

    # 频谱质心（信息列，用于人工判断音色取向）
    mono = x.mean(axis=1)
    win = mono[: min(mono.size, sr // 2)] * np.hanning(min(mono.size, sr // 2))
    sp = np.abs(np.fft.rfft(win))
    fr_ax = np.fft.rfftfreq(win.size, 1.0 / sr)
    centroid = float((sp * fr_ax).sum() / max(sp.sum(), 1e-12))
    dom = float(fr_ax[int(np.argmax(sp))])

    return {
        "name": name, "dur": dur, "want": want, "sr": sr, "ch": nch, "bits": sw * 8,
        "peak": pk_db, "rms": db(rms), "crest": pk_db - db(rms),
        "head": db(h_max) if h_max > 0 else float("-inf"),
        "tail": db(t_max) if t_max > 0 else float("-inf"),
        "dc": dc, "cent": centroid, "dom": dom, "errs": errs,
    }


def fmt(v: float, nd: int = 1) -> str:
    return "  -inf" if v == float("-inf") else f"{v:{nd + 4}.{nd}f}"


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="校验 public/sfx/*.wav")
    ap.add_argument("--dir", default=SFX)
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--hash", action="store_true")
    args = ap.parse_args(argv)

    print(f"目录：{args.dir}")
    files = sorted(f for f in os.listdir(args.dir) if f.lower().endswith(".wav"))
    missing = [n for n in SPEC if n not in files]
    extra = [f for f in files if f not in SPEC]

    rows = [check_one(os.path.join(args.dir, n), n) for n in files if n in SPEC]

    if not args.quiet:
        hdr = (f"{'文件':<18s}{'时长s':>6s}{'采样率':>7s}{'位':>4s}{'声道':>4s}"
               f"{'峰值dBFS':>9s}{'RMS':>7s}{'峰因数':>7s}{'首5ms':>7s}{'尾5ms':>7s}"
               f"{'质心Hz':>8s}{'主频Hz':>8s}{'结论':>6s}")
        print(hdr)
        print("-" * len(hdr))
        for r in rows:
            verdict = "PASS" if not r["errs"] else "FAIL"
            print(f"{r['name']:<18s}{r['dur']:6.3f}{r['sr']:7d}{r['bits']:4d}{r['ch']:4d}"
                  f"{r['peak']:9.2f}{r['rms']:7.2f}{r['crest']:7.2f}"
                  f"{fmt(r['head']):>7s}{fmt(r['tail']):>7s}"
                  f"{r['cent']:8.0f}{r['dom']:8.0f}{verdict:>6s}")
        print("-" * len(hdr))
        if args.hash:
            for r in rows:
                raw = open(os.path.join(args.dir, r["name"]), "rb").read()
                print(f"  {r['name']:<18s} sha256 {hashlib.sha256(raw).hexdigest()}")

    bad = [r for r in rows if r["errs"]]
    for n in missing:
        print(f"FAIL  缺文件：{n}")
    for n in extra:
        print(f"FAIL  多出文件（清单外）：{n}")
    for r in bad:
        for e in r["errs"]:
            print(f"FAIL  {r['name']}：{e}")

    ok = not bad and not missing and not extra and len(rows) == len(SPEC)
    print(f"\n{'通过' if ok else '不通过'}：{len(rows) - len(bad)}/{len(SPEC)} 枚合规"
          f"（峰值区间 {PEAK_MIN_DB}~{PEAK_MAX_DB} dBFS，红线 {PEAK_REDLINE_DB}）")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
