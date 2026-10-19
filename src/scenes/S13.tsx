/**
 * S13 · 用途一 · 编程（2:15–2:22 · 420f）
 * 左：一句需求卡（TypeIn）｜右：IDE 复刻窗（运行 → 绿勾 → diff 行滑入）+ TaskCard ×2
 */
import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { Card, Chip, MiniWindow, TaskCard } from "../comps/ui";
import { Cursor } from "../comps/Cursor";
import { TypeIn } from "../comps/TypeIn";
import { COLORS, EASE, FONTS } from "../theme";
import { prog } from "../lib/anim";

/* 入场：任务卡式滑入（y32→0 + rot3→0） */
const slide = (frame: number, start: number, dur = 34): CSSProperties => {
  const p = EASE.outExpo(prog(frame, start, dur));
  return {
    opacity: Math.min(1, p * 1.8),
    transform: `translateY(${(1 - p) * 34}px) rotate(${(1 - p) * 2.4}deg)`,
  };
};

const REQ = "给订单列表加一个导出 CSV 的按钮";

const CODE: { n: string; code: string; ink?: boolean }[] = [
  { n: "9", code: 'import { Table } from "./table";' },
  { n: "10", code: 'import { useOrders } from "./hooks";' },
  { n: "11", code: "" },
  { n: "12", code: "export function Orders() {" },
  { n: "13", code: "  const rows = useOrders();", ink: true },
  { n: "14", code: "  return <Table rows={rows} />;" },
  { n: "15", code: "}" },
];

export const S13 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  const fade = Math.min(prog(frame, 0, 10), 1 - prog(frame, dur - 18, 18));

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <AbsoluteFill style={{ opacity: fade }}>
        {/* 章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          用途一 · 编程 ｜ USE CASE 1 — CODING
        </div>

        {/* ---------------- 左：一句需求 ---------------- */}
        <Card style={{ position: "absolute", left: 140, top: 310, width: 620, ...slide(frame, 18) }} padding={26}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <Chip style={{ color: COLORS.clay, borderColor: COLORS.clay }}>一句需求</Chip>
            <span style={{ fontFamily: FONTS.mono, fontSize: 20, letterSpacing: "0.12em", color: COLORS.grey }}>
              ONE-LINE REQUEST
            </span>
          </div>
          <div style={{ ...TYPE.body, fontSize: 34, lineHeight: 1.5, minHeight: 104 }}>
            <TypeIn text={REQ} start={100} cps={12} caretHold={14} />
          </div>
          {frame >= 176 ? (
            <div style={{ ...TYPE.sub, fontSize: 24, color: COLORS.grey, marginTop: 12, opacity: prog(frame, 176, 10) * 0.9 }}>
              Agent 自己拆步骤 —— 你只描述「要什么」
            </div>
          ) : null}
        </Card>

        {/* ---------------- 左：任务卡 ×2 ---------------- */}
        <div style={{ position: "absolute", left: 140, top: 620, width: 620, display: "flex", flexDirection: "column", gap: 16 }}>
          {frame >= 252 ? (
            <div style={slide(frame, 252)}>
              <TaskCard done>改动文件 ×3</TaskCard>
            </div>
          ) : null}
          {frame >= 320 ? (
            <div style={slide(frame, 320)}>
              <TaskCard done>测试通过</TaskCard>
            </div>
          ) : null}
        </div>

        {/* ---------------- 右：IDE 复刻窗 ---------------- */}
        <div style={{ position: "absolute", left: 850, top: 170, ...slide(frame, 30, 40) }}>
          <MiniWindow title="orders.tsx — agent workspace" variant="light" width={930} height={620} bodyStyle={{ padding: "20px 24px" }}>
            {/* 顶栏：文件路径 + 运行按钮 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.grey }}>src/orders.tsx</span>
              <RunPill pressed={frame >= 180} />
            </div>

            {/* 代码区 */}
            <div
              style={{
                marginTop: 16,
                height: 372,
                border: `1px solid ${COLORS.lineSoft}`,
                borderRadius: 8,
                backgroundColor: COLORS.paperWhite,
                padding: "12px 0",
                overflow: "hidden",
              }}
            >
              {CODE.map((l, i) => (
                <CodeRow key={l.n} n={l.n} code={l.code} dim={l.ink} opacity={prog(frame, 44 + i * 5, 12)} />
              ))}

              {/* diff 行滑入 */}
              {frame >= 252 ? (
                <>
                  <DiffRow
                    n="14"
                    code="  return <Table rows={rows} />;"
                    kind="del"
                    start={252}
                    frame={frame}
                    index={0}
                  />
                  <DiffRow
                    n="14"
                    code="  const csv = toCsv(rows);"
                    kind="add"
                    start={262}
                    frame={frame}
                    index={1}
                  />
                  <DiffRow
                    n="15"
                    code="  return <Table rows={rows} onExport={csv} />;"
                    kind="add"
                    start={272}
                    frame={frame}
                    index={2}
                  />
                </>
              ) : null}
            </div>

            {/* 命令条 + 结果 */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2, minHeight: 92 }}>
              {frame >= 184 ? (
                <div style={{ ...TYPE.term, fontSize: 26, color: COLORS.ink }}>
                  <span style={{ color: COLORS.clay }}>❯ </span>
                  <TypeIn text="npx vitest run" start={186} cps={16} caret={false} />
                </div>
              ) : null}
              <div style={{ ...TYPE.term, fontSize: 26, height: 44 }}>
                {frame >= 240 ? (
                  <span style={{ color: COLORS.termGreen, opacity: Math.min(1, prog(frame, 240, 8) * 1.6) }}>
                    ✓ 12 tests passed · 3 files changed
                  </span>
                ) : null}
              </div>
            </div>
          </MiniWindow>
        </div>

        {/* 绿勾浮标（贴住窗口右下角） */}
        {frame >= 240 ? <CheckBadge frame={frame} start={240} /> : null}

        {/* ---------------- 主文案 ---------------- */}
        <div style={{ position: "absolute", left: 140, bottom: 96 }}>
          <div style={{ ...TYPE.body, fontSize: 40 }}>
            用途一：写代码。描述需求，Agent 动手改文件——你只审查结果。
          </div>
          <div style={{ ...TYPE.en, fontStyle: "italic", fontSize: 32, color: COLORS.grey, marginTop: 10 }}>
            Use case 1: coding. Describe it; the agent edits files; you review the diff.
          </div>
        </div>

        {/* ---------------- 光标 ---------------- */}
        <Cursor
          path={[
            { x: 1700, y: 902, f: 34 },
            { x: 640, y: 470, f: 92 },
            { x: 640, y: 470, f: 100 },
            { x: 1700, y: 292, f: 172 },
            { x: 1700, y: 292, f: 180 },
          ]}
          clicks={[100, 180]}
          appearAt={34}
          vanishAt={230}
        />
      </AbsoluteFill>

      <Sequence from={100} durationInFrames={60}>
        <Audio src={staticFile("sfx/key-type.wav")} />
      </Sequence>
      <Sequence from={180} durationInFrames={50}>
        <Audio src={staticFile("sfx/enter-click.wav")} />
      </Sequence>
      <Sequence from={240} durationInFrames={80}>
        <Audio src={staticFile("sfx/success-chime.wav")} />
      </Sequence>
    </PaperStage>
  );
};

/* ---------------------------------------------------------------- 局部零件 */

const RunPill = ({ pressed }: { pressed: boolean }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: FONTS.mono,
      fontSize: 20,
      letterSpacing: "0.08em",
      color: pressed ? COLORS.paperWhite : COLORS.clay,
      backgroundColor: pressed ? COLORS.clay : "rgba(217,119,87,0.10)",
      border: `1px solid ${COLORS.clay}`,
      borderRadius: 8,
      padding: "7px 16px",
    }}
  >
    ▶ 运行
  </span>
);

const CodeRow = ({ n, code, dim, opacity }: { n: string; code: string; dim?: boolean; opacity: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, height: 34, padding: "0 22px", opacity }}>
    <span style={{ fontFamily: FONTS.mono, fontSize: 24, lineHeight: "34px", color: COLORS.grey, opacity: 0.6, width: 34, textAlign: "right" }}>{n}</span>
    <span style={{ fontFamily: FONTS.mono, fontSize: 24, lineHeight: "34px", color: dim ? COLORS.clay : COLORS.ink }}>{code}</span>
  </div>
);

const DiffRow = ({
  n,
  code,
  kind,
  start,
  frame,
  index,
}: {
  n: string;
  code: string;
  kind: "add" | "del";
  start: number;
  frame: number;
  index: number;
}) => {
  const p = Easing.bezier(0.16, 1, 0.3, 1)(prog(frame, start, 26));
  const add = kind === "add";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        height: 34,
        padding: "0 22px",
        marginTop: index === 0 ? 8 : 0,
        opacity: p,
        transform: `translateX(${(1 - p) * 46}px)`,
        backgroundColor: add ? "rgba(217,119,87,0.12)" : "transparent",
        borderLeft: `3px solid ${add ? COLORS.clay : "rgba(20,20,19,0.14)"}`,
        position: "relative",
      }}
    >
      <span style={{ fontFamily: FONTS.mono, fontSize: 24, lineHeight: "34px", color: COLORS.grey, opacity: 0.55, width: 34, textAlign: "right" }}>{n}</span>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 24,
          lineHeight: "34px",
          color: add ? COLORS.ink : COLORS.grey,
          textDecoration: add ? "none" : "line-through",
          opacity: add ? 1 : 0.75,
        }}
      >
        {code}
      </span>
    </div>
  );
};

const CheckBadge = ({ frame, start }: { frame: number; start: number }) => {
  const p = EASE.outExpo(prog(frame, start, 30));
  const pop = 1 + (1 - p) * 0.35;
  return (
    <div
      style={{
        position: "absolute",
        left: 1690,
        top: 700,
        width: 104,
        height: 104,
        borderRadius: "50%",
        backgroundColor: COLORS.paperWhite,
        border: `2px solid ${COLORS.termGreen}`,
        boxShadow: "0 18px 44px rgba(31,30,29,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${pop})`,
      }}
    >
      <svg width="54" height="54" viewBox="0 0 24 24">
        <path d="M4 12.8 L9.4 18 L20 7" fill="none" stroke={COLORS.termGreen} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
