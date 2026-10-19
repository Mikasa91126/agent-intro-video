/**
 * S18 · 指导三 · 入门路径（2:47–2:52 · 300f）
 * 三张路径小卡滑动推进（stagger 0.12s）→ 陶土数据点沿路径走到终点 → 亮起陶土对勾。
 */
import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { Card } from "../comps/ui";
import { COLORS, EASE, FONTS } from "../theme";
import { prog } from "../lib/anim";

const CARD_W = 400;
const CARD_H = 300;
const CARD_Y = 290;
const LANE_Y = 652; // 卡片下方的路径带
const PATH_Y = CARD_Y + CARD_H / 2; // 440 卡片中线

const STEPS = [
  { n: "01", cn: "上传一份文件", en: "UPLOAD A FILE", icon: "upload" as const, x: 140 },
  { n: "02", cn: "要一份表格", en: "ASK FOR A TABLE", icon: "table" as const, x: 600 },
  { n: "03", cn: "先预览，别改原文件", en: "PREVIEW — DON'T OVERWRITE", icon: "eye" as const, x: 1060 },
];
const CHECK = { x: 1640, y: PATH_Y, r: 86 };

const CARD_AT = [24, 31, 38];
/** 数据点：沿路径带右行 → 在终点折上 → 落进对勾 */
const DOT_AT = [
  { x: 140, y: LANE_Y, f: 60 },
  { x: 600, y: LANE_Y, f: 100 },
  { x: 1060, y: LANE_Y, f: 136 },
  { x: CHECK.x, y: LANE_Y, f: 166 },
  { x: CHECK.x, y: CHECK.y, f: 190 },
];

const slide = (frame: number, start: number, dur = 34): CSSProperties => {
  const p = EASE.outExpo(prog(frame, start, dur));
  return { opacity: Math.min(1, p * 1.9), transform: `translateY(${(1 - p) * 34}px) rotate(${(1 - p) * 2.4}deg)` };
};

export const S18 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(prog(frame, 0, 10), 1 - prog(frame, dur - 18, 18));

  // 数据点沿路径推进
  let dotX = DOT_AT[0].x;
  let dotY = DOT_AT[0].y;
  for (let i = 1; i < DOT_AT.length; i++) {
    const a = DOT_AT[i - 1];
    const b = DOT_AT[i];
    if (frame <= a.f) break;
    const t = EASE.draw(Math.min(1, (frame - a.f) / (b.f - a.f)));
    dotX = a.x + (b.x - a.x) * t;
    dotY = a.y + (b.y - a.y) * t;
  }
  const dotO = Math.min(1, prog(frame, 56, 12) * 1.6) * (1 - prog(frame, 188, 8));

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <AbsoluteFill style={{ opacity: fade }}>
        {/* 章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          指导三 · 入门路径 ｜ GET STARTED
        </div>

        {/* 路径带（卡片下方，无遮挡） */}
        <span
          style={{
            position: "absolute",
            left: 140,
            top: LANE_Y,
            width: CHECK.x - 140,
            borderTop: `1.5px dashed rgba(20,20,19,0.24)`,
            opacity: prog(frame, 52, 24),
          }}
        />
        <span
          style={{
            position: "absolute",
            left: CHECK.x,
            top: CHECK.y + CHECK.r,
            height: LANE_Y - CHECK.y - CHECK.r,
            borderLeft: `1.5px dashed rgba(20,20,19,0.24)`,
            opacity: prog(frame, 52, 24),
          }}
        />
        {[STEPS[1].x - 26, STEPS[2].x - 24].map((x) => (
          <svg key={x} width={14} height={14} viewBox="0 0 14 14" style={{ position: "absolute", left: x, top: LANE_Y - 7, opacity: prog(frame, 56, 20) * 0.7 }}>
            <path d="M1.5 2 L11 7 L1.5 12 Z" fill="rgba(20,20,19,0.4)" />
          </svg>
        ))}

        {/* 三张路径小卡 */}
        {STEPS.map((s, i) => (
          <div key={s.n} style={{ position: "absolute", left: s.x, top: CARD_Y, width: CARD_W, ...slide(frame, CARD_AT[i]) }}>
            <Card tone="light" padding={30} style={{ height: CARD_H }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 99,
                    backgroundColor: COLORS.clay,
                    color: COLORS.paperWhite,
                    fontFamily: FONTS.mono,
                    fontSize: 19,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 18, letterSpacing: "0.16em", color: COLORS.grey }}>STEP {s.n}</span>
              </div>
              <div style={{ marginTop: 34 }}>
                <Glyph kind={s.icon} />
              </div>
              <div style={{ ...TYPE.body, fontSize: 32, color: COLORS.ink, marginTop: 30, lineHeight: 1.3 }}>{s.cn}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 17, letterSpacing: "0.08em", color: COLORS.grey, marginTop: 10 }}>
                {s.en}
              </div>
            </Card>
          </div>
        ))}

        {/* 终点：陶土对勾 */}
        <EndCheck frame={frame} />

        {/* 沿路径推进的陶土数据点 */}
        {dotO > 0.001 ? (
          <span
            style={{
              position: "absolute",
              left: dotX - 9,
              top: dotY - 9,
              width: 18,
              height: 18,
              borderRadius: 99,
              backgroundColor: COLORS.clay,
              opacity: dotO,
              boxShadow: "0 4px 12px rgba(217,119,87,0.45)",
            }}
          />
        ) : null}

        {/* ---------------- 主文案 ---------------- */}
        <div style={{ position: "absolute", left: 140, bottom: 96, maxWidth: 1560 }}>
          <div style={{ ...TYPE.body, fontSize: 40 }}>
            今天就能试：上传一份文件，要一份表格——先预览，别改原文件。
          </div>
          <div style={{ ...TYPE.en, fontStyle: "italic", fontSize: 32, color: COLORS.grey, marginTop: 10 }}>
            Try it today: upload a file, ask for a table—preview first, never overwrite.
          </div>
        </div>
      </AbsoluteFill>

      {CARD_AT.map((f) => (
        <Sequence key={f} from={f} durationInFrames={40}>
          <Audio src={staticFile("sfx/ui-ping.wav")} />
        </Sequence>
      ))}
      <Sequence from={190} durationInFrames={80}>
        <Audio src={staticFile("sfx/success-chime.wav")} />
      </Sequence>
    </PaperStage>
  );
};

/* -------------------------------------------------------------- 卡片图标 */

const Glyph = ({ kind }: { kind: "upload" | "table" | "eye" }) => {
  const common = { fill: "none", stroke: COLORS.ink, strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={46} height={46} viewBox="0 0 24 24">
      {kind === "upload" ? (
        <>
          <path d="M12 16.5V3.6" {...common} />
          <path d="M7.2 8.4L12 3.6l4.8 4.8" {...common} />
          <path d="M4 15.5v3.4a1.6 1.6 0 0 0 1.6 1.6h12.8a1.6 1.6 0 0 0 1.6-1.6v-3.4" {...common} />
        </>
      ) : kind === "table" ? (
        <>
          <rect x="3" y="4.5" width="18" height="15" rx="2" {...common} />
          <path d="M3 9.8h18M3 14.6h18M9.4 4.5v15" {...common} />
        </>
      ) : (
        <>
          <path d="M2.2 12S6 5.8 12 5.8 21.8 12 21.8 12 18 18.2 12 18.2 2.2 12 2.2 12Z" {...common} />
          <circle cx="12" cy="12" r="3.1" {...common} />
        </>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------ 终点 */

const EndCheck = ({ frame }: { frame: number }) => {
  const target = prog(frame, 58, 22); // 虚线靶（预告）
  const land = EASE.outExpo(prog(frame, 186, 30));
  const draw = EASE.draw(prog(frame, 196, 24));
  const size = CHECK.r * 2;
  return (
    <div style={{ position: "absolute", left: CHECK.x - CHECK.r, top: CHECK.y - CHECK.r, width: size, height: size }}>
      {/* 虚线靶 */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `1.5px dashed rgba(20,20,19,0.2)`,
          opacity: target * (1 - land),
        }}
      />
      {/* 陶土圆 + 对勾 */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: COLORS.clay,
          boxShadow: "0 18px 44px rgba(217,119,87,0.35)",
          opacity: Math.min(1, land * 1.8),
          transform: `scale(${0.7 + land * 0.3})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={96} height={96} viewBox="0 0 24 24">
          <path
            d="M4.4 12.6 L9.6 18 L19.8 6.6"
            fill="none"
            stroke={COLORS.paperWhite}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="26"
            strokeDashoffset={26 * (1 - draw)}
          />
        </svg>
      </span>
      {/* 落定涟漪 */}
      {frame >= 186 && frame < 206 ? (
        <span
          style={{
            position: "absolute",
            inset: -prog(frame, 186, 20) * 40,
            borderRadius: "50%",
            border: `2px solid ${COLORS.clay}`,
            opacity: (1 - prog(frame, 186, 20)) * 0.6,
          }}
        />
      ) : null}
    </div>
  );
};
