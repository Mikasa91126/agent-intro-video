import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { PaperStage } from "../comps/PaperStage";
import { FadeText } from "../comps/Text";
import { TYPE } from "../comps/type";
import { COLORS, EASE, FONTS, SCENE_TITLES } from "../theme";
import { clamp01, mulberry32 } from "../lib/anim";

/* ------------------------------------------------------------------ 几何 */

const HUB = { x: 960, y: 620 };
const TOOLS = [
  { y: 390, name: "文件" },
  { y: 510, name: "数据库" },
  { y: 630, name: "浏览器" },
  { y: 750, name: "日历" },
  { y: 870, name: "代码" },
];
const AGENTS = [
  { y: 470, star: false },
  { y: 640, star: true },
  { y: 810, star: false },
];

/** 干净扇形连线：左列工具 → 接口；接口 → 右列 agent */
const FAN_L = TOOLS.map((t) => `M 386 ${t.y} C 620 ${t.y}, 780 ${HUB.y}, ${HUB.x - 48} ${HUB.y}`);
const FAN_R = AGENTS.map((a) => `M ${HUB.x + 48} ${HUB.y} C 1150 ${HUB.y}, 1320 ${a.y}, ${1572} ${a.y}`);

/** 「无标准」：混乱贝塞尔线团（确定性种子） */
const CHAOS: string[] = (() => {
  const rnd = mulberry32(20261017);
  return Array.from({ length: 15 }, () => {
    const xA = 400 + rnd() * 70;
    const yA = 350 + rnd() * 560;
    const xB = 1500 + rnd() * 70;
    const yB = 420 + rnd() * 440;
    const c1x = 480 + rnd() * 460;
    const c1y = 280 + rnd() * 640;
    const c2x = 900 + rnd() * 480;
    const c2y = 280 + rnd() * 640;
    return `M ${xA.toFixed(0)} ${yA.toFixed(0)} C ${c1x.toFixed(0)} ${c1y.toFixed(0)}, ${c2x.toFixed(0)} ${c2y.toFixed(0)}, ${xB.toFixed(0)} ${yB.toFixed(0)}`;
  });
})();

/* ------------------------------------------------------------------ 小件 */

const Head = ({ kicker, cn, en }: { kicker: string; cn: ReactNode; en: string }) => {
  const frame = useCurrentFrame();
  const ruleP = EASE.outExpo(clamp01((frame - 6) / 26));
  return (
    <div style={{ position: "absolute", left: 140, top: 96, width: 1400 }}>
      <FadeText start={0} y={0} dur={18}>
        <div style={{ ...TYPE.label }}>{kicker}</div>
      </FadeText>
      <div style={{ position: "absolute", left: 0, top: 52, display: "flex", gap: 26 }}>
        <div
          style={{
            width: 3,
            borderRadius: 2,
            backgroundColor: COLORS.clay,
            transform: `scaleY(${ruleP})`,
            transformOrigin: "top",
          }}
        />
        <div>
          <FadeText start={6} y={14} dur={46}>
            <div
              style={{
                fontFamily: FONTS.serifCN,
                fontWeight: 400,
                fontSize: 42,
                lineHeight: 1.42,
                letterSpacing: "0.02em",
                color: COLORS.ink,
                maxWidth: 1180,
              }}
            >
              {cn}
            </div>
          </FadeText>
          <FadeText start={16} y={10} dur={46}>
            <div
              style={{
                fontFamily: FONTS.serifLatin,
                fontStyle: "italic",
                fontSize: 28,
                lineHeight: 1.4,
                color: COLORS.graphite,
                marginTop: 8,
              }}
            >
              {en}
            </div>
          </FadeText>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------ 工具图元（线稿） */

const G = ({ children }: { children: ReactNode }) => (
  <svg width={58} height={58} viewBox="0 0 100 100" fill="none" stroke={COLORS.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ToolGlyph = ({ i }: { i: number }) => {
  if (i === 0)
    // 文件
    return (
      <G>
        <path d="M24 12 H58 L78 34 V82 A6 6 0 0 1 72 88 H24 A6 6 0 0 1 18 82 V18 A6 6 0 0 1 24 12 Z" />
        <path d="M58 12 V34 H78" />
        <path d="M32 56 H64" />
        <path d="M32 70 H54" />
      </G>
    );
  if (i === 1)
    // 数据库
    return (
      <G>
        <path d="M20 26 a30 12 0 1 1 60 0 a30 12 0 1 1 -60 0" />
        <path d="M20 26 V74" />
        <path d="M80 26 V74" />
        <path d="M20 50 a30 12 0 0 0 60 0" />
        <path d="M20 74 a30 12 0 0 0 60 0" />
      </G>
    );
  if (i === 2)
    // 浏览器
    return (
      <G>
        <rect x={8} y={18} width={84} height={66} rx={10} />
        <path d="M8 38 H92" />
        <circle cx={21} cy={28} r={2.6} fill={COLORS.ink} />
        <circle cx={33} cy={28} r={2.6} fill={COLORS.ink} />
        <path d="M26 56 H74" />
        <path d="M26 70 H58" />
      </G>
    );
  if (i === 3)
    // 日历
    return (
      <G>
        <rect x={10} y={22} width={80} height={68} rx={10} />
        <path d="M10 44 H90" />
        <path d="M32 12 V30" />
        <path d="M68 12 V30" />
        {[56, 68, 80].map((y) =>
          [26, 50, 74].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3.4} fill={COLORS.ink} stroke="none" />),
        )}
      </G>
    );
  // 代码
  return (
    <G>
      <path d="M34 24 L12 50 L34 76" />
      <path d="M66 24 L88 50 L66 76" />
      <path d="M56 18 L44 82" />
    </G>
  );
};

/** 星形（Claude） */
const Star = ({ size = 62 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={COLORS.clay} strokeWidth={11} strokeLinecap="round">
    {[0, 45, 90, 135].map((a) => (
      <path key={a} d="M 50 16 V 84" transform={`rotate(${a} 50 50)`} />
    ))}
  </svg>
);

/* ------------------------------------------------------------------- 场景 */

/** S05 · MCP 标准（42s–52s · 600f） */
export const S05 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  // settle 入场
  const inP = EASE.outExpo(clamp01((frame - 2) / 30));
  const inOp = clamp01(frame / 14);

  // 左列工具 / 右列 agent
  const toolP = (i: number) => EASE.outExpo(clamp01((frame - 8 - i * 5) / 22));
  const agentP = (i: number) => EASE.outExpo(clamp01((frame - 44 - i * 8) / 24));

  // 混乱线团
  const chaosOp = clamp01((frame - 20) / 24) * (1 - clamp01((frame - 168) / 34));
  const chaosDraw = (i: number) => EASE.draw(clamp01((frame - 20 - i * 3) / 26));

  // 接口落下
  const dropP = clamp01((frame - 140) / 26);
  const dropY = 470 + (HUB.y - 470) * EASE.outExpo(dropP);
  const hubIn = clamp01((frame - 138) / 10);
  const squash = 1 + 0.12 * Math.exp(-Math.max(0, frame - 166) / 9) * (frame >= 166 ? 1 : 0);

  // 干净扇形
  const fanDraw = (i: number) => EASE.outExpo(clamp01((frame - 198 - i * 4) / 40));
  const fanLenL = FAN_L.map((d) => getLength(d));
  const fanLenR = FAN_R.map((d) => getLength(d));

  // 数据包
  const pkt = (path: string, len: number, i: number) => {
    if (frame < 280) return null;
    const t = (((frame - 280) / 150 + i * 0.22) % 1);
    const p = getPointAtLength(path, len * t);
    if (!p) return null;
    const fade = Math.min(1, Math.min(t, 1 - t) * 5);
    return { x: p.x, y: p.y, o: fade };
  };

  // 标签
  const labelP = EASE.outExpo(clamp01((frame - 250) / 26));

  // 退场：settle 收
  const exP = clamp01((frame - (dur - 14)) / 14);

  return (
    <PaperStage dur={dur} tone="medium" grid>
      <Sequence from={196} durationInFrames={40}>
        <Audio src={staticFile("sfx/whoosh.wav")} />
      </Sequence>
      <Sequence from={166} durationInFrames={60}>
        <Audio src={staticFile("sfx/ui-ping.wav")} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: inOp * (1 - exP),
          transform: `scale(${(1.03 - 0.03 * inP) * (1 - 0.015 * exP)})`,
        }}
      >
        <Head
          kicker={`科普 05 · ${SCENE_TITLES[4]}`}
          cn={
            <>
              MCP：给 AI 装一个统一接口——
              <br />
              像 USB-C，一次接通所有工具。
            </>
          }
          en="MCP: one port for every tool—the USB-C of AI."
        />

        {/* 混乱线团 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {CHAOS.map((d, i) => {
            const len = getLength(d);
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={COLORS.ink}
                strokeOpacity={0.3 * chaosOp}
                strokeWidth={1.6}
                strokeDasharray={`${len} ${len}`}
                strokeDashoffset={len * (1 - chaosDraw(i))}
              />
            );
          })}
        </svg>

        {/* 干净扇形（接口两侧） */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {FAN_L.map((d, i) => (
            <path
              key={`l${i}`}
              d={d}
              fill="none"
              stroke={COLORS.ink}
              strokeOpacity={0.34}
              strokeWidth={2}
              strokeDasharray={`${fanLenL[i]} ${fanLenL[i]}`}
              strokeDashoffset={fanLenL[i] * (1 - fanDraw(i))}
            />
          ))}
          {FAN_R.map((d, i) => (
            <path
              key={`r${i}`}
              d={d}
              fill="none"
              stroke={COLORS.ink}
              strokeOpacity={0.34}
              strokeWidth={2}
              strokeDasharray={`${fanLenR[i]} ${fanLenR[i]}`}
              strokeDashoffset={fanLenR[i] * (1 - fanDraw(i + 1))}
            />
          ))}
          {frame >= 280
            ? [
                ...FAN_L.map((d, i) => ({ d, len: fanLenL[i], i })),
                ...FAN_R.map((d, i) => ({ d, len: fanLenR[i], i: i + FAN_L.length })),
              ].map((f, k) => {
                const p = pkt(f.d, f.len, k);
                return p ? <circle key={k} cx={p.x} cy={p.y} r={6} fill={COLORS.clay} opacity={p.o} /> : null;
              })
            : null}
        </svg>

        {/* 左列 · 工具 */}
        {TOOLS.map((t, i) => (
          <div key={i} style={{ opacity: toolP(i) }}>
            <div
              style={{
                position: "absolute",
                left: 140,
                top: t.y - 46,
                width: 146,
                textAlign: "right",
                fontFamily: FONTS.sansCN,
                fontSize: 28,
                letterSpacing: "0.08em",
                color: COLORS.graphite,
                lineHeight: "92px",
              }}
            >
              {t.name}
            </div>
            <div
              style={{
                position: "absolute",
                left: 294,
                top: t.y - 46,
                width: 92,
                height: 92,
                borderRadius: 16,
                backgroundColor: COLORS.paperWhite,
                border: `1px solid ${COLORS.line}`,
                boxShadow: "0 14px 34px rgba(31,30,29,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateX(${(1 - toolP(i)) * -16}px)`,
              }}
            >
              <ToolGlyph i={i} />
            </div>
          </div>
        ))}

        {/* 右列 · agent */}
        {AGENTS.map((a, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 1600 - 32,
              top: a.y - 32,
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: agentP(i),
              transform: `scale(${0.7 + 0.3 * agentP(i)})`,
            }}
          >
            {a.star ? (
              <Star />
            ) : (
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 99,
                  backgroundColor: COLORS.ink,
                  opacity: 0.82,
                }}
              />
            )}
          </div>
        ))}

        {/* 接口（陶土 USB-C） */}
        <div
          style={{
            position: "absolute",
            left: HUB.x - 48,
            top: dropY - 84,
            width: 96,
            height: 168,
            borderRadius: 34,
            backgroundColor: COLORS.clay,
            boxShadow: "0 22px 50px rgba(198,97,63,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hubIn,
            transform: `scaleY(${squash})`,
          }}
        >
          <div
            style={{
              width: 44,
              height: 124,
              borderRadius: 22,
              backgroundColor: COLORS.paperWhite,
            }}
          />
        </div>

        {/* 标签 */}
        <FadeText start={250} y={12} dur={40} style={{ position: "absolute", left: HUB.x - 300, top: 742, width: 600, textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 46, letterSpacing: "0.26em", color: COLORS.ink }}>MCP</div>
        </FadeText>
        <FadeText start={264} y={10} dur={40} style={{ position: "absolute", left: HUB.x - 400, top: 812, width: 800, textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 23, letterSpacing: "0.08em", color: COLORS.grey, opacity: labelP }}>
            开源标准 · 由 Anthropic 提出（2024-11）
          </div>
        </FadeText>
      </AbsoluteFill>
    </PaperStage>
  );
};
