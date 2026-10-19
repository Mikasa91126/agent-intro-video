import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { Counter } from "../comps/Counter";
import { FadeText } from "../comps/Text";
import { TYPE } from "../comps/type";
import { COLORS, EASE, FONTS, SCENE_TITLES } from "../theme";
import { clamp01 } from "../lib/anim";

/* ------------------------------------------------------------------ 常量 */

const LINE_Y = 620;
const LINE_X0 = 200;
const LINE_X1 = 2120; // 线尾延伸出画面
const TICKS = [440, 1000, 1560];

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

/** 刻度：陶土圆点 + 竖茎 + 日期/名称/数字 */
const Tick = ({
  x,
  above,
  date,
  name,
  at,
  metric,
}: {
  x: number;
  above: boolean;
  date: string;
  name: string;
  at: number;
  metric: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const p = EASE.outExpo(clamp01((frame - at) / 26));
  const dir = above ? -1 : 1;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 0.75,
          top: above ? 572 : LINE_Y + 12,
          width: 1.5,
          height: above ? 36 : 30,
          backgroundColor: COLORS.ink,
          opacity: 0.22 * p,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 11,
          top: LINE_Y - 11,
          width: 22,
          height: 22,
          borderRadius: 99,
          backgroundColor: COLORS.clay,
          border: `3px solid ${COLORS.paperWhite}`,
          boxShadow: "0 6px 16px rgba(198,97,63,0.3)",
          transform: `scale(${p})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 240,
          width: 480,
          ...(above ? { bottom: 1080 - 566 } : { top: LINE_Y + 12 + 32 }),
          textAlign: "center",
          opacity: p,
          transform: `translateY(${(1 - p) * 16 * dir}px)`,
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: 23, letterSpacing: "0.16em", color: COLORS.graphite }}>
          {date}
        </div>
        <div
          style={{
            fontFamily: FONTS.serifLatin,
            fontWeight: 500,
            fontSize: 46,
            lineHeight: 1.2,
            color: COLORS.ink,
            marginTop: 6,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 29,
            color: COLORS.clayDark,
            marginTop: 8,
            whiteSpace: "nowrap",
          }}
        >
          {metric}
        </div>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------- 场景 */

/** S04 · 简史时间线（32s–42s · 600f） */
export const S04 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  // 墨线绘制（1.2s easeInOutCubic）
  const drawP = EASE.draw(clamp01((frame - 40) / 72));
  const len = LINE_X1 - LINE_X0;
  const tipX = LINE_X0 + len * drawP;

  // 退场：横向 wipe（纸面推拉）
  const exP = clamp01((frame - (dur - 14)) / 14);
  const wipe = EASE.exit(exP);

  return (
    <PaperStage dur={dur} tone="medium" grid>
      {[130, 190, 250].map((f, i) => (
        <Sequence key={i} from={f} durationInFrames={50}>
          <Audio src={staticFile("sfx/enter-click.wav")} />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          transform: `translateX(${-1520 * wipe}px)`,
          opacity: 1 - clamp01((exP - 0.3) / 0.45),
        }}
      >
        <Head
          kicker={`科普 04 · ${SCENE_TITLES[3]}`}
          cn="2023，AutoGPT 出圈；2024，Devin 自封首位 AI 工程师；同年，AI 学会用电脑。"
          en="2023: AutoGPT goes viral. 2024: agents learn to use computers."
        />

        {/* 时间线 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line
            x1={LINE_X0}
            y1={LINE_Y}
            x2={tipX}
            y2={LINE_Y}
            stroke={COLORS.ink}
            strokeOpacity={0.45}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {drawP > 0.001 && drawP < 1 ? (
            <circle cx={tipX} cy={LINE_Y} r={5} fill={COLORS.ink} opacity={0.7} />
          ) : null}
          {drawP > 0.02 ? <circle cx={LINE_X0} cy={LINE_Y} r={4.5} fill={COLORS.ink} opacity={0.45} /> : null}
        </svg>

        {/* 线尾：三个小点向画面外行进（留悬念） */}
        {[0, 1, 2].map((i) => {
          const ph = frame < 400 ? 0 : ((frame - 400 - i * 26) / 78) % 1;
          const on = frame >= 400 + i * 26;
          return on ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 1700 + i * 62 + ph * 40,
                top: LINE_Y - 4,
                width: 9,
                height: 9,
                borderRadius: 99,
                backgroundColor: COLORS.clay,
                opacity: 0.15 + 0.55 * Math.sin(Math.PI * clamp01(ph)),
              }}
            />
          ) : null;
        })}

        {/* 三刻度 */}
        <Tick
          x={TICKS[0]}
          above
          date="2023-03"
          name="AutoGPT"
          at={130}
          metric={
            <Counter from={0} to={8.2} start={130} dur={84} format={(v) => v.toFixed(1)} suffix=" 万 GitHub 星" />
          }
        />
        <Tick
          x={TICKS[1]}
          above={false}
          date="2024-03"
          name="Devin"
          at={190}
          metric={<Counter from={0} to={13.86} start={190} dur={84} format={(v) => v.toFixed(2)} prefix="SWE-bench " suffix="%" />}
        />
        <Tick
          x={TICKS[2]}
          above
          date="2024-10"
          name="computer use"
          at={250}
          metric={<Counter from={0} to={14.9} start={250} dur={84} format={(v) => v.toFixed(1)} prefix="OSWorld " suffix="%" />}
        />

        {/* 底部小注 */}
        <FadeText start={320} y={8} dur={34} style={{ position: "absolute", left: 140, top: 862 }}>
          <div style={{ ...TYPE.sub, fontSize: 26, color: COLORS.grey }}>
            <span style={{ color: COLORS.clay }}>※</span> 数字为发布时口径
          </div>
        </FadeText>
      </AbsoluteFill>
    </PaperStage>
  );
};
