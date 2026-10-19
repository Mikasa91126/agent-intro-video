/**
 * S14 · 用途二 · 研究（2:22–2:29 · 420f）
 * 浏览器标签扇面叠开（每张「已读 ✓」）→ 收拢成一份报告卡（引用角标逐条亮）
 */
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { Card } from "../comps/ui";
import { DrawPath } from "../comps/wire";
import { COLORS, FONTS } from "../theme";
import { prog } from "../lib/anim";

const SLIDE = Easing.bezier(0.16, 1, 0.3, 1);

/** 扇面 6 张来源卡 */
const SOURCES = [
  "检索 · 「agent 定价 对比」",
  "官方文档 · 快速开始",
  "公开报道 · 行业观察",
  "定价页 · 按量计费",
  "评测 · 权限与审计",
  "社区 · 实战经验",
];

/** 报告卡要点（引用角标 1/2/3） */
const POINTS: { text: string; cite: number }[] = [
  { text: "12 份样本：定价、端侧支持、权限模型", cite: 1 },
  { text: "共性：按量计费 + 企业级审批开关", cite: 2 },
  { text: "差异：上下文窗口与并发上限", cite: 3 },
];

const REFS = ["官方文档", "公开报道", "官方定价页"];

const FAN_START = 24;
const FAN_STAGGER = 7;
const CARD_TOP = 400;
const PIVOT_Y = 812;
const COLLAPSE = 196;

export const S14 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(prog(frame, 0, 10), 1 - prog(frame, dur - 18, 18));

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <AbsoluteFill style={{ opacity: fade }}>
        {/* 章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          用途二 · 研究 ｜ USE CASE 2 — RESEARCH
        </div>

        {/* 角落小注 */}
        <div
          style={{
            position: "absolute",
            right: 140,
            top: 100,
            fontFamily: FONTS.mono,
            fontSize: 22,
            letterSpacing: "0.1em",
            color: COLORS.grey,
            opacity: prog(frame, 330, 14) * 0.85,
          }}
        >
          ChatGPT Work / Gemini / 联网检索（示例）
        </div>

        {/* ---------------- 来源扇面 ---------------- */}
        {SOURCES.map((title, i) => (
          <SourceCard key={title} i={i} title={title} frame={frame} />
        ))}

        {/* 汇聚细线 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <DrawPath d="M 770 384 C 900 384, 930 306, 1002 306" start={200} dur={34} width={2} opacity={0.38} endDot={false} />
          <DrawPath d="M 812 560 C 920 560, 930 560, 1002 560" start={206} dur={34} width={2} opacity={0.38} endDot={false} />
          <DrawPath d="M 770 700 C 900 700, 930 780, 1002 780" start={212} dur={34} width={2} opacity={0.38} endDot={false} />
        </svg>

        {/* ---------------- 报告卡（虚线占位 → 实体） ---------------- */}
        {frame >= 56 && frame < 246 ? <ReportPlaceholder frame={frame} /> : null}
        {frame >= 206 ? <ReportCard frame={frame} /> : null}

        {/* ---------------- 主文案 ---------------- */}
        <div style={{ position: "absolute", left: 140, bottom: 96, maxWidth: 1500 }}>
          <div style={{ ...TYPE.body, fontSize: 40 }}>
            用途二：做研究。几十个来源，一杯咖啡的时间，回来一份带引用的报告。
          </div>
          <div style={{ ...TYPE.en, fontStyle: "italic", fontSize: 32, color: COLORS.grey, marginTop: 10 }}>
            Use case 2: research. Dozens of sources, one coffee break, a sourced report.
          </div>
        </div>
      </AbsoluteFill>

      {[0, 1, 2].map((i) => (
        <Sequence key={i} from={FAN_START + i * 21} durationInFrames={40}>
          <Audio src={staticFile("sfx/page-flip.wav")} />
        </Sequence>
      ))}
      <Sequence from={288} durationInFrames={70}>
        <Audio src={staticFile("sfx/confirm-click.wav")} />
      </Sequence>
    </PaperStage>
  );
};

/* ---------------------------------------------------------------- 来源卡 */

const SourceCard = ({ i, title, frame }: { i: number; title: string; frame: number }) => {
  const start = FAN_START + i * FAN_STAGGER;
  const p = SLIDE(prog(frame, start, 42));
  /** 收拢：飞向报告卡并淡出 */
  const c = SLIDE(prog(frame, COLLAPSE + i * 5, 30));
  const rot = -18 + i * 7.2;
  const readP = Math.min(1, prog(frame, start + 18, 10) * 1.7);

  return (
    <div
      style={{
        position: "absolute",
        left: 400 + (i - 2.5) * 34 + c * 300,
        top: CARD_TOP,
        width: 380,
        height: 236,
        transformOrigin: `50% ${PIVOT_Y - CARD_TOP}px`,
        transform: `rotate(${rot}deg) translateY(${(1 - p) * 92}px) scale(${(0.94 + p * 0.06) * (1 - c * 0.4)})`,
        opacity: p * (1 - c),
      }}
    >
      <Card tone="light" padding={0} radius={12} style={{ height: "100%", overflow: "hidden", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderBottom: `1px solid ${COLORS.lineSoft}`,
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: 99, backgroundColor: "rgba(20,20,19,0.2)" }} />
          <span style={{ width: 9, height: 9, borderRadius: 99, backgroundColor: "rgba(20,20,19,0.2)" }} />
          <span style={{ fontFamily: FONTS.mono, fontSize: 16, color: COLORS.grey, marginLeft: 6 }}>{title}</span>
        </div>
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 13 }}>
          {[
            { w: "100%", d: 6 },
            { w: "92%", d: 12 },
            { w: "68%", d: 18 },
          ].map((b) => (
            <span
              key={b.w}
              style={{
                display: "block",
                width: b.w,
                height: 11,
                borderRadius: 6,
                backgroundColor: "rgba(20,20,19,0.13)",
                opacity: prog(frame, start + b.d, 12),
              }}
            />
          ))}
        </div>
        {/* 已读 ✓ */}
        <div
          style={{
            position: "absolute",
            right: 14,
            bottom: 12,
            opacity: readP,
            transform: `translateY(${(1 - readP) * 8}px)`,
            fontFamily: FONTS.mono,
            fontSize: 17,
            letterSpacing: "0.08em",
            color: COLORS.grey,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          已读
          <span style={{ color: COLORS.clay, fontSize: 19, lineHeight: 1 }}>✓</span>
        </div>
      </Card>
    </div>
  );
};

/* ------------------------------------------------------- 报告占位（汇总中） */

const ReportPlaceholder = ({ frame }: { frame: number }) => {
  const p = SLIDE(prog(frame, 56, 40));
  const out = prog(frame, 210, 30);
  const gen = Math.min(1, prog(frame, 70, 130));
  return (
    <div
      style={{
        position: "absolute",
        left: 1002,
        top: 170,
        width: 778,
        height: 570,
        border: `1.5px dashed rgba(20,20,19,0.16)`,
        borderRadius: 16,
        opacity: p * (1 - out),
        transform: `translateY(${(1 - p) * 24}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      <span style={{ fontFamily: FONTS.mono, fontSize: 24, letterSpacing: "0.14em", color: COLORS.grey }}>
        正在汇总来源 · GENERATING REPORT
      </span>
      <span style={{ display: "block", width: 340, height: 4, borderRadius: 99, backgroundColor: "rgba(20,20,19,0.10)" }}>
        <span style={{ display: "block", width: `${gen * 100}%`, height: 4, borderRadius: 99, backgroundColor: COLORS.clay }} />
      </span>
      <span style={{ fontFamily: FONTS.mono, fontSize: 20, letterSpacing: "0.1em", color: COLORS.clay }}>
        {Math.round(gen * 12)} / 12 来源
      </span>
    </div>
  );
};

/* ---------------------------------------------------------------- 报告卡 */

const ReportCard = ({ frame }: { frame: number }) => {
  const p = SLIDE(prog(frame, 206, 44));
  return (
    <div
      style={{
        position: "absolute",
        left: 1002,
        top: 170,
        width: 778,
        opacity: p,
        transform: `translateY(${(1 - p) * 28}px)`,
      }}
    >
      <Card tone="light" padding={40} style={{ height: 570 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={{ ...TYPE.h2cn, fontSize: 40, letterSpacing: "0.04em" }}>研究报告 · 竞品调研</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.grey, letterSpacing: "0.1em" }}>
            12 SOURCES
          </span>
        </div>
        <div style={{ height: 1, backgroundColor: COLORS.lineSoft, margin: "22px 0 28px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {POINTS.map((pt, i) => (
            <CiteLine key={pt.cite} point={pt} start={224 + i * 18} frame={frame} />
          ))}
        </div>

        <div style={{ height: 1, backgroundColor: COLORS.lineSoft, margin: "34px 0 22px" }} />

        <div style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.grey, letterSpacing: "0.12em" }}>
          来源 / SOURCES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
          {REFS.map((r, i) => {
            const rp = Math.min(1, prog(frame, 282 + i * 8, 10) * 1.6);
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, opacity: rp }}>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 16,
                    width: 22,
                    height: 22,
                    lineHeight: "21px",
                    textAlign: "center",
                    borderRadius: 99,
                    border: `1px solid ${COLORS.clay}`,
                    color: COLORS.clay,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ ...TYPE.sub, fontSize: 24, color: COLORS.graphite }}>{r}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

const CiteLine = ({
  point,
  start,
  frame,
}: {
  point: { text: string; cite: number };
  start: number;
  frame: number;
}) => {
  const p = SLIDE(prog(frame, start, 14));
  const lit = Math.min(1, prog(frame, start, 18) * 1.6);
  return (
    <div style={{ opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
      <span style={{ ...TYPE.body, fontSize: 26, lineHeight: 1.5, color: COLORS.ink }}>{point.text}</span>
      <span
        style={{
          display: "inline-block",
          marginLeft: 10,
          verticalAlign: "super",
          fontFamily: FONTS.mono,
          fontSize: 15,
          lineHeight: "20px",
          width: 20,
          height: 20,
          textAlign: "center",
          borderRadius: 99,
          backgroundColor: COLORS.clay,
          color: COLORS.paperWhite,
          opacity: lit,
          transform: `scale(${0.6 + lit * 0.4})`,
        }}
      >
        {point.cite}
      </span>
    </div>
  );
};
