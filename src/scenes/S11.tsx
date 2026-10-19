/**
 * S11 · 品牌 · Google（1:51–2:03 · 720f）【品牌色时刻：矿石绿 #629987】
 * 左：Antigravity 双栏窗口（编辑器 + 浏览器，墨线绘制框体）；
 * 右：Jules 流程卡（GitHub → 云 VM → PR，墨线相连、数据包单向流过）；
 * 左下：旧 Mariner 图标淡化置灰 + 角标「已下线 2026-05-04」；角落官方 G logo（≤80px）。
 * 转场：品牌色渐变 + 墨线流程绘制；SFX：whoosh（VM 启动）+ ui-ping（PR 完成）。
 */
import type { CSSProperties } from "react";
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
import { DrawPath } from "../comps/wire";
import { TYPE } from "../comps/type";
import { BRAND_COLORS, COLORS } from "../theme";
import { clamp01, outExpo, prog } from "../lib/anim";

/** 定稿文案（§1 S11，不改字） */
const CN = "Google：Antigravity 写代码，Jules 在云端接活——提需求，等一个 PR。";
const EN = "Google: Antigravity codes; Jules works async in the cloud and returns a PR.";

const TITLE: CSSProperties = {
  fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
  fontWeight: 500,
  fontSize: 30,
  letterSpacing: "0.01em",
  color: COLORS.ink,
};

/* ------------------------------------------------ Antigravity 双栏窗口 */
const WIN_W = 900;
const WIN_H = 390;
const WIN_R = 16;
const FRAME_PATH =
  `M ${WIN_R} 1 H ${WIN_W - WIN_R} A ${WIN_R} ${WIN_R} 0 0 1 ${WIN_W - 1} ${WIN_R}` +
  ` V ${WIN_H - WIN_R} A ${WIN_R} ${WIN_R} 0 0 1 ${WIN_W - WIN_R} ${WIN_H - 1}` +
  ` H ${WIN_R} A ${WIN_R} ${WIN_R} 0 0 1 1 ${WIN_H - WIN_R}` +
  ` V ${WIN_R} A ${WIN_R} ${WIN_R} 0 0 1 ${WIN_R} 1 Z`;
const SPLIT_X = 500;
const CODE = [
  { n: "1", t: "async function build(req) {" },
  { n: "2", t: "  const plan = await agent.plan()" },
  { n: "3", t: "  const app = plan.apply()" },
  { n: "4", t: "  return app.preview()" },
  { n: "5", t: "}" },
];

/* ------------------------------------------------ Jules 流程（节点相对卡内坐标） */
const JULES_W = 700;
const JULES_H = 390;
const NODES = [
  { x: 110, y: 186, l: "GitHub" },
  { x: 350, y: 186, l: "云 VM" },
  { x: 590, y: 186, l: "PR" },
];
const PACKET_START = 240;
const PACKET_PERIOD = 150;
const PACKET_ARRIVE = PACKET_START + PACKET_PERIOD;

export const S11 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  /* 品牌色时刻：clay → 矿石绿；镜尾回落 clay */
  const accent =
    frame <= dur - 14
      ? interpolateColors(frame, [0, 12], [COLORS.clay, BRAND_COLORS.google])
      : interpolateColors(frame, [dur - 14, dur], [BRAND_COLORS.google, COLORS.clay]);

  const exit = prog(frame, dur - 16, 16);
  const exitE = outExpo(exit);

  /* 墨线绘制框体 → 内容 */
  const paneL = outExpo(prog(frame, 96, 34));
  const paneR = outExpo(prog(frame, 122, 34));
  const codeLine = (i: number) => outExpo(prog(frame, 100 + i * 11, 30));
  const browserBlock = (i: number) => outExpo(prog(frame, 132 + i * 12, 30));

  /* Jules */
  const julesA = outExpo(prog(frame, 110, 40));
  const nodeIn = (i: number) => outExpo(prog(frame, 130 + i * 12, 28));
  const packetT = frame >= PACKET_START ? ((frame - PACKET_START) % PACKET_PERIOD) / PACKET_PERIOD : -1;
  const prDone = outExpo(prog(frame, PACKET_ARRIVE + 6, 28));

  /* Mariner */
  const marinerP = outExpo(prog(frame, 250, 38));
  const marinerBadge = outExpo(prog(frame, 300, 34));

  /* 字幕 */
  const capA = prog(frame, 380, 13);
  const capP = outExpo(prog(frame, 380, 38));
  const capEnA = prog(frame, 422, 13);
  const capEnP = outExpo(prog(frame, 422, 38));

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
        <Img
          src={staticFile("logos/google.svg")}
          style={{ position: "absolute", left: 1708, top: 104, width: 72 }}
        />

        {/* 左上章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          品牌巡礼 04 · GOOGLE
        </div>

        {/* ---------------- Antigravity 双栏窗口 ---------------- */}
        <div style={{ position: "absolute", left: 140, top: 140, ...TITLE }}>Antigravity</div>
        <div style={{ position: "absolute", left: 140, top: 196, width: WIN_W, height: WIN_H }}>
          <svg width={WIN_W} height={WIN_H} style={{ position: "absolute", inset: 0 }}>
            <DrawPath d={FRAME_PATH} start={20} dur={52} width={2.4} opacity={0.55} />
            <DrawPath
              d={`M ${SPLIT_X} ${WIN_R} L ${SPLIT_X} ${WIN_H - WIN_R}`}
              start={78}
              dur={30}
              width={1.6}
              opacity={0.3}
              endDot={false}
            />
          </svg>

          {/* 左栏：编辑器 */}
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 30,
              width: SPLIT_X - 52,
              opacity: paneL,
            }}
          >
            {CODE.map((line, i) => (
              <div
                key={line.n}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "5px 10px",
                  borderRadius: 6,
                  marginBottom: 6,
                  backgroundColor: i === 2 ? "rgba(20,20,19,0.05)" : "transparent",
                  opacity: codeLine(i),
                  transform: `translateX(${(1 - codeLine(i)) * 14}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fragment Mono', monospace",
                    fontSize: 21,
                    color: COLORS.grey,
                    opacity: 0.6,
                    width: 16,
                    textAlign: "right",
                  }}
                >
                  {line.n}
                </span>
                <span
                  style={{
                    fontFamily: "'Fragment Mono', monospace",
                    fontSize: 20,
                    color: COLORS.ink,
                    whiteSpace: "pre",
                  }}
                >
                  {line.t}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
                paddingLeft: 10,
                opacity: browserBlock(4),
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  backgroundColor: accent,
                  color: COLORS.paperWhite,
                  fontSize: 15,
                  textAlign: "center",
                  lineHeight: "23px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ✓
              </span>
              <span
                style={{
                  fontFamily: "'Fragment Mono', monospace",
                  fontSize: 20,
                  color: COLORS.graphite,
                }}
              >
                tests pass
              </span>
            </div>
          </div>

          {/* 右栏：浏览器 */}
          <div
            style={{
              position: "absolute",
              left: SPLIT_X + 26,
              top: 30,
              width: WIN_W - SPLIT_X - 52,
              opacity: paneR,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 34,
                padding: "0 14px",
                borderRadius: 8,
                backgroundColor: COLORS.paperDeep,
                border: `1px solid ${COLORS.lineSoft}`,
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 99,
                  backgroundColor: accent,
                  opacity: browserBlock(0),
                }}
              />
              <span
                style={{
                  fontFamily: "'Fragment Mono', monospace",
                  fontSize: 19,
                  color: COLORS.graphite,
                }}
              >
                localhost:3000
              </span>
            </div>
            <div
              style={{
                marginTop: 18,
                opacity: browserBlock(1),
                transform: `translateY(${(1 - browserBlock(1)) * 12}px)`,
              }}
            >
              <div style={{ height: 58, borderRadius: 8, backgroundColor: COLORS.paperDeep }} />
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <div
                  style={{
                    flex: 1,
                    height: 92,
                    borderRadius: 8,
                    backgroundColor: "rgba(20,20,19,0.055)",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: 92,
                    borderRadius: 8,
                    backgroundColor: "rgba(20,20,19,0.055)",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 12,
                opacity: browserBlock(2),
                transform: `translateY(${(1 - browserBlock(2)) * 12}px)`,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: "rgba(20,20,19,0.04)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- Jules 流程卡 ---------------- */}
        <div style={{ position: "absolute", left: 1080, top: 140, ...TITLE }}>Jules</div>
        <div
          style={{
            position: "absolute",
            left: 1080,
            top: 196,
            width: JULES_W,
            height: JULES_H,
            opacity: julesA,
            transform: `translateY(${(1 - julesA) * 26}px)`,
          }}
        >
          <Card tone="light" padding={0} style={{ width: JULES_W, height: JULES_H }}>
            {null}
          </Card>
          <svg width={JULES_W} height={JULES_H} style={{ position: "absolute", inset: 0 }}>
            {/* 墨线：GitHub → 云 VM → PR */}
            <DrawPath d={`M ${NODES[0].x + 30} ${NODES[0].y} L ${NODES[1].x - 30} ${NODES[1].y}`} start={150} dur={34} width={2.2} opacity={0.5} endDot={false} />
            <DrawPath d={`M ${NODES[1].x + 30} ${NODES[1].y} L ${NODES[2].x - 30} ${NODES[2].y}`} start={186} dur={34} width={2.2} opacity={0.5} endDot={false} />
            {/* 单向数据包 */}
            {packetT >= 0 ? (
              <circle
                cx={NODES[0].x + (NODES[2].x - NODES[0].x) * packetT}
                cy={NODES[0].y}
                r={6.5}
                fill={accent}
                opacity={0.9 * Math.min(1, Math.min(packetT, 1 - packetT) * 9)}
              />
            ) : null}
            {/* 三节点（纸底填充盖住穿过的数据包） */}
            {NODES.map((n, i) => {
              const e = nodeIn(i);
              const done = i === 2 ? prDone : 0;
              return (
                <g key={n.l} opacity={e}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={30 * (0.75 + 0.25 * e)}
                    fill={COLORS.paperWhite}
                    stroke={i === 2 ? accent : COLORS.ink}
                    strokeWidth={2.2}
                    strokeOpacity={i === 2 ? 0.4 + 0.6 * done : 0.55}
                  />
                  {i === 0 ? (
                    <>
                      <circle cx={n.x - 9} cy={n.y + 8} r={4} fill={COLORS.ink} fillOpacity={0.8} />
                      <circle cx={n.x + 8} cy={n.y - 9} r={4} fill={COLORS.ink} fillOpacity={0.8} />
                      <path
                        d={`M ${n.x - 9} ${n.y + 8} L ${n.x - 9} ${n.y - 2} L ${n.x + 8} ${n.y - 9} M ${n.x - 9} ${n.y - 2} L ${n.x + 8} ${n.y + 5}`}
                        fill="none"
                        stroke={COLORS.ink}
                        strokeOpacity={0.8}
                        strokeWidth={2}
                      />
                    </>
                  ) : null}
                  {i === 1 ? (
                    <>
                      <circle cx={n.x - 5} cy={n.y - 4} r={9} fill="none" stroke={COLORS.ink} strokeOpacity={0.75} strokeWidth={2.4} />
                      <circle cx={n.x + 6} cy={n.y - 1} r={6.5} fill="none" stroke={COLORS.ink} strokeOpacity={0.75} strokeWidth={2.4} />
                      <path
                        d={`M ${n.x - 13} ${n.y + 5} H ${n.x + 12}`}
                        stroke={COLORS.ink}
                        strokeOpacity={0.75}
                        strokeWidth={2.4}
                        strokeLinecap="round"
                      />
                    </>
                  ) : null}
                  {i === 2 ? (
                    <path
                      d={`M ${n.x - 9} ${n.y + 1} L ${n.x - 2} ${n.y + 8} L ${n.x + 10} ${n.y - 7}`}
                      fill="none"
                      stroke={accent}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.25 + 0.75 * done}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>
          {NODES.map((n, i) => (
            <div
              key={n.l}
              style={{
                position: "absolute",
                left: n.x - 80,
                top: n.y + 44,
                width: 160,
                textAlign: "center",
                opacity: nodeIn(i),
                fontFamily: "'Fragment Mono', monospace",
                fontSize: 23,
                letterSpacing: "0.06em",
                color: i === 2 && prDone > 0.5 ? COLORS.ink : COLORS.graphite,
              }}
            >
              {n.l}
            </div>
          ))}
        </div>

        {/* ---------------- 旧 Mariner（置灰） ---------------- */}
        <div style={{ position: "absolute", left: 140, top: 626, width: 340, height: 120 }}>
          <Card
            tone="deep"
            padding={0}
            style={{
              width: 340,
              height: 120,
              opacity: 0.75 * marinerP,
              transform: `translateY(${(1 - marinerP) * 16}px)`,
            }}
          >
            {null}
          </Card>
          <svg
            width={340}
            height={120}
            style={{ position: "absolute", inset: 0, opacity: marinerP }}
          >
            <g opacity={0.3}>
              <circle cx={54} cy={60} r={26} fill="none" stroke={COLORS.graphite} strokeWidth={2} />
              <ellipse cx={54} cy={60} rx={11} ry={26} fill="none" stroke={COLORS.graphite} strokeWidth={1.6} />
              <path d="M 28 60 H 80 M 33 44 H 75 M 33 76 H 75" stroke={COLORS.graphite} strokeWidth={1.6} />
            </g>
          </svg>
          <div
            style={{
              position: "absolute",
              left: 100,
              top: 44,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 28,
              fontWeight: 500,
              color: COLORS.graphite,
              opacity: 0.55 * marinerP,
            }}
          >
            Mariner
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 404,
            top: 690,
            padding: "8px 16px",
            border: `1.5px solid ${COLORS.graphite}`,
            borderRadius: 6,
            backgroundColor: COLORS.paperDeep,
            transform: `rotate(-5deg) scale(${0.92 + 0.08 * marinerBadge})`,
            opacity: marinerBadge * 0.85,
            fontFamily: "'Fragment Mono', monospace",
            fontSize: 22,
            letterSpacing: "0.08em",
            color: COLORS.graphite,
            whiteSpace: "nowrap",
          }}
        >
          已下线 2026-05-04
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
            {CN}
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
            {EN}
          </div>
        </div>
      </div>

      {/* SFX */}
      <Sequence from={150}>
        <Audio src={staticFile("sfx/whoosh.wav")} />
      </Sequence>
      <Sequence from={PACKET_ARRIVE + 2}>
        <Audio src={staticFile("sfx/ui-ping.wav")} />
      </Sequence>
    </PaperStage>
  );
};
