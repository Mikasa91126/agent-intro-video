import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { CharReveal, FadeText } from "../comps/Text";
import { MiniWindow } from "../comps/ui";
import { Cursor } from "../comps/Cursor";
import type { CursorWaypoint } from "../comps/Cursor";
import { COLORS, EASE } from "../theme";
import { clamp01 } from "../lib/anim";

/** S01 · 开场钩子（0:00–0:10 · 600f）
 *  「AI 不只会聊天了。它会替你干活。」——光标点击「干活」，拖出三个迷你窗口排成一列。 */

const CLICK = { x: 648, y: 545 };
/** 窗口弹出原点（从点击点向右上拱起） */
const winFrom = (i: number) => ({ x: 560 + i * 36, y: 470 - i * 34 });
/** 拖拽终点（右列） */
const COL_X = 1418;
const COL_Y = [214, 452, 690] as const;
const DRAG_START = [344, 424, 504] as const;
const DRAG_D = 70;

export const S01 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  const winPos = (i: number) => {
    const p = EASE.outExpo(clamp01((frame - DRAG_START[i]) / DRAG_D));
    const a = winFrom(i);
    return { x: a.x + (COL_X - a.x) * p, y: a.y + (COL_Y[i] - a.y) * p };
  };
  const winPop = (i: number) => EASE.outExpo(clamp01((frame - (314 + i * 18)) / 40));

  const wp: CursorWaypoint[] = [
    { x: 1580, y: 420, f: 205 },
    { x: CLICK.x + 4, y: CLICK.y + 12, f: 294 },
    { x: CLICK.x + 4, y: CLICK.y + 12, f: 312 },
    { x: winFrom(0).x + 46, y: winFrom(0).y + 24, f: 344 },
    { x: COL_X + 46, y: COL_Y[0] + 26, f: DRAG_START[0] + DRAG_D },
    { x: winFrom(1).x + 46, y: winFrom(1).y + 24, f: 424 },
    { x: COL_X + 46, y: COL_Y[1] + 26, f: DRAG_START[1] + DRAG_D },
    { x: winFrom(2).x + 46, y: winFrom(2).y + 24, f: 504 },
    { x: COL_X + 46, y: COL_Y[2] + 26, f: DRAG_START[2] + DRAG_D },
    { x: COL_X + 46, y: COL_Y[2] + 26, f: 592 },
  ];

  const outOp = 1 - clamp01((frame - (dur - 9)) / 9);

  return (
    <PaperStage dur={dur} tone="medium">
      {/* 片头黑场 0.3s */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.ink,
          opacity: 1 - clamp01((frame - 4) / 14),
        }}
      />

      <div style={{ opacity: outOp }}>
        {/* 主文案 */}
        <div style={{ position: "absolute", left: 170, top: 330 }}>
          <CharReveal
            text="AI 不只会聊天了。"
            start={26}
            staggerFrames={2.6}
            charFrames={34}
            style={{ ...TYPE.h1cn, fontSize: 96 }}
          />
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 44 }}>
            <CharReveal
              text="它会替你"
              start={78}
              staggerFrames={2.6}
              charFrames={34}
              style={{ ...TYPE.h1cn, fontSize: 96 }}
            />
            <div style={{ position: "relative", display: "inline-block" }}>
              <CharReveal
                text="干活"
                start={112}
                staggerFrames={2.6}
                charFrames={34}
                style={{ ...TYPE.h1cn, fontSize: 96, color: COLORS.clay }}
              />
              {/* 陶土下划线（点击前画上） */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -14,
                  width: 196 * EASE.outExpo(clamp01((frame - 168) / 40)),
                  height: 6,
                  backgroundColor: COLORS.clay,
                  borderRadius: 3,
                }}
              />
            </div>
            <CharReveal
              text="。"
              start={130}
              staggerFrames={2.6}
              charFrames={34}
              style={{ ...TYPE.h1cn, fontSize: 96 }}
            />
          </div>
          <FadeText start={205} style={{ marginTop: 42 }}>
            <div style={{ ...TYPE.en, fontSize: 34 }}>
              AI doesn't just talk anymore. It gets things done.
            </div>
          </FadeText>
        </div>

        {/* 三个迷你窗口 */}
        {[0, 1, 2].map((i) => {
          const p = winPos(i);
          const pop = winPop(i);
          if (pop <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                transform: `scale(${0.6 + 0.4 * pop})`,
                opacity: Math.min(1, pop * 1.6),
              }}
            >
              {i === 0 ? (
                <MiniWindow
                  title="zsh"
                  variant="dark"
                  width={252}
                  height={176}
                  bodyStyle={{ padding: 12 }}
                >
                  <div style={{ ...TYPE.term, fontSize: 15, lineHeight: 1.7, opacity: 0.75 }}>
                    ❯ git clone agent-lab
                  </div>
                  <div
                    style={{
                      ...TYPE.term,
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: COLORS.termGreen,
                    }}
                  >
                    ✓ ready in 1.8s
                  </div>
                </MiniWindow>
              ) : null}
              {i === 1 ? (
                <MiniWindow
                  title="report.xlsx"
                  variant="light"
                  width={252}
                  height={176}
                  bodyStyle={{ padding: 12 }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                    {Array.from({ length: 12 }, (_, j) => (
                      <div
                        key={j}
                        style={{
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: j === 7 ? COLORS.clay : "rgba(20,20,19,0.08)",
                          opacity: j === 7 ? 0.85 : 0.6,
                        }}
                      />
                    ))}
                  </div>
                </MiniWindow>
              ) : null}
              {i === 2 ? (
                <MiniWindow
                  title="agent.run"
                  variant="light"
                  width={252}
                  height={176}
                  bodyStyle={{ padding: 12 }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 14,
                      borderRadius: 6,
                      backgroundColor: "rgba(20,20,19,0.1)",
                    }}
                  />
                  <div
                    style={{
                      marginTop: 10,
                      width: "72%",
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(20,20,19,0.14)",
                    }}
                  />
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <div
                      style={{ width: 74, height: 40, borderRadius: 8, backgroundColor: "rgba(20,20,19,0.08)" }}
                    />
                    <div
                      style={{ width: 74, height: 40, borderRadius: 8, backgroundColor: "rgba(217,119,87,0.22)" }}
                    />
                    <div
                      style={{ width: 74, height: 40, borderRadius: 8, backgroundColor: "rgba(20,20,19,0.08)" }}
                    />
                  </div>
                </MiniWindow>
              ) : null}
            </div>
          );
        })}

        {/* 光标 */}
        <Cursor path={wp} clicks={[314]} appearAt={200} />

        {/* 片尾下扫线 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 118,
            height: 3,
            width: 1920 * EASE.outExpo(clamp01((frame - 540) / 44)),
            backgroundColor: COLORS.clay,
            opacity: 0.9,
          }}
        />

        {/* SFX */}
        <Sequence from={5}>
          <Audio src={staticFile("sfx/paper-drop.wav")} />
        </Sequence>
        <Sequence from={314}>
          <Audio src={staticFile("sfx/enter-click.wav")} />
        </Sequence>
      </div>
    </PaperStage>
  );
};
