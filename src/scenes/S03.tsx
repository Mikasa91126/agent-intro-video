import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { PaperStage } from "../comps/PaperStage";
import { FadeText } from "../comps/Text";
import { TYPE } from "../comps/type";
import { COLORS, EASE, FONTS, SCENE_TITLES } from "../theme";
import { breathe, clamp01 } from "../lib/anim";

/* ------------------------------------------------------------------ 几何 */

const A = { x: 960, y: 470 }; // 大脑（陶土圆）
const B = { x: 600, y: 800 }; // 手脚（白方手）
const C = { x: 1320, y: 800 }; // 循环（环形箭头）
const RING = `M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} Z`;

/** 圆弧路径（环形箭头） */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number): string => {
  const p0 = { x: cx + r * Math.cos(a0), y: cy + r * Math.sin(a0) };
  const p1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
};

/** 箭头三角（顺时针切向） */
const arrowHead = (cx: number, cy: number, r: number, a: number): string => {
  const tip = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  const dir = { x: -Math.sin(a), y: Math.cos(a) };
  const nrm = { x: Math.cos(a), y: Math.sin(a) };
  const p1 = { x: tip.x - dir.x * 26 + nrm.x * 15, y: tip.y - dir.y * 26 + nrm.y * 15 };
  const p2 = { x: tip.x - dir.x * 26 - nrm.x * 15, y: tip.y - dir.y * 26 - nrm.y * 15 };
  return `${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
};

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

/** 「想一步 / 做一步 / 看结果」—— 点亮时陶土下划线上扫 */
const Clause = ({ text, at }: { text: string; at: number }) => {
  const frame = useCurrentFrame();
  const p = EASE.outExpo(clamp01((frame - at) / 22));
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {text}
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: -3,
          height: 3,
          width: `${p * 100}%`,
          backgroundColor: COLORS.clay,
          borderRadius: 2,
        }}
      />
    </span>
  );
};

/** 步骤标签：编号 + 中文 */
const Step = ({ x, y, idx, text, at }: { x: number; y: number; idx: string; text: string; at: number }) => {
  const frame = useCurrentFrame();
  const p = EASE.outExpo(clamp01((frame - at) / 24));
  return (
    <div
      style={{
        position: "absolute",
        left: x - 200,
        top: y,
        width: 400,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: 14,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      <span style={{ fontFamily: FONTS.mono, fontSize: 22, letterSpacing: "0.1em", color: COLORS.clay }}>{idx}</span>
      <span style={{ fontFamily: FONTS.serifCN, fontSize: 40, letterSpacing: "0.06em", color: COLORS.ink }}>{text}</span>
    </div>
  );
};

/** 点亮涟漪 */
const Ping = ({ x, y, at, r = 100 }: { x: number; y: number; at: number; r?: number }) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / 44);
  if (p <= 0 || p >= 1) return null;
  const rr = r * (0.45 + 0.95 * EASE.outExpo(p));
  return (
    <div
      style={{
        position: "absolute",
        left: x - rr,
        top: y - rr,
        width: rr * 2,
        height: rr * 2,
        borderRadius: "50%",
        border: `2px solid ${COLORS.clay}`,
        opacity: (1 - p) * 0.7,
      }}
    />
  );
};

/** 手（线稿图元） */
const HandGlyph = () => (
  <svg width={80} height={80} viewBox="0 0 100 100" fill="none" stroke={COLORS.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    <rect x={36} y={46} width={40} height={40} rx={9} />
    <path d="M 44 46 V 26" />
    <path d="M 56 46 V 18" />
    <path d="M 68 46 V 28" />
    <path d="M 36 60 q -13 1 -13 -12 q 0 -8 7 -8" />
  </svg>
);

/* ------------------------------------------------------------------- 场景 */

/** S03 · 大脑 + 手脚 + 循环（20s–32s · 720f） */
export const S03 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  // 三角环：三条墨线依次绘成
  const edges = [
    `M ${A.x} ${A.y} L ${B.x} ${B.y}`,
    `M ${B.x} ${B.y} L ${C.x} ${C.y}`,
    `M ${C.x} ${C.y} L ${A.x} ${A.y}`,
  ];
  const edgeP = (i: number) => EASE.draw(clamp01((frame - 20 - i * 12) / 44));
  const ringLen = getLength(RING);

  // 三节点依次点亮
  const litAt = [150, 198, 246];
  const lit = (i: number) => EASE.outExpo(clamp01((frame - litAt[i]) / 30));
  const br = (phase: number) => 1 + 0.014 * breathe(frame, 200, phase) * clamp01((frame - 340) / 60);

  // 数据包沿环线循环
  const pktP = frame < 300 ? 0 : ((frame - 300) % 240) / 240;
  const pkt = getPointAtLength(RING, ringLen * pktP);

  // 环形箭头
  const loopP = lit(2);
  const arcD = arc(C.x, C.y, 74, -0.4 * Math.PI, 1.4 * Math.PI);
  const arcLen = getLength(arcD);

  // 退场：纸张翻转
  const exP = clamp01((frame - (dur - 14)) / 14);
  const flip = EASE.ink(exP) * 84;

  return (
    <PaperStage dur={dur} tone="medium" grid>
      {litAt.map((f, i) => (
        <Sequence key={i} from={f} durationInFrames={60}>
          <Audio src={staticFile("sfx/ui-ping.wav")} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ backgroundColor: COLORS.paperDeep, opacity: clamp01((exP - 0.5) / 0.5) }} />
      <AbsoluteFill style={{ perspective: 2000, opacity: 1 - clamp01((exP - 0.88) / 0.12) }}>
        <AbsoluteFill style={{ transform: `rotateY(${-flip}deg)`, transformOrigin: "0% 50%" }}>
          <Head
            kicker={`科普 03 · ${SCENE_TITLES[2]}`}
            cn={
              <>
                Agent = 大脑（大模型）+ 手脚（工具）+ 循环。
                <br />
                <Clause text="想一步，" at={litAt[0] + 8} />
                <Clause text="做一步，" at={litAt[1] + 8} />
                <Clause text="看结果。" at={litAt[2] + 8} />
              </>
            }
            en="Agent = brain (LLM) + hands (tools) + a loop. Think, act, observe."
          />

          {/* 三角环 + 数据包 */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {edges.map((d, i) => {
              const len = getLength(d);
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={COLORS.ink}
                  strokeOpacity={0.22}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={`${len} ${len}`}
                  strokeDashoffset={len * (1 - edgeP(i))}
                />
              );
            })}
            {frame >= 300 && pkt ? <circle cx={pkt.x} cy={pkt.y} r={8} fill={COLORS.clay} /> : null}
          </svg>

          {/* A · 大脑 */}
          <Ping x={A.x} y={A.y} at={litAt[0]} />
          <div
            style={{
              position: "absolute",
              left: A.x - 74,
              top: A.y - 74,
              width: 148,
              height: 148,
              borderRadius: 99,
              backgroundColor: COLORS.clay,
              boxShadow: "0 20px 44px rgba(198,97,63,0.26)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: lit(0),
              transform: `scale(${(0.82 + 0.18 * lit(0)) * br(0)})`,
            }}
          >
            <svg width={62} height={62} viewBox="0 0 100 100" fill="none" stroke={COLORS.paperWhite} strokeWidth={9} strokeLinecap="round">
              {[0, 60, 120].map((a) => (
                <path key={a} d="M 50 26 V 74" transform={`rotate(${a} 50 50)`} />
              ))}
            </svg>
          </div>

          {/* B · 手脚（白色方手 ×2） */}
          <Ping x={B.x} y={B.y} at={litAt[1]} />
          {[
            { dx: -86, dy: -16, rot: -6 },
            { dx: 86, dy: 16, rot: 5 },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: B.x + s.dx - 66,
                top: B.y + s.dy - 66,
                width: 132,
                height: 132,
                borderRadius: 16,
                backgroundColor: COLORS.paperWhite,
                border: `1px solid ${COLORS.line}`,
                boxShadow: "0 18px 44px rgba(31,30,29,0.09)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: lit(1),
                transform: `rotate(${s.rot}deg) scale(${(0.86 + 0.14 * lit(1)) * br(1)})`,
              }}
            >
              <HandGlyph />
            </div>
          ))}

          {/* C · 循环（环形箭头） */}
          <Ping x={C.x} y={C.y} at={litAt[2]} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: `${C.x}px ${C.y}px`,
              transform: `scale(${0.88 + 0.12 * loopP})`,
              opacity: loopP,
            }}
          >
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              <path
                d={arcD}
                fill="none"
                stroke={COLORS.ink}
                strokeWidth={9}
                strokeLinecap="round"
                strokeDasharray={`${arcLen} ${arcLen}`}
                strokeDashoffset={arcLen * (1 - loopP)}
              />
              <polygon points={arrowHead(C.x, C.y, 74, 1.4 * Math.PI)} fill={COLORS.ink} />
            </svg>
          </div>

          {/* 步骤标签 */}
          <Step x={A.x} y={344} idx="01" text="想一步" at={litAt[0] + 10} />
          <Step x={B.x} y={902} idx="02" text="做一步" at={litAt[1] + 10} />
          <Step x={C.x} y={902} idx="03" text="看结果" at={litAt[2] + 10} />
        </AbsoluteFill>
      </AbsoluteFill>
    </PaperStage>
  );
};
