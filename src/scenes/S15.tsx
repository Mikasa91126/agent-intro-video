/**
 * S15 · 用途三 · 办公自动化（2:29–2:35 · 360f）
 * 三窗口复刻：表格（单元格依次点亮）→ PPT（封面自排版）→ 网页预览；
 * 右上角定时旋钮 + 「每周五 17:00 自动生成周报」。
 */
import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { MiniWindow } from "../comps/ui";
import { COLORS, EASE, FONTS } from "../theme";
import { prog } from "../lib/anim";


/** 入场：任务卡式滑入 */
const slide = (frame: number, start: number, dur = 34): CSSProperties => {
  const p = EASE.outExpo(prog(frame, start, dur));
  return { opacity: Math.min(1, p * 1.8), transform: `translateY(${(1 - p) * 34}px) rotate(${(1 - p) * 2}deg)` };
};

/** 表格：6 天 × 3 列（单元格依次点亮） */
const SHEET: string[][] = [
  ["06-01", "1,284", "12.4"],
  ["06-02", "1,463", "14.1"],
  ["06-03", "1,102", "10.8"],
  ["06-04", "1,587", "15.6"],
  ["06-05", "1,731", "17.2"],
  ["06-06", "1,298", "12.9"],
];
const SHEET_HEAD = ["日期", "订单数", "营收 / 万"];

const BARS = [0.52, 0.66, 0.44, 0.78, 0.88, 0.6];

const W1 = { x: 140, y: 290, w: 520, h: 420 };
const W2 = { x: 712, y: 340, w: 360, h: 340 };
const W3 = { x: 1120, y: 290, w: 400, h: 420 };
const MIDY = 500;

export const S15 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(prog(frame, 0, 10), 1 - prog(frame, dur - 18, 18));
  /** 转场：墨迹扩散（径向 mask 1.1×，0.8s） */
  const spread = EASE.ink(prog(frame, 0, 46));

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <AbsoluteFill style={{ opacity: fade, clipPath: `circle(${(spread * 135).toFixed(1)}% at 26% 46%)` }}>
        {/* 章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          用途三 · 办公自动化 ｜ USE CASE 3 — OFFICE AUTOMATION
        </div>

        {/* 定时旋钮（右上角） */}
        <TimerKnob frame={frame} />

        {/* 三窗口之间的虚线连接 */}
        <div
          style={{
            position: "absolute",
            left: W1.x + W1.w + 4,
            top: MIDY,
            width: W3.x - (W1.x + W1.w) - 8,
            borderTop: `1.5px dashed rgba(20,20,19,0.2)`,
            opacity: prog(frame, 56, 20) * 0.9,
          }}
        />
        {[W1.x + W1.w + 26, W2.x + W2.w + 24].map((x) => (
          <svg
            key={x}
            width={14}
            height={14}
            viewBox="0 0 14 14"
            style={{ position: "absolute", left: x, top: MIDY - 7, opacity: prog(frame, 60, 20) }}
          >
            <path d="M1 2 L11 7 L1 12 Z" fill="rgba(20,20,19,0.35)" />
          </svg>
        ))}

        {/* ---------------- ① 表格 ---------------- */}
        <div style={{ position: "absolute", left: W1.x, top: W1.y, ...slide(frame, 24, 38) }}>
          <MiniWindow title="周报数据.xlsx — 自动填充" variant="light" width={W1.w} height={W1.h} bodyStyle={{ padding: "18px 20px" }}>
            <SheetBody frame={frame} />
          </MiniWindow>
        </div>

        {/* ---------------- ② PPT ---------------- */}
        <div style={{ position: "absolute", left: W2.x, top: W2.y, ...slide(frame, 34, 38) }}>
          <MiniWindow title="周报模板.pptx" variant="light" width={W2.w} height={W2.h} bodyStyle={{ padding: "16px 18px" }}>
            <PptBody frame={frame} />
          </MiniWindow>
        </div>

        {/* ---------------- ③ 网页预览 ---------------- */}
        <div style={{ position: "absolute", left: W3.x, top: W3.y, ...slide(frame, 44, 38) }}>
          <MiniWindow title="weekly.example.com" variant="light" width={W3.w} height={W3.h} bodyStyle={{ padding: "18px 20px" }}>
            <WebBody frame={frame} />
          </MiniWindow>
        </div>

        {/* ---------------- 主文案 ---------------- */}
        <div style={{ position: "absolute", left: 140, bottom: 96, maxWidth: 1560 }}>
          <div style={{ ...TYPE.body, fontSize: 40 }}>
            用途三：办公自动化。表格、PPT、周报、数据看板——定时替你交付。
          </div>
          <div style={{ ...TYPE.en, fontStyle: "italic", fontSize: 32, color: COLORS.grey, marginTop: 10 }}>
            Use case 3: office automation. Sheets, decks, reports, dashboards—delivered on schedule.
          </div>
        </div>
      </AbsoluteFill>

      <Sequence from={84} durationInFrames={70}>
        <Audio src={staticFile("sfx/key-type.wav")} />
      </Sequence>
      <Sequence from={286} durationInFrames={90}>
        <Audio src={staticFile("sfx/timer-bell.wav")} />
      </Sequence>
    </PaperStage>
  );
};

/* ---------------------------------------------------------------- 定时旋钮 */

const DAYS = ["一", "二", "三", "四", "五", "六", "日"];

const TimerKnob = ({ frame }: { frame: number }) => {
  const p = EASE.outExpo(prog(frame, 16, 40));
  /** 指针从「一」扫到「五」：44° 起步，扫过 4 格 */
  const sweep = EASE.draw(prog(frame, 222, 60));
  const step = 360 / 7;
  const startA = -90; // 周一在正上方
  const angle = startA + sweep * step * 4; // 扫到周五
  const labelP = Math.min(1, prog(frame, 286, 14) * 1.6);

  return (
    <div
      style={{
        position: "absolute",
        left: 1580,
        top: 178,
        width: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      <svg width={168} height={168} viewBox="0 0 168 168">
        <circle cx={84} cy={84} r={72} fill={COLORS.paperWhite} stroke="rgba(20,20,19,0.14)" strokeWidth={1.5} />
        {/* 已排定区间：周一 → 周五 */}
        <path
          d={arc(84, 84, 58, startA, angle)}
          fill="none"
          stroke={COLORS.clay}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* 7 刻度 */}
        {DAYS.map((d, i) => {
          const a = (-90 + i * step) * (Math.PI / 180);
          const r1 = 68;
          const r2 = 60;
          const isFri = i === 4;
          return (
            <g key={d}>
              <line
                x1={84 + Math.cos(a) * r1}
                y1={84 + Math.sin(a) * r1}
                x2={84 + Math.cos(a) * r2}
                y2={84 + Math.sin(a) * r2}
                stroke={isFri ? COLORS.clay : "rgba(20,20,19,0.28)"}
                strokeWidth={isFri ? 3 : 2}
                strokeLinecap="round"
              />
              <text
                x={84 + Math.cos((-90 + i * step) * (Math.PI / 180)) * 44}
                y={84 + Math.sin((-90 + i * step) * (Math.PI / 180)) * 44 + 6}
                textAnchor="middle"
                fontFamily={FONTS.mono}
                fontSize={isFri ? 18 : 16}
                fontWeight={isFri ? 600 : 400}
                fill={isFri ? COLORS.clay : COLORS.grey}
              >
                {d}
              </text>
            </g>
          );
        })}
        {/* 指针 */}
        <line
          x1={84}
          y1={84}
          x2={84 + Math.cos((angle * Math.PI) / 180) * 52}
          y2={84 + Math.sin((angle * Math.PI) / 180) * 52}
          stroke={COLORS.ink}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={84} cy={84} r={5} fill={COLORS.ink} />
      </svg>

      <div style={{ marginTop: 14, textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 28, letterSpacing: "0.06em", color: COLORS.ink, opacity: labelP }}>
          每周五 17:00
        </div>
        <div style={{ ...TYPE.sub, fontSize: 26, color: COLORS.graphite, marginTop: 6, opacity: labelP }}>
          自动生成周报
        </div>
      </div>
    </div>
  );
};

/** 圆弧 path（度 → 弧度） */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number): string => {
  if (Math.abs(a1 - a0) < 0.4) return "";
  const p0 = { x: cx + Math.cos((a0 * Math.PI) / 180) * r, y: cy + Math.sin((a0 * Math.PI) / 180) * r };
  const p1 = { x: cx + Math.cos((a1 * Math.PI) / 180) * r, y: cy + Math.sin((a1 * Math.PI) / 180) * r };
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`;
};

/* ---------------------------------------------------------------- ① 表格 */

const SheetBody = ({ frame }: { frame: number }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {/* 表头 */}
    <div style={{ display: "flex", padding: "0 6px 10px", borderBottom: `1px solid ${COLORS.line}` }}>
      {SHEET_HEAD.map((h, c) => (
        <span
          key={h}
          style={{
            flex: c === 0 ? "0 0 130px" : 1,
            textAlign: c === 0 ? "left" : "right",
            fontFamily: FONTS.mono,
            fontSize: 19,
            letterSpacing: "0.06em",
            color: COLORS.grey,
          }}
        >
          {h}
        </span>
      ))}
    </div>
    {/* 单元格：依次点亮 */}

    {SHEET.map((row, r) => (
      <div
        key={row[0]}
        style={{
          display: "flex",
          alignItems: "center",
          height: 40,
          padding: "0 6px",
          borderBottom: `1px solid ${COLORS.lineSoft}`,
        }}
      >
        {row.map((cell, c) => {
          const f0 = 86 + (r * 3 + c) * 4;
          const p = Math.min(1, prog(frame, f0, 8) * 1.5);
          const flash = 1 - prog(frame, f0, 16);
          return (
            <span
              key={c}
              style={{
                flex: c === 0 ? "0 0 130px" : 1,
                textAlign: c === 0 ? "left" : "right",
                fontFamily: FONTS.mono,
                fontSize: 22,
                lineHeight: "40px",
                color: c === 2 ? COLORS.clayDark : COLORS.ink,
                opacity: p,
                backgroundColor: `rgba(217,119,87,${(flash * 0.22).toFixed(3)})`,
                borderRadius: 4,
              }}
            >
              {cell}
            </span>
          );
        })}
      </div>
    ))}

    {/* 合计（Agent 自动汇总） */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 44,
        padding: "0 6px",
        marginTop: 6,
        borderTop: `1px solid ${COLORS.line}`,
        opacity: Math.min(1, prog(frame, 156, 12) * 1.6),
      }}
    >
      {["合计", "8,465", "83.0"].map((cell, c) => (
        <span
          key={cell}
          style={{
            flex: c === 0 ? "0 0 130px" : 1,
            textAlign: c === 0 ? "left" : "right",
            fontFamily: FONTS.mono,
            fontSize: 22,
            lineHeight: "44px",
            color: c === 0 ? COLORS.graphite : COLORS.clayDark,
          }}
        >
          {cell}
        </span>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ ② PPT */

const PptBody = ({ frame }: { frame: number }) => {
  const titleP = EASE.outExpo(prog(frame, 156, 32));
  const ruleP = EASE.draw(prog(frame, 176, 26));
  return (
    <div
      style={{
        height: "100%",
        backgroundColor: COLORS.paperWhite,
        border: `1px solid ${COLORS.lineSoft}`,
        borderRadius: 8,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ ...TYPE.sub, fontSize: 17, letterSpacing: "0.14em", color: COLORS.grey }}>WEEKLY REPORT</div>
      <div
        style={{
          ...TYPE.h2cn,
          fontSize: 27,
          lineHeight: 1.3,
          marginTop: 8,
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * 12}px)`,
        }}
      >
        6 月第 2 周 · 运营周报
      </div>
      <div style={{ marginTop: 10, height: 3, width: `${ruleP * 78}%`, backgroundColor: COLORS.clay, borderRadius: 2 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 18 }}>
        {["本周概览", "渠道对比", "下周计划"].map((t, i) => {
          const p = Math.min(1, prog(frame, 176 + i * 14, 10) * 1.6);
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, opacity: p }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: COLORS.clay }} />
              <span style={{ ...TYPE.body, fontSize: 20, color: COLORS.graphite }}>{t}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------- ③ 网页预览 */

const WebBody = ({ frame }: { frame: number }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ ...TYPE.sub, fontSize: 20, color: COLORS.graphite }}>周报看板</span>
      <span style={{ fontFamily: FONTS.mono, fontSize: 15, color: COLORS.grey, opacity: prog(frame, 214, 14) }}>
        近 6 日
      </span>
    </div>
    {/* 柱状（依次升起） */}
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 180, marginTop: 22 }}>
      {BARS.map((v, i) => {
        const p = EASE.outExpo(prog(frame, 206 + i * 8, 34));
        const top = i === 4;
        return (
          <span
            key={i}
            style={{
              flex: 1,
              height: `${v * p * 100}%`,
              borderRadius: 5,
              backgroundColor: top ? COLORS.clay : "rgba(20,20,19,0.72)",
            }}
          />
        );
      })}
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
      {SHEET.map((r) => (
        <span key={r[0]} style={{ flex: 1, textAlign: "center", fontFamily: FONTS.mono, fontSize: 13, color: COLORS.grey }}>
          {r[0].slice(3)}
        </span>
      ))}
    </div>
    <div style={{ height: 1, backgroundColor: COLORS.lineSoft, margin: "18px 0 12px" }} />
    <div style={{ fontFamily: FONTS.mono, fontSize: 16, letterSpacing: "0.06em", color: COLORS.grey, opacity: prog(frame, 292, 14) }}>
      自动生成 · 每周五 17:00
    </div>
  </div>
);
