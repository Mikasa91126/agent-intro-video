/**
 * S12 · 品牌 · 国内代表（2:03–2:15 · 720f）【强调色回落 clay】
 * 三联卡（stagger 0.12s）：豆包（180 万亿 count-up）/ Kimi（300 枚迷你子代理圆点脉冲一次）
 * / Manus（地图节点与手机图标连一条墨线）；三卡下方统一小注「以各品牌官方口径为准」。
 * 转场：纸面推拉（三卡依次入）；SFX：ui-ping ×3。
 */
import {
  Audio,
  Img,
  Sequence,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { Card } from "../comps/ui";
import { Counter } from "../comps/Counter";
import { DrawPath } from "../comps/wire";
import { TYPE } from "../comps/type";
import { BRAND_COLORS, COLORS } from "../theme";
import { clamp01, outExpo, prog } from "../lib/anim";

/** 定稿文案（§1 S12，不改字；换行仅按句读断行） */
const CN_L1 = "国内同样热闹：豆包日均调用 180 万亿 token；";
const CN_L2 = "Kimi K3 最多 300 个子代理；Manus 恢复独立，携手 OPPO。";
const EN_L1 = "In China: Doubao at 180 trillion tokens a day, Kimi K3 runs 300 sub-agents,";
const EN_L2 = "Manus is back solo—and on OPPO phones.";

const NAME = {
  ...TYPE.h1cn,
  fontSize: 44,
  lineHeight: 1,
} as const;

/* Kimi：300 枚迷你子代理圆点（20 × 15） */
const DOT_COLS = 20;
const DOT_ROWS = 15;
const DOT_PITCH = 14;
const DOT_SIZE = 7;
const DOT_GRID_W = DOT_COLS * DOT_PITCH - (DOT_PITCH - DOT_SIZE);
const DOT_GRID_H = DOT_ROWS * DOT_PITCH - (DOT_PITCH - DOT_SIZE);
const DOTS = Array.from({ length: DOT_COLS * DOT_ROWS }, (_, i) => ({
  x: (i % DOT_COLS) * DOT_PITCH,
  y: Math.floor(i / DOT_COLS) * DOT_PITCH,
}));
const PULSE_AT = 252;

const cardAt = (i: number) => 30 + i * 7;
const pingAt = (i: number) => cardAt(i) + 30;

export const S12 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  /* 品牌色时刻：clay（本幕收束，回落默认强调色） */
  const accent =
    frame <= dur - 14
      ? interpolateColors(frame, [0, 12], [COLORS.clay, BRAND_COLORS.cn])
      : interpolateColors(frame, [dur - 14, dur], [BRAND_COLORS.cn, COLORS.clay]);

  const exit = prog(frame, dur - 16, 16);
  const exitE = outExpo(exit);

  const cardIn = (i: number) => outExpo(prog(frame, cardAt(i), 33));

  /* 豆包：180 万亿 */
  const beanLand = 70 + 84;
  const beanPulse = 1 + 0.03 * Math.sin(Math.PI * clamp01((frame - beanLand) / 26));

  /* Kimi：300 点同时脉冲一次 */
  const dotsBase = outExpo(prog(frame, 118, 40));
  const pulse = clamp01((frame - PULSE_AT) / 60);
  const pulseE = Math.sin(Math.PI * pulse);

  /* Manus：墨线 + 手机 */
  const manusPin = outExpo(prog(frame, 150, 30));
  const manusPhone = outExpo(prog(frame, 166, 30));

  /* 统一小注 */
  const noteP = outExpo(prog(frame, 330, 36));

  /* 字幕 */
  const capA = prog(frame, 400, 13);
  const capP = outExpo(prog(frame, 400, 38));
  const capEnA = prog(frame, 442, 13);
  const capEnP = outExpo(prog(frame, 442, 38));

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exit,
          transform: `translateY(${-exitE * 18}px)`,
        }}
      >
        {/* 左上章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          品牌巡礼 05 · 国内代表
        </div>

        {/* ---------------- 卡一：豆包 ---------------- */}
        <Card
          tone="light"
          style={{
            position: "absolute",
            left: 140,
            top: 210,
            width: 500,
            height: 420,
            padding: 28,
            opacity: prog(frame, cardAt(0), 13),
            transform: `translateY(${(1 - cardIn(0)) * 32}px) rotate(${(1 - cardIn(0)) * 3}deg)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Img src={staticFile("logos/doubao.svg")} style={{ width: 52 }} />
            <span style={NAME}>豆包</span>
          </div>
          <div
            style={{
              height: 230,
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <Counter
                from={0}
                to={180}
                start={70}
                dur={84}
                style={{
                  ...TYPE.num,
                  fontSize: 118,
                  color: accent,
                  transform: `scale(${beanPulse})`,
                  transformOrigin: "left bottom",
                  display: "inline-block",
                }}
              />
              <span style={{ ...TYPE.h2cn, fontSize: 44 }}>万亿</span>
            </div>
            <div style={{ ...TYPE.label, fontSize: 20, marginTop: 22 }}>
              日均调用 token / 日
            </div>
          </div>
          <div style={{ ...TYPE.sub, fontSize: 24 }}>与飞书深度打通</div>
        </Card>

        {/* ---------------- 卡二：Kimi ---------------- */}
        <Card
          tone="light"
          style={{
            position: "absolute",
            left: 710,
            top: 210,
            width: 500,
            height: 420,
            padding: 28,
            opacity: prog(frame, cardAt(1), 13),
            transform: `translateY(${(1 - cardIn(1)) * 32}px) rotate(${(1 - cardIn(1)) * 3}deg)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Img src={staticFile("logos/kimi.svg")} style={{ width: 52 }} />
            <span style={NAME}>Kimi</span>
          </div>
          <div
            style={{
              height: 230,
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "relative", width: DOT_GRID_W, height: DOT_GRID_H }}>
              {DOTS.map((d, i) => {
                const s = DOT_SIZE * (1 + 0.55 * pulseE);
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: d.x + DOT_SIZE / 2 - s / 2,
                      top: d.y + DOT_SIZE / 2 - s / 2,
                      width: s,
                      height: s,
                      borderRadius: 99,
                      backgroundColor: accent,
                      opacity: dotsBase * (0.5 + 0.5 * pulseE),
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div style={{ ...TYPE.sub, fontSize: 24 }}>K3 · 最多 300 子代理</div>
        </Card>

        {/* ---------------- 卡三：Manus ---------------- */}
        <Card
          tone="light"
          style={{
            position: "absolute",
            left: 1280,
            top: 210,
            width: 500,
            height: 420,
            padding: 28,
            opacity: prog(frame, cardAt(2), 13),
            transform: `translateY(${(1 - cardIn(2)) * 32}px) rotate(${(1 - cardIn(2)) * 3}deg)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Img src={staticFile("logos/manus.svg")} style={{ width: 52 }} />
            <span style={NAME}>Manus</span>
          </div>
          <div style={{ height: 230, marginTop: 16, position: "relative" }}>
            <svg width={444} height={230} style={{ position: "absolute", inset: 0 }}>
              {/* 地图节点 → 手机：一条墨线 */}
              <DrawPath d="M 118 128 Q 220 74 316 118" start={140} dur={40} width={3} opacity={0.75} endDot={false} />
              {/* 地图节点（pin） */}
              <g opacity={manusPin}>
                <path
                  d="M 86 148 L 78 128 A 13 13 0 1 1 98 128 Z"
                  fill="none"
                  stroke={COLORS.ink}
                  strokeWidth={2.6}
                  strokeLinejoin="round"
                />
                <circle cx={88} cy={116} r={4.6} fill={accent} />
                <ellipse cx={88} cy={162} rx={26} ry={6} fill={COLORS.ink} opacity={0.07} />
              </g>
              {/* 手机 */}
              <g opacity={manusPhone}>
                <rect
                  x={308}
                  y={78}
                  width={52}
                  height={92}
                  rx={12}
                  fill="none"
                  stroke={COLORS.ink}
                  strokeWidth={2.6}
                />
                <path d="M 324 90 H 344" stroke={COLORS.ink} strokeWidth={2} strokeLinecap="round" />
                <path
                  d="M 326 160 H 342"
                  stroke={COLORS.ink}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                />
                <circle cx={334} cy={132} r={4} fill={accent} />
              </g>
            </svg>
          </div>
          <div style={{ ...TYPE.sub, fontSize: 24 }}>2.0 · 携手 OPPO，Find X10 首发</div>
        </Card>

        {/* 统一小注 */}
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 660,
            opacity: noteP,
            ...TYPE.label,
            fontSize: 21,
            letterSpacing: "0.14em",
          }}
        >
          以各品牌官方口径为准
        </div>

        {/* 主文案（左下） */}
        <div style={{ position: "absolute", left: 140, bottom: 100, width: 1640 }}>
          <div
            style={{
              ...TYPE.body,
              fontSize: 40,
              lineHeight: 1.55,
              opacity: capA,
              transform: `translateY(${(1 - capP) * 20}px)`,
            }}
          >
            {CN_L1}
            <br />
            {CN_L2}
          </div>
          <div
            style={{
              ...TYPE.en,
              fontSize: 33,
              lineHeight: 1.45,
              marginTop: 12,
              opacity: capEnA * 0.9,
              transform: `translateY(${(1 - capEnP) * 20}px)`,
            }}
          >
            {EN_L1}
            <br />
            {EN_L2}
          </div>
        </div>
      </div>

      {/* SFX：ui-ping ×3（三卡依次落定） */}
      {[0, 1, 2].map((i) => (
        <Sequence key={i} from={pingAt(i)}>
          <Audio src={staticFile("sfx/ui-ping.wav")} />
        </Sequence>
      ))}
    </PaperStage>
  );
};
