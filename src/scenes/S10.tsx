/**
 * S10 · 品牌 · DeepSeek（1:39–1:51 · 720f）【品牌色时刻：天空蓝 #6A9BCC】
 * 左侧开源分叉节点图标（墨线绘制）+ 中部权重方块阵列逐格点亮拼出「552B」
 * + 右侧价格看板 count-up（$0.15 / $0.60） + 底部终端行 TypeIn `npx @deepseek-ai/dsh web`
 * + 角落官方鲸鱼 logo（≤80px）。
 * 转场：节点网格亮起 → 品牌色渐变（clay→天空蓝）；SFX：coin-chime + key-type。
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
import { Card, MiniWindow, TermLine } from "../comps/ui";
import { TypeIn } from "../comps/TypeIn";
import { Counter } from "../comps/Counter";
import { DrawPath } from "../comps/wire";
import { TYPE } from "../comps/type";
import { BRAND_COLORS, COLORS } from "../theme";
import { clamp01, outExpo, prog } from "../lib/anim";

/** 定稿文案（§1 S10，不改字；换行仅按句读断行） */
const CN_L1 = "DeepSeek：把 Agent 做成开源基础设施。";
const CN_L2 = "552B 大模型、1M 上下文、权重 MIT——错峰价每百万 token 只要 $0.15。";
const EN =
  "DeepSeek: open-source agent infrastructure. 552B MoE, 1M context, MIT weights, $0.15 per million tokens off-peak.";

/* ------------------------------------------------ 权重方块阵列：552B */
const ROWS = 7;
const PITCH = 35;
const CELL = 28;
const ARRAY_X = 431;
const ARRAY_Y = 300;
const GLYPH: Record<string, string[]> = {
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "2": ["11110", "00001", "00001", "11110", "10000", "10000", "11111"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
};
const WORD = ["5", "5", "2", "B"];
const COLS = WORD.length * 6 - 1; // 23 列（5 列字模 + 1 列字距）
const CELLS: Array<{ c: number; x: number; y: number; on: boolean }> = [];
for (let c = 0; c < COLS; c++) {
  const gi = Math.floor(c / 6);
  const wi = c % 6;
  if (wi === 5) continue; // 字距列
  const rows = GLYPH[WORD[gi]];
  for (let r = 0; r < ROWS; r++) {
    CELLS.push({
      c,
      x: ARRAY_X + c * PITCH,
      y: ARRAY_Y + r * PITCH,
      on: rows[r][wi] === "1",
    });
  }
}
const colAt = (c: number) => 48 + c * 4;

export const S10 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  /* 品牌色时刻：clay → 天空蓝；镜尾回落 clay */
  const accent =
    frame <= dur - 14
      ? interpolateColors(frame, [0, 12], [COLORS.clay, BRAND_COLORS.deepseek])
      : interpolateColors(frame, [dur - 14, dur], [BRAND_COLORS.deepseek, COLORS.clay]);

  const exit = prog(frame, dur - 16, 16);
  const exitE = outExpo(exit);

  /* 分叉图标 */
  const forkNode = (i: number) => outExpo(prog(frame, 90 + i * 8, 26));
  const forkLabel = prog(frame, 116, 14);

  /* 方块阵列落定 + 标签 */
  const arrayLabelP = prog(frame, 146, 14);

  /* 价格看板 */
  const priceA = prog(frame, 110, 14);
  const priceE = outExpo(prog(frame, 110, 38));

  /* 终端 */
  const termP = outExpo(prog(frame, 300, 40));
  const dshNote = prog(frame, 440, 14);

  /* 字幕 */
  const capA = prog(frame, 420, 13);
  const capP = outExpo(prog(frame, 420, 38));
  const capEnA = prog(frame, 462, 13);
  const capEnP = outExpo(prog(frame, 462, 38));

  return (
    <PaperStage dur={dur} tone="medium" grid creep="push">
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exit,
          transform: `translateY(${-exitE * 18}px)`,
        }}
      >
        <Img
          src={staticFile("logos/deepseek.svg")}
          style={{ position: "absolute", left: 1708, top: 104, width: 72 }}
        />

        {/* 左上章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          品牌巡礼 03 · DEEPSEEK
        </div>

        {/* 左：开源分叉节点图标 */}
        <svg width={230} height={220} style={{ position: "absolute", left: 165, top: 275 }}>
          <DrawPath d="M 115 182 L 115 96 L 60 41" start={30} dur={54} width={3} />
          <DrawPath d="M 115 96 L 170 41" start={74} dur={36} width={3} />
          {[
            { x: 60, y: 41, i: 0, accent: true },
            { x: 170, y: 41, i: 1, accent: true },
            { x: 115, y: 182, i: 2, accent: false },
          ].map((n) => (
            <circle
              key={n.i}
              cx={n.x}
              cy={n.y}
              r={13 * (0.5 + 0.5 * forkNode(n.i))}
              fill={n.accent ? accent : COLORS.ink}
              fillOpacity={n.accent ? 0.9 : 0.82}
              stroke={COLORS.paperWhite}
              strokeWidth={2}
              opacity={forkNode(n.i)}
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 508,
            width: 280,
            textAlign: "center",
            opacity: forkLabel,
          }}
        >
          <div style={{ ...TYPE.body, fontSize: 30, lineHeight: 1.3 }}>开源</div>
          <div style={{ ...TYPE.label, fontSize: 20, marginTop: 8 }}>OPEN SOURCE</div>
        </div>

        {/* 中：权重方块阵列（逐格点亮拼出 552B） */}
        <div style={{ position: "absolute", inset: 0 }}>
          {CELLS.map((cell, i) => {
            const p = clamp01((frame - colAt(cell.c)) / 12);
            if (p <= 0) return null;
            const e = outExpo(p);
            if (!cell.on) {
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: cell.x,
                    top: cell.y,
                    width: CELL,
                    height: CELL,
                    borderRadius: 6,
                    backgroundColor: "rgba(20,20,19,0.05)",
                    opacity: p,
                  }}
                />
              );
            }
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: cell.x + (CELL * (1 - (0.5 + 0.5 * e))) / 2,
                  top: cell.y + (CELL * (1 - (0.5 + 0.5 * e))) / 2,
                  width: CELL * (0.5 + 0.5 * e),
                  height: CELL * (0.5 + 0.5 * e),
                  borderRadius: 6,
                  backgroundColor: accent,
                  opacity: 0.22 + 0.78 * p,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 530,
            top: 542,
            width: 600,
            textAlign: "center",
            opacity: arrayLabelP,
            ...TYPE.label,
            fontSize: 22,
          }}
        >
          552B MoE · 1M 上下文 · 权重 MIT
        </div>

        {/* 右：价格看板 */}
        <Card
          tone="light"
          padding="28px 30px"
          style={{
            position: "absolute",
            left: 1340,
            top: 226,
            width: 440,
            opacity: priceA,
            transform: `translateY(${(1 - priceE) * 26}px)`,
          }}
        >
          <div style={{ ...TYPE.label, fontSize: 22 }}>错峰价 · OFF-PEAK</div>
          <Counter
            from={0}
            to={0.15}
            start={144}
            dur={84}
            prefix="$"
            format={(v) => v.toFixed(2)}
            style={{ ...TYPE.num, fontSize: 86, color: accent, display: "block", marginTop: 30 }}
          />
          <div style={{ height: 1, backgroundColor: COLORS.lineSoft, margin: "24px 0" }} />
          <Counter
            from={0}
            to={0.6}
            start={156}
            dur={84}
            prefix="$"
            format={(v) => v.toFixed(2)}
            style={{ ...TYPE.num, fontSize: 86, color: accent, display: "block" }}
          />
          <div style={{ ...TYPE.sub, fontSize: 24, marginTop: 26 }}>每百万 token</div>
        </Card>

        {/* 底部终端行 */}
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 592,
            width: 1080,
            opacity: termP,
            transform: `translateY(${(1 - termP) * 20}px)`,
          }}
        >
          <MiniWindow title="dsh — deepseek harness" variant="dark" height={124}>
            <TermLine>
              <TypeIn text="npx @deepseek-ai/dsh web" start={330} cps={16} caretHold={40} />
            </TermLine>
          </MiniWindow>
        </div>
        <div
          style={{
            position: "absolute",
            left: 1258,
            top: 632,
            opacity: dshNote,
            fontFamily: "'Fragment Mono', monospace",
            fontSize: 22,
            lineHeight: 1.9,
            letterSpacing: "0.06em",
            color: COLORS.graphite,
          }}
        >
          DSH = DeepSeek Harness
          <br />
          MIT 开源
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
              fontSize: 31,
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
      <Sequence from={230}>
        <Audio src={staticFile("sfx/coin-chime.wav")} />
      </Sequence>
      <Sequence from={332}>
        <Audio src={staticFile("sfx/key-type.wav")} />
      </Sequence>
    </PaperStage>
  );
};
