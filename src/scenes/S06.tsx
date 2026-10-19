import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TaskCard } from "../comps/ui";
import { FadeText } from "../comps/Text";
import { TYPE } from "../comps/type";
import { COLORS, EASE, FONTS, SCENE_TITLES } from "../theme";
import { clamp01 } from "../lib/anim";

/* ------------------------------------------------------------------ 几何 */

const LEAD = { x: 960, y: 400 };
const LANES = [
  { y: 520, name: "研究" },
  { y: 620, name: "编码" },
  { y: 720, name: "检索" },
  { y: 820, name: "校验" },
];
const CARD_W = 300;
const X0 = 400; // 卡起点（left）
const X1 = 1200; // 卡终点（left）
const RING_X = 1540;
const BIG = { x: 960, y: 668, w: 760, h: 300 };

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

/** 进度环：随卡片推进闭合 */
const Ring = ({ x, y, p, done, show = 1 }: { x: number; y: number; p: number; done: number; show?: number }) => {
  const r = 32;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: x - 44, top: y - 44, width: 88, height: 88, opacity: show, transform: `scale(${0.8 + 0.2 * show})` }}>
      <svg width={88} height={88}>
        <circle cx={44} cy={44} r={r} fill="none" stroke={COLORS.ink} strokeOpacity={0.14} strokeWidth={4} />
        <circle
          cx={44}
          cy={44}
          r={r}
          fill="none"
          stroke={COLORS.clay}
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - p)}
          transform="rotate(-90 44 44)"
        />
      </svg>
      {done > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONTS.body,
            fontSize: 30,
            color: COLORS.clay,
            transform: `scale(${done})`,
            opacity: done,
          }}
        >
          ✓
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------- 场景 */

/** S06 · 一个 Agent 是一支团队（52s–64s · 720f） */
export const S06 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  // 主代理圆点 → 分裂
  const leadIn = EASE.outExpo(clamp01((frame - 24) / 26));
  const splitAt = 60;
  const spawn = (i: number) => EASE.outExpo(clamp01((frame - splitAt - i * 7.2) / 34));
  const dotIn = (i: number) => clamp01((frame - splitAt - i * 7.2) / 26);

  // 卡片推进（并行泳道）
  const moveAt = 150;
  const TRAVEL = 150;
  const cardP = (i: number) => {
    const p = clamp01((frame - moveAt - i * 6) / TRAVEL);
    return -(Math.cos(Math.PI * p) - 1) / 2; // easeInOutSine：匀速推进、两端减速
  };
  const arriveAt = (i: number) => moveAt + i * 6 + TRAVEL; // 环闭合的时点
  const ringP = (i: number) => cardP(i);
  const doneP = (i: number) => EASE.outExpo(clamp01((frame - arriveAt(i)) / 22));

  // 汇聚
  const mergeAt = 430;
  const mergeP = (i: number) => EASE.outExpo(clamp01((frame - mergeAt - i * 6) / 46));
  const laneFade = 1 - clamp01((frame - (mergeAt - 20)) / 50);

  // 汇总大卡
  const bigIn = EASE.outExpo(clamp01((frame - (mergeAt + 66)) / 34));
  const rowIn = (i: number) => EASE.outExpo(clamp01((frame - (mergeAt + 72 + i * 9)) / 22));

  // 盖章
  const stampAt = 610;
  const stampP = EASE.outExpo(clamp01((frame - stampAt) / 20));

  // 退场：墨迹扩散
  const exP = clamp01((frame - (dur - 14)) / 14);
  const mask = `radial-gradient(circle at 50% 50%, rgba(0,0,0,1) ${(1 - exP) * 118}%, rgba(0,0,0,0) ${(1 - exP) * 118 + 18}%)`;

  return (
    <PaperStage dur={dur} tone="medium" grid>
      {[0, 1, 2, 3].map((i) => (
        <Sequence key={i} from={splitAt + Math.round(i * 7.2)} durationInFrames={44}>
          <Audio src={staticFile("sfx/whoosh.wav")} />
        </Sequence>
      ))}
      <Sequence from={stampAt} durationInFrames={80}>
        <Audio src={staticFile("sfx/success-chime.wav")} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: 1 - exP,
          transform: `scale(${1 + exP * 0.02})`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        <Head
          kicker={`科普 06 · ${SCENE_TITLES[5]}`}
          cn={
            <>
              现在：一个 Agent 背后，是一支团队——
              <br />
              多代理并行，各自闭环。
            </>
          }
          en="Today, one agent is a team: subagents working in parallel."
        />

        {/* 泳道轨道 + 进度环 */}
        <AbsoluteFill style={{ opacity: laneFade }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {LANES.map((l, i) => (
              <line
                key={i}
                x1={X0}
                y1={l.y}
                x2={RING_X - 20}
                y2={l.y}
                stroke={COLORS.ink}
                strokeOpacity={0.12}
                strokeWidth={1.6}
                strokeDasharray="7 9"
              />
            ))}
          </svg>
          {LANES.map((l, i) => (
            <Ring key={i} x={RING_X} y={l.y} p={ringP(i)} done={doneP(i)} show={dotIn(i)} />
          ))}
        </AbsoluteFill>

        {/* 主代理圆点 → 四散 */}
        <div
          style={{
            position: "absolute",
            left: LEAD.x - 34,
            top: LEAD.y - 34,
            width: 68,
            height: 68,
            borderRadius: 99,
            backgroundColor: COLORS.clay,
            boxShadow: "0 18px 40px rgba(198,97,63,0.28)",
            opacity: leadIn * (1 - clamp01(spawn(0) * 1.15)),
            transform: `scale(${0.7 + 0.3 * leadIn - 0.5 * spawn(0)})`,
          }}
        />

        {/* 子代理圆点：飞向各泳道起点 */}
        {LANES.map((l, i) => {
          const p = spawn(i);
          const x = LEAD.x + (X0 + CARD_W / 2 - LEAD.x) * p;
          const y = LEAD.y + (l.y - LEAD.y) * p;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 15,
                top: y - 15,
                width: 30,
                height: 30,
                borderRadius: 99,
                backgroundColor: COLORS.clay,
                opacity: dotIn(i) * (1 - clamp01((frame - moveAt - i * 6) / 14)),
                transform: `scale(${p})`,
              }}
            />
          );
        })}

        {/* 四条泳道任务卡 */}
        {LANES.map((l, i) => {
          const p = cardP(i);
          const mx = mergeP(i);
          const left = X0 + (X1 - X0) * p;
          const cx = left + CARD_W / 2;
          const dx = (BIG.x - cx) * mx;
          const dy = (BIG.y - l.y) * mx;
          return (
            <TaskCard
              key={i}
              done={doneP(i) > 0.5}
              style={{
                position: "absolute",
                left,
                top: l.y - 30,
                width: CARD_W,
                transform: `translate(${dx}px, ${dy}px) scale(${1 - 0.18 * mx})`,
                opacity: clamp01((frame - moveAt + 20 - i * 6) / 16) * (1 - mx) * laneFade,
              }}
            >
              <span style={{ fontFamily: FONTS.mono, fontSize: 21, color: COLORS.grey }}>0{i + 1}</span>
              <span style={{ marginLeft: 12, fontFamily: FONTS.sansCN, fontSize: 27 }}>{l.name}</span>
            </TaskCard>
          );
        })}

        {/* 汇总大卡 + 盖章 */}
        {bigIn > 0 ? (
          <div
            style={{
              position: "absolute",
              left: BIG.x - BIG.w / 2,
              top: BIG.y - BIG.h / 2,
              width: BIG.w,
              height: BIG.h,
              borderRadius: 18,
              backgroundColor: COLORS.paperWhite,
              border: `1px solid ${COLORS.line}`,
              boxShadow: "0 24px 60px rgba(31,30,29,0.1)",
              opacity: bigIn,
              transform: `scale(${0.94 + 0.06 * bigIn})`,
            }}
          >
            {LANES.map((l, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 46,
                  top: 46 + i * 58,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: rowIn(i),
                  transform: `translateX(${(1 - rowIn(i)) * -14}px)`,
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    backgroundColor: COLORS.clay,
                    color: COLORS.paperWhite,
                    fontSize: 17,
                    lineHeight: "26px",
                    textAlign: "center",
                    fontFamily: FONTS.body,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontFamily: FONTS.sansCN, fontSize: 28, color: COLORS.ink }}>{l.name}</span>
              </div>
            ))}

            {/* 盖章「完成」 */}
            <div
              style={{
                position: "absolute",
                right: 54,
                bottom: 74,
                width: 196,
                height: 92,
                borderRadius: 12,
                border: `3px solid ${COLORS.clayDark}`,
                color: COLORS.clayDark,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.serifCN,
                fontSize: 44,
                letterSpacing: "0.16em",
                opacity: stampP,
                transform: `rotate(-12deg) scale(${1.7 - 0.7 * stampP})`,
                boxShadow: `inset 0 0 0 2px rgba(198,97,63,0.18)`,
              }}
            >
              完成
            </div>
          </div>
        ) : null}

        {/* 盖章涟漪 */}
        {stampP > 0 && stampP < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 1188 - 190 * EASE.outExpo(stampP),
              top: 698 - 190 * EASE.outExpo(stampP),
              width: 380 * EASE.outExpo(stampP),
              height: 380 * EASE.outExpo(stampP),
              borderRadius: "50%",
              border: `2px solid ${COLORS.clay}`,
              opacity: (1 - stampP) * 0.6,
            }}
          />
        ) : null}
      </AbsoluteFill>
    </PaperStage>
  );
};
