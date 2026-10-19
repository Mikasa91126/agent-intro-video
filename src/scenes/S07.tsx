import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { getLength } from "@remotion/paths";
import { PaperStage } from "../comps/PaperStage";
import { FadeText } from "../comps/Text";
import { TYPE } from "../comps/type";
import { COLORS, EASE, FONTS, SCENE_TITLES } from "../theme";
import { clamp01 } from "../lib/anim";

/* ------------------------------------------------------------------ 几何 */

const LEAD = { x: 960, y: 620 };
const SUBS = [
  { x: 1172, y: 408, name: "研究", side: 1 },
  { x: 1172, y: 832, name: "编码", side: 1 },
  { x: 748, y: 832, name: "检索", side: -1 },
  { x: 748, y: 408, name: "校验", side: -1 },
];

/** 交叉验证：两条线互指 */
const CROSS = ["M 1146 402 Q 1080 372, 1022 392", "M 774 402 Q 840 372, 898 392"];
const CROSS_LEN = CROSS.map((d) => getLength(d));

/** 连线（与数据包同一弧度） */
const EDGE_D = SUBS.map((s) => {
  const dx = s.x - LEAD.x;
  const dy = s.y - LEAD.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (LEAD.x + s.x) / 2 + (-dy / len) * 11;
  const cy = (LEAD.y + s.y) / 2 + (dx / len) * 11;
  return `M ${LEAD.x} ${LEAD.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${s.x} ${s.y}`;
});
const EDGE_LEN = EDGE_D.map((d) => getLength(d));

/** 8 粒双向数据包：4 去 + 4 回 */
const PACKETS = Array.from({ length: 8 }, (_, k) => ({
  seg: k % 4,
  dir: k < 4 ? 1 : -1,
  phase: (k * 29) % 150,
}));

/** 带轻微弧度的双向数据包位置 */
const packetAt = (seg: number, t: number, dir: number) => {
  const s = SUBS[seg];
  const u = dir === 1 ? t : 1 - t;
  const dx = s.x - LEAD.x;
  const dy = s.y - LEAD.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = 11;
  const cx = (LEAD.x + s.x) / 2 + (-dy / len) * bow;
  const cy = (LEAD.y + s.y) / 2 + (dx / len) * bow;
  return {
    x: (1 - u) * (1 - u) * LEAD.x + 2 * (1 - u) * u * cx + u * u * s.x,
    y: (1 - u) * (1 - u) * LEAD.y + 2 * (1 - u) * u * cy + u * u * s.y,
  };
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
                maxWidth: 1360,
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

/** 子代理名牌（回报后挂陶土对勾） */
const NameTag = ({ x, y, side, name, at, done }: { x: number; y: number; side: number; name: string; at: number; done: number }) => {
  const frame = useCurrentFrame();
  const p = EASE.outExpo(clamp01((frame - at) / 24));
  const w = 188;
  const left = side > 0 ? x + 46 : x - 46 - w;
  const d = EASE.outExpo(clamp01((frame - done) / 20));
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: y - 27,
        width: w,
        height: 54,
        borderRadius: 10,
        backgroundColor: COLORS.paperWhite,
        border: `1px solid ${COLORS.line}`,
        boxShadow: "0 12px 30px rgba(31,30,29,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        opacity: p,
        transform: `translateX(${(1 - p) * 14 * side}px)`,
      }}
    >
      <span style={{ fontFamily: FONTS.sansCN, fontSize: 27, color: COLORS.ink, letterSpacing: "0.06em" }}>{name}</span>
      {d > 0 ? (
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 99,
            backgroundColor: COLORS.clay,
            color: COLORS.paperWhite,
            fontSize: 17,
            lineHeight: "26px",
            textAlign: "center",
            fontFamily: FONTS.body,
            transform: `scale(${d})`,
            display: "inline-block",
          }}
        >
          ✓
        </span>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------- 场景 */

/** S07 · 多代理幕后（64s–75s · 660f） */
export const S07 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  // 光网节拍：主代理 → 连线 → 子节点 → 数据包
  const leadIn = EASE.outExpo(clamp01((frame - 34) / 26));
  const edgeIn = (i: number) => EASE.draw(clamp01((frame - 44 - i * 8) / 44));
  const nodeIn = (i: number) => EASE.outExpo(clamp01((frame - 74 - i * 8) / 26));
  const PKT_START = 108;
  const tagAt = (i: number) => 108 + i * 18;
  const doneAt = (i: number) => 236 + i * 30;

  // 交叉验证
  const crossAt = 400;
  const crossP = (i: number) => EASE.draw(clamp01((frame - crossAt - i * 22) / 46));
  const magP = EASE.outExpo(clamp01((frame - crossAt - 10) / 26));

  // 汇总脉冲
  const pulseAt = 520;
  const pulseP = clamp01((frame - pulseAt) / 56);
  const leadPop = 1 + 0.14 * Math.exp(-Math.max(0, frame - pulseAt) / 16) * (frame >= pulseAt ? 1 : 0);

  // 角落小注
  const noteP = clamp01((frame - 420) / 30);

  // 退场
  const exP = clamp01((frame - (dur - 14)) / 14);

  return (
    <PaperStage dur={dur} tone="medium" grid>
      {[0, 1, 2, 3].map((i) => (
        <Sequence key={i} from={doneAt(i)} durationInFrames={50}>
          <Audio src={staticFile("sfx/ui-ping.wav")} />
        </Sequence>
      ))}
      <Sequence from={pulseAt} durationInFrames={70}>
        <Audio src={staticFile("sfx/confirm-click.wav")} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: 1 - exP,
          transform: `scale(${1 + exP * 0.015})`,
        }}
      >
        <Head
          kicker={`科普 07 · ${SCENE_TITLES[6]}`}
          cn={
            <>
              幕后：主代理拆任务，子代理并行开工——
              <br />
              研究、编码、检索各跑各的，最后交叉验证、汇总成一份结果。
            </>
          }
          en="Under the hood: a lead agent splits the job; subagents run in parallel, then cross-check and merge."
        />

        {/* 光网：主代理 + 4 子代理 + 双向数据包 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {EDGE_D.map((d, i) => (
            <path
              key={`e${i}`}
              d={d}
              fill="none"
              stroke={COLORS.ink}
              strokeOpacity={0.2}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={`${EDGE_LEN[i]} ${EDGE_LEN[i]}`}
              strokeDashoffset={EDGE_LEN[i] * (1 - edgeIn(i))}
            />
          ))}
          {frame >= PKT_START
            ? PACKETS.map((p, k) => {
                const raw = (frame - PKT_START + p.phase) / 150;
                const t = ((raw % 1) + 1) % 1;
                const fade = Math.min(1, Math.min(t, 1 - t) * 5);
                const pt = packetAt(p.seg, t, p.dir);
                return <circle key={`p${k}`} cx={pt.x} cy={pt.y} r={5} fill={COLORS.clay} opacity={0.85 * fade} />;
              })
            : null}
        </svg>

        {/* 主代理节点（陶土） */}
        <div
          style={{
            position: "absolute",
            left: LEAD.x - 26,
            top: LEAD.y - 26,
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: COLORS.clay,
            border: `2px solid ${COLORS.paperWhite}`,
            boxShadow: "0 14px 30px rgba(198,97,63,0.28)",
            opacity: leadIn,
            transform: `scale(${0.6 + 0.4 * leadIn})`,
          }}
        />

        {/* 子代理节点 */}
        {SUBS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x - 18,
              top: s.y - 18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: COLORS.ink,
              opacity: 0.82 * nodeIn(i),
              border: `1.5px solid ${COLORS.paperWhite}`,
              transform: `scale(${0.6 + 0.4 * nodeIn(i)})`,
            }}
          />
        ))}

        {/* 汇总脉冲 */}
        {pulseP > 0 && pulseP < 1 ? (
          <div
            style={{
              position: "absolute",
              left: LEAD.x - 300 * EASE.outExpo(pulseP),
              top: LEAD.y - 300 * EASE.outExpo(pulseP),
              width: 600 * EASE.outExpo(pulseP),
              height: 600 * EASE.outExpo(pulseP),
              borderRadius: "50%",
              border: `2px solid ${COLORS.clay}`,
              opacity: (1 - pulseP) * 0.7,
            }}
          />
        ) : null}

        {/* 主代理标签 */}
        <FadeText start={60} y={10} dur={30} style={{ position: "absolute", left: 560, top: LEAD.y - 26, width: 320, textAlign: "right" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 22, letterSpacing: "0.2em", color: COLORS.clay }}>LEAD AGENT</div>
        </FadeText>

        {/* 子代理名牌 */}
        {SUBS.map((s, i) => (
          <NameTag key={i} x={s.x} y={s.y} side={s.side} name={s.name} at={tagAt(i)} done={doneAt(i)} />
        ))}

        {/* 交叉验证：两条线互指 + 放大镜 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {CROSS.map((d, i) => {
            const len = CROSS_LEN[i];
            const p = crossP(i);
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={COLORS.ink}
                strokeOpacity={0.55}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeDasharray={`${len} ${len}`}
                strokeDashoffset={len * (1 - p)}
              />
            );
          })}
          {magP > 0 ? (
            <g opacity={magP} transform={`translate(960 392) scale(${0.8 + 0.2 * magP})`}>
              <circle cx={0} cy={0} r={26} fill="none" stroke={COLORS.ink} strokeWidth={5} />
              <path d="M 19 19 L 40 40" stroke={COLORS.clay} strokeWidth={8} strokeLinecap="round" />
            </g>
          ) : null}
          {/* 互指箭头 */}
          {crossP(0) > 0.9 ? <polygon points="1022,392 1046,378 1044,404" fill={COLORS.ink} opacity={0.7} /> : null}
          {crossP(1) > 0.9 ? <polygon points="898,392 874,378 876,404" fill={COLORS.ink} opacity={0.7} /> : null}
        </svg>

        {/* 角落小注 */}
        <FadeText start={420} y={8} dur={30} style={{ position: "absolute", right: 140, top: 1002, width: 1000, textAlign: "right" }}>
          <div style={{ fontFamily: FONTS.sansCN, fontSize: 23, lineHeight: 1.5, color: COLORS.grey, opacity: noteP }}>
            Anthropic 内部评测：多代理研究系统较单代理提升 90.2%（token 约 15 倍）
          </div>
        </FadeText>

        {/* 主代理呼吸/脉冲缩放（覆盖 NodeNet 节点，纯视觉强调） */}
        {frame >= pulseAt && frame <= pulseAt + 30 ? (
          <div
            style={{
              position: "absolute",
              left: LEAD.x - 26 * leadPop,
              top: LEAD.y - 26 * leadPop,
              width: 52 * leadPop,
              height: 52 * leadPop,
              borderRadius: 99,
              backgroundColor: COLORS.clay,
              opacity: 0.9,
            }}
          />
        ) : null}
      </AbsoluteFill>
    </PaperStage>
  );
};
