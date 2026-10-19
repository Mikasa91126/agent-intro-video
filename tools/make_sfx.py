#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
AI Agent 科普视频 —— 11 枚 SFX 程序合成（纯 numpy/scipy，无第三方素材）

全部声音由代码生成：噪声 / 正弦 / 三角波 / FM / 状态变量滤波器（TPT SVF）
。确定性：每枚用固定种子的 np.random.default_rng，重复运行逐字节一致。

规格：48kHz / 立体声 / 16-bit PCM WAV，峰值 -12 ~ -6 dBFS，首尾 5ms 渐入渐出。

用法：
  python tools/make_sfx.py            # 覆盖 public/sfx/*.wav 并打印表格
  python tools/make_sfx.py --list     # 只列出配方名，不写盘
"""
from __future__ import annotations

import argparse
import hashlib
import math
import os
import sys

import numpy as np
from scipy import signal as sps
from scipy.io import wavfile

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "sfx")
FADE_MS = 5.0
PEAK_MIN_DB = -12.0
PEAK_MAX_DB = -6.0

# 每枚固定种子（顺序无关，改配方不影响别的声音）
SEED = {
    "paper-drop": 11001,
    "page-flip": 11002,
    "key-type": 11003,
    "enter-click": 11004,
    "ui-ping": 11005,
    "success-chime": 11006,
    "coin-chime": 11007,
    "timer-bell": 11008,
    "low-hit": 11009,
    "confirm-click": 11010,
    "whoosh": 11011,
}

# 每枚的目标峰值（dBFS），全部落在 -12 ~ -6 内且远离 -1
TARGET_DB = {
    "paper-drop": -8.0,
    "page-flip": -9.5,
    "key-type": -8.5,
    "enter-click": -8.0,
    "ui-ping": -9.5,
    "success-chime": -9.0,
    "coin-chime": -9.0,
    "timer-bell": -9.0,
    "low-hit": -7.5,
    "confirm-click": -8.5,
    "whoosh": -10.0,
}

# 所有事件从 6ms 起（5ms 渐入区留在纯静音里，不削发声头）
T0 = 0.006


# ---------------------------------------------------------------- 基础工具

def n_of(dur: float) -> int:
    return int(round(dur * SR))


def tt(n: int) -> np.ndarray:
    return np.arange(n, dtype=np.float64) / SR


def rc(n: int) -> np.ndarray:
    """升余弦 0→1 斜坡（n 点）。"""
    return 0.5 - 0.5 * np.cos(np.pi * (np.arange(n, dtype=np.float64) + 0.5) / n)


def place(buf: np.ndarray, sig: np.ndarray, at: float) -> None:
    """把 sig 叠加到 buf 的 at 秒处；放不下直接报错（避免悄悄截断）。"""
    i = int(round(at * SR))
    if i < 0 or i + sig.size > buf.size:
        raise ValueError(f"事件越界：at={at:.4f}s len={sig.size} buf={buf.size}")
    buf[i:i + sig.size] += sig


def band(x: np.ndarray, f1: float, f2: float, order: int = 2) -> np.ndarray:
    nyq = SR / 2.0
    f2 = min(f2, nyq * 0.985)
    sos = sps.butter(order, [f1 / nyq, f2 / nyq], "bandpass", output="sos")
    return sps.sosfilt(sos, x)


def lowpass(x: np.ndarray, f: float, order: int = 2) -> np.ndarray:
    sos = sps.butter(order, min(f, SR * 0.49) / (SR / 2.0), "lowpass", output="sos")
    return sps.sosfilt(sos, x)


def highpass(x: np.ndarray, f: float, order: int = 2) -> np.ndarray:
    sos = sps.butter(order, max(f, 5.0) / (SR / 2.0), "highpass", output="sos")
    return sps.sosfilt(sos, x)


def svf(x: np.ndarray, fc, q=0.707, mode: str = "bp") -> np.ndarray:
    """TPT 状态变量滤波器（Andy Simper 拓扑）。

    fc / q 可以是标量或逐样本数组（用于上扫、下坠），调制下依然稳定。
    mode: 'lp' / 'bp' / 'hp'
    """
    x = np.asarray(x, dtype=np.float64)
    n = x.size
    if n == 0:
        return x.copy()
    fc = np.clip(np.broadcast_to(np.asarray(fc, dtype=np.float64), (n,)), 15.0, 0.45 * SR)
    qq = np.broadcast_to(np.asarray(q, dtype=np.float64), (n,))
    g = np.tan(np.pi * fc / SR)
    k = 1.0 / qq
    a1 = 1.0 / (1.0 + g * (g + k))
    a2 = g * a1
    a3 = g * a2
    xs, a1l, a2l, a3l, kl = (x.tolist(), a1.tolist(), a2.tolist(), a3.tolist(), k.tolist())
    y = [0.0] * n
    ic1 = 0.0
    ic2 = 0.0
    for i in range(n):
        v3 = xs[i] - ic2
        v1 = a1l[i] * ic1 + a2l[i] * v3
        v2 = ic2 + a2l[i] * ic1 + a3l[i] * v3
        ic1 = 2.0 * v1 - ic1
        ic2 = 2.0 * v2 - ic2
        y[i] = v1 if mode == "bp" else (v2 if mode == "lp" else xs[i] - kl[i] * v1 - v2)
    return np.asarray(y)


def env_ad(t: np.ndarray, att: float, tau: float) -> np.ndarray:
    """(1-e^{-t/att}) · e^{-t/tau}：无爆音起音 + 指数衰减。"""
    return (1.0 - np.exp(-t / att)) * np.exp(-t / tau)


def pulse(n_ms: float, shape: str = "hann") -> np.ndarray:
    """短脉冲窗（默认升余弦），用来激励谐振。"""
    n = max(2, n_of(n_ms / 1000.0))
    return np.hanning(n) if shape == "hann" else rc(n)


def pan(mono: np.ndarray, p: float) -> tuple[np.ndarray, np.ndarray]:
    """等功率声像，p ∈ [-1, 1]。"""
    th = (p + 1.0) * 0.5 * (math.pi / 2.0)
    return mono * math.cos(th), mono * math.sin(th)


def panned(buf_l, buf_r, mono, at: float, p: float, gain: float = 1.0) -> None:
    l, r = pan(mono, p)
    place(buf_l, l * gain, at)
    place(buf_r, r * gain, at)


def noise_pair(rng, n: int) -> tuple[np.ndarray, np.ndarray]:
    """去相关的双声道白噪（自然宽度；单声道相加不会抵消）。"""
    return rng.standard_normal(n), rng.standard_normal(n)


# ---------------------------------------------------------------- 11 枚配方

def sfx_paper_drop():
    """纸张落桌 0.5s：三层错位带通噪声拍击 + 一记 200Hz 轻「啪」。"""
    dur, n = 0.50, n_of(0.50)
    rng = np.random.default_rng(SEED["paper-drop"])
    L, R = np.zeros(n), np.zeros(n)

    # ① 纸面拍击：短促白噪 → 400~1800Hz 带通 → 30ms 内衰完
    layers = ((0.0000, 2.00, 420.0, 1800.0, 0.0105),
              (0.0042, 0.92, 620.0, 2400.0, 0.0075),
              (0.0105, 0.44, 900.0, 3000.0, 0.0055))
    for off, amp, f1, f2, tau in layers:
        m = n_of(0.10)
        e = env_ad(tt(m), 0.0006, tau)
        nl, nr = noise_pair(rng, m)
        yl = band(nl, f1, f2) * e * amp
        yr = band(nr, f1, f2) * e * amp
        place(L, yl, T0 + off)
        place(R, yr, T0 + off)

    # ② 轻「啪」：200Hz 低音（30ms 汉宁窗，听感是一记轻拍而非低频长音）
    m = n_of(0.030)
    pat = np.sin(2.0 * math.pi * 200.0 * tt(m)) * np.hanning(m) * 0.15
    place(L, pat, T0 - 0.0005)
    place(R, pat, T0 - 0.0005)

    # ③ 纸面沙沙余响：1.8~7kHz，很轻，收在 150ms 内
    m = n_of(0.18)
    e = env_ad(tt(m), 0.002, 0.040)
    nl, nr = noise_pair(rng, m)
    place(L, band(nl, 1800.0, 7000.0) * e * 0.18, T0 + 0.004)
    place(R, band(nr, 1800.0, 7000.0) * e * 0.18, T0 + 0.004)
    return L, R


def sfx_page_flip():
    """翻页 0.4s：带通中心 800→3kHz 上扫（40ms）+ 纸边轻响 + 空气尾。"""
    dur, n = 0.40, n_of(0.40)
    rng = np.random.default_rng(SEED["page-flip"])
    L, R = np.zeros(n), np.zeros(n)

    # ① 主「刷」：40ms 内 800→3000Hz 上扫，Q 由 2.6 收到 1.6
    m = n_of(0.30)
    t = tt(m)
    u = np.clip(t / 0.040, 0.0, 1.0)
    fc = 800.0 * (3000.0 / 800.0) ** u
    q = 2.2 - 0.9 * u
    e = env_ad(t, 0.0035, 0.085)
    nl, nr = noise_pair(rng, m)
    place(L, svf(nl, fc, q, "bp") * e, T0)
    place(R, svf(nr, fc, q, "bp") * e, T0)

    # ② 纸边轻响：3ms 高频小尖头
    m = n_of(0.04)
    nl, nr = noise_pair(rng, m)
    pl = pulse(3.0)
    yl = np.zeros(m); yr = np.zeros(m)
    yl[:pl.size] = pl; yr[:pl.size] = pl
    place(L, band(nl * yl, 1500.0, 6000.0) * 0.90, T0 + 0.0015)
    place(R, band(nr * yr, 1500.0, 6000.0) * 0.90, T0 + 0.0015)

    # ③ 空气尾：2.2~9kHz 带通噪声，慢一点收（限带，不留 16kHz 以上的沙沙）
    m = n_of(0.34)
    e2 = env_ad(tt(m), 0.004, 0.13)
    nl, nr = noise_pair(rng, m)
    place(L, band(nl, 2200.0, 9000.0) * e2 * 0.20, T0 + 0.002)
    place(R, band(nr, 2200.0, 9000.0) * e2 * 0.20, T0 + 0.002)
    return L, R


def _key_hit(rng, f0: float, out_len: float, gain: float):
    """一记键盘声（mono）：2ms 噪声脉冲 + 1.5kHz 谐振体 + 低频 thock。"""
    m = n_of(out_len)
    t = tt(m)
    p = pulse(2.0)
    ex = np.zeros(m)
    ex[:p.size] = p

    # 高频「咔」
    y1 = band(rng.standard_normal(m) * ex, 1200.0, 7000.0) * env_ad(t, 0.0004, 0.006)
    # 1.5kHz 谐振体（每击轻微失谐，像真键盘）
    y2 = svf(rng.standard_normal(m) * ex, f0, 7.0, "bp") * env_ad(t, 0.0004, 0.030)
    # 低频 thock
    y3 = svf(rng.standard_normal(m) * ex, 260.0, 1.1, "lp") * env_ad(t, 0.0006, 0.022)
    return (y1 * 1.00 + y2 * 0.85 + y3 * 0.30) * gain


def _click_core(rng, out_len: float) -> np.ndarray:
    """机械 click（mono）：1.2~7.5k 噪声尖头 + 120Hz 低频「咔」+ 700Hz 轻谐振。

    尖头限带（不用高通到底）——把能量放在耳朵最灵 1.2~7.5kHz，
    不留 16kHz 以上的沙沙，听感更「实」、不廉价。
    """
    m = n_of(out_len)
    t = tt(m)
    p = pulse(4.0)
    ex = np.zeros(m)
    ex[:p.size] = p
    y1 = band(rng.standard_normal(m) * ex, 1200.0, 7500.0) * 1.00
    y2 = np.sin(2.0 * math.pi * 120.0 * t) * env_ad(t, 0.0015, 0.032) * 1.10
    y3 = svf(rng.standard_normal(m) * ex, 700.0, 3.0, "bp") * 0.55
    return y1 + y2 + y3


def sfx_key_type():
    """键盘 4 连 0.8s：间隔 0.15 / 0.13 / 0.17s，逐击轻微失谐。"""
    dur, n = 0.80, n_of(0.80)
    rng = np.random.default_rng(SEED["key-type"])
    L, R = np.zeros(n), np.zeros(n)
    onsets = (T0, T0 + 0.15, T0 + 0.28, T0 + 0.45)
    pans = (-0.18, 0.10, -0.06, 0.16)
    gains = (1.00, 0.94, 0.88, 1.06)
    for at, p, g in zip(onsets, pans, gains):
        f0 = 1490.0 * (1.0 + 0.022 * float(rng.standard_normal()))
        hit = _key_hit(rng, f0, 0.075, g)
        panned(L, R, hit, at, p)
    return L, R


def sfx_enter_click():
    """回车 0.2s：机械 click（120Hz 短正弦 + 高通噪声尖头）。"""
    dur, n = 0.20, n_of(0.20)
    rng = np.random.default_rng(SEED["enter-click"])
    L, R = np.zeros(n), np.zeros(n)
    panned(L, R, _click_core(rng, 0.10), T0, 0.0)
    return L, R


def sfx_ui_ping():
    """界面 ping 0.6s：1.6kHz 正弦 + 2.76× FM 分音，0.18s 回声（0.35×）。"""
    dur, n = 0.60, n_of(0.60)
    rng = np.random.default_rng(SEED["ui-ping"])
    L, R = np.zeros(n), np.zeros(n)

    m = n_of(0.40)
    t = tt(m)
    fc, fm = 1600.0, 1600.0 * 2.76
    idx = 1.15 * np.exp(-t / 0.085)                     # 调制指数快速收掉：只留金属感起音
    core = np.sin(2.0 * math.pi * fc * t + idx * np.sin(2.0 * math.pi * fm * t))
    dry = core * env_ad(t, 0.0035, 0.165)
    panned(L, R, dry, T0, 0.0)

    # 一次轻回声：0.18s 后 0.35×，略暗、略微反向偏置
    echo = lowpass(dry, 4200.0) * 0.35
    fit = n - int(round((T0 + 0.18) * SR))
    if echo.size > fit:
        echo = echo[:fit]
    panned(L, R, echo, T0 + 0.18, -0.14)

    # 更轻的二次余响（-22dB），只做纵深
    echo2 = lowpass(dry, 3200.0) * 0.35 * 0.31
    fit2 = n - int(round((T0 + 0.35) * SR))
    if echo2.size > fit2:
        echo2 = echo2[:fit2]
    panned(L, R, echo2, T0 + 0.35, 0.10)
    return L, R


def _chime_note(f: float, t: np.ndarray, tau: float, parts) -> np.ndarray:
    """正弦 + 泛音（高次泛音衰减更快）。parts = ((倍数, 线性幅度, tau 系数), ...)"""
    y = np.zeros(t.size)
    for k, amp, tk in parts:
        fk = f * k * (1.0 + 0.0008 * (k - 1.0) ** 2)     # 极轻的非谐，避免电子味
        y += amp * np.sin(2.0 * math.pi * fk * t) * env_ad(t, 0.003, tau * tk)
    return y


def sfx_success_chime():
    """成功 chime 0.9s：C5-E5-G5 每 60ms 错落，正弦 + 泛音，长衰减。"""
    dur, n = 0.90, n_of(0.90)
    rng = np.random.default_rng(SEED["success-chime"])
    L, R = np.zeros(n), np.zeros(n)
    notes = ((523.25, -0.28), (659.26, 0.0), (783.99, 0.28))
    parts = ((1.0, 1.00, 1.00), (2.0, 0.28, 0.55), (3.0, 0.11, 0.35))
    m = n_of(0.72)
    t = tt(m)
    for i, (f, p) in enumerate(notes):
        panned(L, R, _chime_note(f, t, 0.50, parts), T0 + 0.060 * i, p)

    # 高八度微光（居中，很轻）
    shim = _chime_note(1046.5, t, 0.50, ((1.0, 0.10, 0.30),))
    panned(L, R, shim, T0 + 0.020, 0.0)

    # 极轻的「击弦」噪声，只给起音一点空气
    for buf in (L, R):
        mz = n_of(0.02)
        pk = pulse(3.0)
        ex = np.zeros(mz)
        ex[:pk.size] = pk
        place(buf, band(rng.standard_normal(mz) * ex, 3000.0, 9000.0) * 0.05, T0)
    return L, R


def sfx_coin_chime():
    """价格落定 0.5s：E6→B6 两枚金币音，非谐分音、短衰减。"""
    dur, n = 0.50, n_of(0.50)
    rng = np.random.default_rng(SEED["coin-chime"])
    L, R = np.zeros(n), np.zeros(n)
    parts = ((1.0, 1.00, 1.00), (2.42, 0.37, 0.45), (3.86, 0.18, 0.30))
    m = n_of(0.40)
    t = tt(m)
    for f, at, p, tau in ((1318.51, T0, -0.20, 0.115), (1975.53, T0 + 0.056, 0.20, 0.135)):
        panned(L, R, _chime_note(f, t, tau, parts), at, p)
    # 起音小亮片
    mz = n_of(0.02)
    pk = pulse(2.0)
    ex = np.zeros(mz)
    ex[:pk.size] = pk
    panned(L, R, band(rng.standard_normal(mz) * ex, 4000.0, 9000.0) * 1.4, T0, 0.0)
    return L, R


def sfx_timer_bell():
    """定时铃 0.8s：1.2kHz 三角波钟声 + 3.6kHz 区非谐分音 + 拍频微光。"""
    dur, n = 0.80, n_of(0.80)
    rng = np.random.default_rng(SEED["timer-bell"])
    L, R = np.zeros(n), np.zeros(n)
    m = n_of(0.74)
    t = tt(m)
    # 三角波谐波列（奇次、1/k²），高次带轻微伸长 → 钟的非谐感
    y = np.zeros(m)
    for k in (1, 3, 5, 7, 9):
        fk = 1200.0 * k * (1.0 + 0.0045 * (k - 1))
        y += (1.0 / (k * k)) * np.sin(2.0 * math.pi * fk * t) * env_ad(t, 0.002, 0.34 * (1.0 - 0.08 * k))
    # 3.6kHz 区非谐分音（钟的敲击音）
    y += 0.30 * np.sin(2.0 * math.pi * 3712.0 * t) * env_ad(t, 0.001, 0.095)
    y += 0.13 * np.sin(2.0 * math.pi * 5631.0 * t) * env_ad(t, 0.001, 0.055)
    # 拍频：+1.7Hz 的轻分音，让铃「活」起来
    y += 0.30 * np.sin(2.0 * math.pi * 1201.7 * t) * env_ad(t, 0.003, 0.30)
    panned(L, R, y, T0, 0.0)
    # 敲击噪声
    mz = n_of(0.02)
    pk = pulse(3.0)
    ex = np.zeros(mz)
    ex[:pk.size] = pk
    panned(L, R, band(rng.standard_normal(mz) * ex, 3000.0, 7000.0) * 1.6, T0, 0.0)
    # 高频分音略微加宽
    panned(L, R, 0.30 * np.sin(2.0 * math.pi * 3712.0 * t) * env_ad(t, 0.001, 0.095), T0, -0.16)
    return L, R


def sfx_low_hit():
    """危险 hit 1.2s：55→40Hz 下坠 + 次低音 + 轻饱和，2s 指数尾截到 1.2s。"""
    dur, n = 1.20, n_of(1.20)
    rng = np.random.default_rng(SEED["low-hit"])
    L, R = np.zeros(n), np.zeros(n)
    t = tt(n)
    u = np.clip(t / 0.35, 0.0, 1.0)
    f = 55.0 * (40.0 / 55.0) ** u
    ph = 2.0 * math.pi * np.cumsum(f) / SR
    core = np.sin(ph)                     # 55 → 40Hz
    sub = np.sin(0.5 * ph)                # 次低音 27.5 → 20Hz
    drive = 2.3
    sat = np.tanh(drive * (core + 0.55 * sub)) / np.tanh(drive)   # 轻饱和 → 小喇叭也有存在感
    body = (sat * env_ad(t, 0.006, 0.45))[:n - n_of(T0)]
    place(L, body, T0)
    place(R, body, T0)
    for buf in (L, R):
        m = n_of(0.09)
        imp = lowpass(rng.standard_normal(m), 300.0) * env_ad(tt(m), 0.001, 0.028) * 0.30
        place(buf, imp, T0)
        # 极轻的冲击边缘：让危险感在小喇叭上也能成立
        m2 = n_of(0.05)
        edge = band(rng.standard_normal(m2), 400.0, 2500.0) * env_ad(tt(m2), 0.0008, 0.012) * 0.26
        place(buf, edge, T0)
    return L, R


def sfx_confirm_click():
    """确认/指纹 0.5s：机械 click 层 + 880Hz 轻确认音。"""
    dur, n = 0.50, n_of(0.50)
    rng = np.random.default_rng(SEED["confirm-click"])
    L, R = np.zeros(n), np.zeros(n)

    panned(L, R, _click_core(rng, 0.10) * 1.00, T0, 0.0)

    m = n_of(0.42)
    t = tt(m)
    parts = ((1.0, 1.00, 1.00), (1.5, 0.22, 0.62), (2.0, 0.09, 0.45))
    tone = _chime_note(880.0, t, 0.155, parts)
    panned(L, R, tone, T0 + 0.026, 0.0)
    return L, R


def sfx_whoosh():
    """转场 whoosh 0.9s：带通中心 300→4kHz 上扫，两端包络收干净。"""
    dur, n = 0.90, n_of(0.90)
    rng = np.random.default_rng(SEED["whoosh"])
    L, R = np.zeros(n), np.zeros(n)
    t = tt(n)

    # 中心频率上扫：0.10s 起、0.68s 扫完（指数），Q 随之上开
    u = np.clip((t - 0.10) / 0.58, 0.0, 1.0)
    fc = 300.0 * (4000.0 / 300.0) ** u
    q = 2.15 - 0.90 * u

    # 主包络：0.13s 渐入 → 随上扫推起来（0.62s 附近最满）→ 指数收干净
    e = np.ones(n)
    ni = n_of(0.13)
    e[:ni] = rc(ni)
    e *= 0.55 + 0.45 * u ** 1.3
    e *= np.exp(-np.clip(t - 0.62, 0.0, None) / 0.10)
    no = n_of(0.10)
    e[-no:] *= rc(no)[::-1]

    nl, nr = noise_pair(rng, n)
    place(L, svf(nl, fc, q, "bp") * e, 0.0)
    place(R, svf(nr, fc, q, "bp") * e, 0.0)

    # 空气推力：5kHz 高通，早一点起、早一点走
    ea = np.ones(n)
    ni2 = n_of(0.08)
    ea[:ni2] = rc(ni2)
    no2 = n_of(0.30)
    ea[-no2:] *= rc(no2)[::-1]
    ea *= np.exp(-np.clip(t - 0.12, 0.0, None) / 0.28)
    nl2, nr2 = noise_pair(rng, n)
    place(L, band(nl2, 3500.0, 10000.0) * ea * 0.38, 0.0)
    place(R, band(np.roll(nr2, 58), 3500.0, 10000.0) * ea * 0.38, 0.0)   # 1.2ms 偏移 → 宽度

    # 低频体感：200Hz 低通噪声，很轻
    nm = rng.standard_normal(n)
    el = np.ones(n)
    ni3 = n_of(0.10)
    el[:ni3] = rc(ni3)
    no3 = n_of(0.28)
    el[-no3:] *= rc(no3)[::-1]
    el *= np.exp(-np.clip(t - 0.10, 0.0, None) / 0.30)
    low = lowpass(nm, 200.0) * el * 1.2
    place(L, low, 0.0)
    place(R, low, 0.0)
    return L, R


# ---------------------------------------------------------------- 收尾与写盘

RECIPES = (
    ("paper-drop.wav", sfx_paper_drop),
    ("page-flip.wav", sfx_page_flip),
    ("key-type.wav", sfx_key_type),
    ("enter-click.wav", sfx_enter_click),
    ("ui-ping.wav", sfx_ui_ping),
    ("success-chime.wav", sfx_success_chime),
    ("coin-chime.wav", sfx_coin_chime),
    ("timer-bell.wav", sfx_timer_bell),
    ("low-hit.wav", sfx_low_hit),
    ("confirm-click.wav", sfx_confirm_click),
    ("whoosh.wav", sfx_whoosh),
)


def finalize(L: np.ndarray, R: np.ndarray, peak_db: float) -> np.ndarray:
    """去直流 → 5ms 渐入渐出 → 归一化到目标峰值 → int16。"""
    st = np.stack([np.asarray(L, dtype=np.float64), np.asarray(R, dtype=np.float64)], axis=1)
    st -= st.mean(axis=0, keepdims=True)                 # 去直流，防积分漂移
    nf = n_of(FADE_MS / 1000.0)
    r = rc(nf)
    st[:nf] *= r[:, None]
    st[-nf:] *= r[::-1, None]
    p = float(np.max(np.abs(st)))
    if p <= 0.0:
        raise ValueError("空信号")
    st *= (10.0 ** (peak_db / 20.0)) / p
    q = np.round(st * 32767.0)
    q = np.clip(q, -32767.0, 32767.0).astype(np.int16)
    return q


def db(x: float) -> float:
    return 20.0 * math.log10(max(float(x), 1e-12))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="合成 11 枚 SFX（48kHz/立体声/16-bit）")
    ap.add_argument("--list", action="store_true", help="只列出配方，不写盘")
    args = ap.parse_args(argv)

    if args.list:
        for name, fn in RECIPES:
            print(f"{name:20s} {fn.__doc__.splitlines()[0]}")
        return 0

    os.makedirs(OUT, exist_ok=True)
    print(f"{'文件':18s} {'时长s':>6s} {'采样率':>7s} {'声道':>4s} {'峰值dBFS':>9s} "
          f"{'RMSdBFS':>9s} {'波峰因数':>8s} {'sha256[:12]':>12s}")
    print("-" * 88)
    bad = []
    for name, fn in RECIPES:
        L, R = fn()
        if L.size != R.size:
            raise ValueError(f"{name}: 左右长度不一致")
        q = finalize(L, R, TARGET_DB[name.replace(".wav", "")])
        path = os.path.join(OUT, name)
        wavfile.write(path, SR, q)
        raw = open(path, "rb").read()
        sha = hashlib.sha256(raw).hexdigest()
        f = q.astype(np.float64) / 32768.0
        pk = float(np.max(np.abs(f)))
        rms = float(np.sqrt(np.mean(f ** 2)))
        pdb = db(pk)
        if not (PEAK_MIN_DB <= pdb <= PEAK_MAX_DB):
            bad.append(f"{name}: 峰值 {pdb:.2f}dBFS 超出 {PEAK_MIN_DB}~{PEAK_MAX_DB}")
        print(f"{name:18s} {q.shape[0]/SR:6.3f} {SR:7d} {q.shape[1]:4d} {pdb:9.2f} "
              f"{db(rms):9.2f} {db(pk)-db(rms):8.2f} {sha[:12]:>12s}")
    print("-" * 88)
    if bad:
        for b in bad:
            print("FAIL", b)
        return 1
    print(f"OK  11 枚已写入 {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
