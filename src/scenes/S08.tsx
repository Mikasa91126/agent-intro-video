/**
 * S08 · 品牌 · Claude（1:15–1:27 · 720f）【品牌色时刻：clay】
 * 纸面中央墨线绘制星芒（角点出现）+ 右侧终端（TypeIn → Read/Write/Bash，末行成功绿）
 * + 底部五端 chips 依次点亮 + 角落官方 logo（≤80px）。
 * 转场：品牌色时刻（clay 亮起）；SFX：key-type + success-chime。
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
import { Card, Chip, MiniWindow, TermLine } from "../comps/ui";
import { TypeIn } from "../comps/TypeIn";
import { DrawPath } from "../comps/wire";
import { TYPE } from "../comps/type";
import { BRAND_COLORS, COLORS } from "../theme";
import { clamp01, outExpo, prog } from "../lib/anim";

/** 定稿文案（§1 S08，不改字；换行仅按句读断行） */
const CN_L1 = "Claude：最强公开模型 + 最完整的 Agent 工作台。";
const CN_L2 = "Claude Code 读代码、改文件、跑命令——五端在手。";
const EN =
  "Claude: top model, full agent toolkit. Claude Code reads, edits and runs—across five surfaces.";

/* 星芒：8 角（外 R / 内 r 交替），单条闭合路径供墨线绘制 */
const TIPS = 8;
const STAR_R = 158;
const STAR_R2 = 66;
const STAR_BOX = 420;
const STAR_PATH = `M ${Array.from({ length: TIPS * 2 }, (_, i) => {
  const a = (i * Math.PI) / TIPS - Math.PI / 2;
  const r = i % 2 === 0 ? STAR_R : STAR_R2;
  return `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
}).join(" L ")} Z`;
const starTips = Array.from({ length: TIPS }, (_, i) => {
  const a = (i * Math.PI) / TIPS - Math.PI / 2;
  return { x: Math.cos(a) * STAR_R, y: Math.sin(a) * STAR_R };
});

/** 终端三行工具调用（Read / Write / Bash，末行成功绿） */
const TOOL_LINES: Array<{ f: number; text: string; success?: boolean }> = [
  { f: 200, text: "Read   src/agent.ts" },
  { f: 228, text: "Write  src/agent.ts" },
  { f: 256, text: "Bash   npm test — tests pass ✓", success: true },
];

const SURFACES = ["终端", "IDE", "桌面", "浏览器", "手机"];

export const S08 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  /* 品牌色时刻：clay → clay（本镜即全片默认强调色），镜尾回落 */
  const accent =
    frame <= dur - 14
      ? interpolateColors(frame, [0, 12], [COLORS.clay, BRAND_COLORS.clay])
      : interpolateColors(frame, [dur - 14, dur], [BRAND_COLORS.clay, COLORS.clay]);

  /* 退场：末 16 帧淡出 + 轻微收拢 */
  const exit = prog(frame, dur - 16, 16);
  const exitE = outExpo(exit);

  /* 星芒底色淡入 */
  const starFill = outExpo(prog(frame, 86, 40));

  /* 终端卡片入场 */
  const cardE = outExpo(prog(frame, 20, 44));
  /* 命令敲入完成后的“思考 → 工具行”；末行绿落定脉冲 */
  const landPulse = 1 + 0.03 * Math.sin(Math.PI * clamp01((frame - 258) / 26));

  /* 五端 chips：依次点亮 */
  const chipAt = (i: number) => 300 + i * 14;

  /* 字幕双曲线入场 */
  const capA = prog(frame, 150, 13);
  const capP = outExpo(prog(frame, 150, 38));
  const capEnA = prog(frame, 196, 13);
  const capEnP = outExpo(prog(frame, 196, 38));

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 1 - exit,
          transform: `translateY(${-exitE * 18}px) scale(${1 - 0.004 * exitE})`,
        }}
      >
        {/* 右上官方 logo（≤80px） */}
        <Img
          src={staticFile("logos/claude.svg")}
          style={{ position: "absolute", left: 1708, top: 104, width: 72 }}
        />

        {/* 左上章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          品牌巡礼 01 · CLAUDE
        </div>

        {/* 中央墨线星芒 */}
        <div
          style={{
            position: "absolute",
            left: 630 - STAR_BOX / 2,
            top: 430 - STAR_BOX / 2,
            width: STAR_BOX,
            height: STAR_BOX,
            transform: `rotate(${(frame * 0.012).toFixed(3)}deg)`,
          }}
        >
          <svg width={STAR_BOX} height={STAR_BOX}>
            <g transform={`translate(${STAR_BOX / 2} ${STAR_BOX / 2})`}>
              <path d={STAR_PATH} fill={accent} fillOpacity={0.05 * starFill} stroke="none" />
              <DrawPath d={STAR_PATH} start={8} dur={78} width={3.4} stroke={COLORS.ink} opacity={0.9} />
              {starTips.map((t, i) => {
                const p = clamp01((frame - (92 + i * 3)) / 16);
                if (p <= 0) return null;
                return (
                  <circle
                    key={i}
                    cx={t.x}
                    cy={t.y}
                    r={4.8 * outExpo(p)}
                    fill={accent}
                    opacity={0.92 * p}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* 右侧终端窗口 */}
        <Card
          tone="light"
          padding={26}
          style={{
            position: "absolute",
            left: 900,
            top: 186,
            width: 880,
            opacity: cardE,
            transform: `translateY(${(1 - cardE) * 30}px)`,
          }}
        >
          <MiniWindow title="zsh — claude" variant="dark" height={300}>
            <TermLine>
              <TypeIn text={'claude "fix the failing tests"'} start={40} cps={15} caretHold={26} />
            </TermLine>
            {TOOL_LINES.map((l) => {
              const p = prog(frame, l.f, 16);
              const y = (1 - outExpo(p)) * 10;
              return (
                <div key={l.text} style={{ opacity: p, transform: `translateX(${y}px) scale(${l.success ? landPulse : 1})`, transformOrigin: "left center" }}>
                  <TermLine success={l.success}>{l.text}</TermLine>
                </div>
              );
            })}
          </MiniWindow>

          {/* 五端 chips（依次点亮） */}
          <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
            {SURFACES.map((s, i) => {
              const p = clamp01((frame - chipAt(i)) / 16);
              const e = outExpo(p);
              const dot = interpolateColors(p, [0, 1], [COLORS.line, accent]);
              return (
                <Chip
                  key={s}
                  style={{
                    color: interpolateColors(p, [0, 1], [COLORS.graphite, accent]),
                    borderColor: interpolateColors(p, [0, 1], [COLORS.line, accent]),
                    opacity: 0.4 + 0.6 * e,
                    transform: `translateY(${(1 - e) * 12}px)`,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: dot,
                      marginRight: 10,
                      verticalAlign: "middle",
                    }}
                  />
                  {s}
                </Chip>
              );
            })}
          </div>
        </Card>

        {/* 主文案（左下） */}
        <div style={{ position: "absolute", left: 140, bottom: 100, width: 1640 }}>
          <div
            style={{
              ...TYPE.body,
              fontSize: 40,
              lineHeight: 1.6,
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
              marginTop: 14,
              opacity: capEnA * 0.9,
              transform: `translateY(${(1 - capEnP) * 20}px)`,
            }}
          >
            {EN}
          </div>
        </div>
      </div>

      {/* SFX */}
      <Sequence from={40}>
        <Audio src={staticFile("sfx/key-type.wav")} />
      </Sequence>
      <Sequence from={254}>
        <Audio src={staticFile("sfx/success-chime.wav")} />
      </Sequence>
    </PaperStage>
  );
};
