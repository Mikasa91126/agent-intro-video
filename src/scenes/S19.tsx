import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { CharReveal, FadeText } from "../comps/Text";
import { BRAND_COLORS, COLORS, EASE, FONTS } from "../theme";
import { clamp01, prog } from "../lib/anim";

/** S19 · 收尾·方向盘（2:52–3:00 · 480f）
 *  品牌卡收拢为一颗陶土圆点 → 落在确认键上 → 人的手指按下（涟漪）→ 金句定格 + 片尾小字。 */

const DOT = { x: 960, y: 452 };
const KEY = { x: 850, y: 560, w: 220, h: 78 };

const CARDS = [
  { label: "Claude", color: BRAND_COLORS.clay, from: { x: 380, y: 220 } },
  { label: "OpenAI", color: BRAND_COLORS.openai, from: { x: 1520, y: 250 } },
  { label: "DeepSeek", color: BRAND_COLORS.deepseek, from: { x: 320, y: 700 } },
  { label: "Google", color: BRAND_COLORS.google, from: { x: 1600, y: 680 } },
  { label: "国内代表", color: "#8C8579", from: { x: 960, y: 160 } },
];

export const S19 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  /** 手指按下确认键 */
  const press = prog(frame, 202, 20);
  const keyDip = press * 5;
  const rippleP = prog(frame, 218, 20);

  return (
    <PaperStage dur={dur} tone="light" glow={false}>
      {/* 品牌卡 → 圆点 */}
      {CARDS.map((c, i) => {
        const p = EASE.outExpo(clamp01((frame - 10 - i * 9) / 92));
        const x = c.from.x + (DOT.x - c.from.x) * p;
        const y = c.from.y + (DOT.y - c.from.y) * p;
        const s = 1 - p * 0.92;
        if (p >= 1) return null;
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${s})`,
              opacity: 1 - p * 0.85,
              border: `1px solid ${COLORS.line}`,
              borderLeft: `4px solid ${c.color}`,
              borderRadius: 10,
              backgroundColor: COLORS.paperWhite,
              padding: "12px 22px",
              fontFamily: FONTS.sansCN,
              fontSize: 24,
              color: COLORS.graphite,
              boxShadow: "0 12px 30px rgba(31,30,29,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            {c.label}
          </div>
        );
      })}

      {/* 圆点落下 */}
      {(() => {
        const fall = EASE.outExpo(clamp01((frame - 118) / 56));
        const y = DOT.y + (KEY.y - 14 - DOT.y) * fall;
        const grow = 1 + prog(frame, 118, 60) * 0.35;
        return (
          <div
            style={{
              position: "absolute",
              left: DOT.x - 26,
              top: y - 26,
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: COLORS.clay,
              transform: `scale(${grow})`,
              boxShadow: "0 14px 34px rgba(217,119,87,0.35)",
            }}
          />
        );
      })()}

      {/* 确认键 */}
      <div
        style={{
          position: "absolute",
          left: KEY.x,
          top: KEY.y + keyDip,
          width: KEY.w,
          height: KEY.h,
          borderRadius: 16,
          border: `1.5px solid ${COLORS.clay}`,
          backgroundColor: COLORS.paperWhite,
          boxShadow: `0 ${18 - keyDip * 2}px 40px rgba(31,30,29,${0.12 - keyDip * 0.01})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          opacity: clamp01((frame - 40) / 24),
        }}
      >
        <span style={{ fontFamily: FONTS.serifCN, fontSize: 36, color: COLORS.ink }}>
          执行
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 26, color: COLORS.clay }}>⏎</span>
      </div>

      {/* 点击涟漪 */}
      {rippleP > 0 && rippleP < 1 ? (
        <div
          style={{
            position: "absolute",
            left: DOT.x - (30 + rippleP * 70),
            top: KEY.y + 12 - (30 + rippleP * 70),
            width: (30 + rippleP * 70) * 2,
            height: (30 + rippleP * 70) * 2,
            borderRadius: "50%",
            border: `2px solid ${COLORS.clay}`,
            opacity: (1 - rippleP) * 0.7,
          }}
        />
      ) : null}

      {/* 人的手指（简洁形：kraft 圆角指形，按下后回抽） */}
      {(() => {
        const pressP = EASE.outExpo(prog(frame, 178, 30));
        const lift = EASE.outExpo(prog(frame, 258, 36)); // 按下后回抽
        const y =
          250 + ((KEY.y - 74) - 250) * pressP - ((KEY.y - 74) - 186) * lift;
        const op =
          clamp01((frame - 172) / 14) * (1 - prog(frame, 258, 42));
        if (frame < 172 || op <= 0.001) return null;
        return (
          <div
            style={{
              position: "absolute",
              left: DOT.x - 22,
              top: y,
              width: 44,
              height: 108,
              borderRadius: "22px 22px 18px 18px",
              backgroundColor: "#D4A27F",
              opacity: op,
              boxShadow: "0 16px 34px rgba(31,30,29,0.18)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 6,
                right: 6,
                top: 26,
                height: 2,
                backgroundColor: "rgba(31,30,29,0.18)",
                borderRadius: 2,
              }}
            />
          </div>
        );
      })()}

      {/* 金句 + 英文 + 片尾小字 */}
      <div style={{ position: "absolute", top: 720, width: "100%" }}>
        <CharReveal
          text="Agent 替你跑腿，方向盘还在你手里。"
          start={235}
          staggerFrames={2.4}
          charFrames={30}
          style={{ ...TYPE.h1cn, fontSize: 64, justifyContent: "center" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 828,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeText start={300}>
          <div style={{ ...TYPE.enItalic, textAlign: "center" }}>
            Agents do the running. You keep the wheel.
          </div>
        </FadeText>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1006,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeText start={336} y={4}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 17,
              letterSpacing: "0.08em",
              color: COLORS.grey,
              opacity: 0.85,
            }}
          >
            本片为概念科普 · 商标归各自品牌所有 · 来源：官方文档与公开报道 · 2026
          </div>
        </FadeText>
      </div>

      {/* SFX */}
      <Sequence from={196}>
        <Audio src={staticFile("sfx/whoosh.wav")} />
      </Sequence>
      <Sequence from={218}>
        <Audio src={staticFile("sfx/confirm-click.wav")} />
      </Sequence>
    </PaperStage>
  );
};
