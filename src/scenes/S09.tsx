/**
 * S09 · 品牌 · OpenAI（1:27–1:39 · 720f）【黑白双色卡】
 * 纸张翻转入场（背面 #E8E6DC 语汇）→ 墨色数字看板 count-up「12 亿 / 周活」
 * → 三列入口卡依次滑入：ChatGPT Work（文档图元 + docx/xlsx/pptx）/
 *   Codex（终端图元）/ Dots（云电脑小窗 + 角标 Pro / Business Premium + 敏感操作须人工批准）。
 * 转场：黑白卡纸张翻转；SFX：page-flip + coin-chime。
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
import { Card, Chip, MiniWindow, TermLine } from "../comps/ui";
import { TypeIn } from "../comps/TypeIn";
import { Counter } from "../comps/Counter";
import { TYPE } from "../comps/type";
import { BRAND_COLORS, COLORS, EASE } from "../theme";
import { clamp01, outExpo, prog } from "../lib/anim";

/** 定稿文案（§1 S09，不改字；换行仅按句读断行） */
const CN_L1 = "OpenAI：12 亿人每周在用。";
const CN_L2 = "Work 交付文档表格，Codex 写代码，Dots 自带云电脑替你跑腿。";
const EN =
  "OpenAI: 1.2B weekly users. Work for docs, Codex for code, Dots with its own cloud computer.";

const NAME: CSSProperties = {
  fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
  fontWeight: 500,
  fontSize: 34,
  letterSpacing: "0.01em",
  color: COLORS.ink,
};

/** 文档图元（ChatGPT Work）—— 墨色随品牌色时刻 */
const DocGlyph = ({ color }: { color: string }) => (
  <svg width={100} height={124} viewBox="0 0 100 124">
    <path
      d="M14 5 H64 L86 27 V119 H14 Z"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path d="M64 5 V27 H86" fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
    <path
      d="M30 58 H70 M30 76 H70 M30 94 H54"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
    />
  </svg>
);

/** 云电脑小窗内容（Dots） */
const CloudDesktop = () => (
  <div style={{ display: "flex", gap: 10, height: "100%" }}>
    <div style={{ width: 54, borderRadius: 6, backgroundColor: COLORS.paperDeep }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ height: 20, borderRadius: 5, backgroundColor: COLORS.paperDeep }} />
      <div style={{ display: "flex", gap: 9, flex: 1 }}>
        <div style={{ flex: 1, borderRadius: 5, backgroundColor: "rgba(20,20,19,0.07)" }} />
        <div style={{ flex: 1, borderRadius: 5, backgroundColor: "rgba(20,20,19,0.07)" }} />
      </div>
    </div>
  </div>
);

export const S09 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  /* 品牌色时刻：clay → 墨（黑白双色），镜尾回落 clay */
  const accent =
    frame <= dur - 14
      ? interpolateColors(frame, [0, 12], [COLORS.clay, BRAND_COLORS.openai])
      : interpolateColors(frame, [dur - 14, dur], [BRAND_COLORS.openai, COLORS.clay]);

  /* 纸张翻转入场：rotateY 85° → 0（0.7s） */
  const flipP = EASE.ink(clamp01(frame / 42));
  const rotY = 85 * (1 - flipP);

  /* 退场：末 16 帧淡出 */
  const exit = prog(frame, dur - 16, 16);
  const exitE = outExpo(exit);

  /* 数字看板入场 + 落定脉冲 */
  const boardA = prog(frame, 46, 14);
  const boardE = outExpo(prog(frame, 46, 40));
  const numLand = 90 + 84;
  const landPulse = 1 + 0.035 * Math.sin(Math.PI * clamp01((frame - numLand) / 26));

  /* 三列入口卡依次滑入（stagger 0.12s） */
  const cardAt = (i: number) => 96 + i * 7;
  const cardIn = (i: number) => outExpo(prog(frame, cardAt(i), 33));

  /* 卡内细节 */
  const codexChip = outExpo(prog(frame, 258, 28));
  const dotsBadge = outExpo(prog(frame, 276, 32));
  const workChips = (i: number) => outExpo(prog(frame, 250 + i * 8, 28));

  /* 字幕 */
  const capA = prog(frame, 300, 13);
  const capP = outExpo(prog(frame, 300, 38));
  const capEnA = prog(frame, 344, 13);
  const capEnP = outExpo(prog(frame, 344, 38));

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
          src={staticFile("logos/openai.svg")}
          style={{ position: "absolute", left: 1708, top: 104, width: 72 }}
        />

        {/* 纸张翻转（黑白双色卡） */}
        <div style={{ position: "absolute", inset: 0, perspective: 2200 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `rotateY(${rotY.toFixed(2)}deg) scale(${1 - 0.02 * (1 - flipP)})`,
              transformOrigin: "50% 50%",
            }}
          >
            {/* 左上章节标签 */}
            <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
              品牌巡礼 02 · OPENAI
            </div>

            {/* 墨色数字看板：12 亿 / 周活 */}
            <Card
              tone="light"
              padding="30px 40px"
              style={{
                position: "absolute",
                left: 140,
                top: 196,
                width: 1640,
                height: 200,
                backgroundColor: COLORS.ink,
                border: "1px solid rgba(232,230,220,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: boardA,
                transform: `translateY(${(1 - boardE) * 24}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <Counter
                  from={0}
                  to={12}
                  start={90}
                  dur={84}
                  format={(v) => String(Math.round(v))}
                  style={{
                    ...TYPE.num,
                    fontSize: 136,
                    lineHeight: 1,
                    color: COLORS.paperWhite,
                    transform: `scale(${landPulse})`,
                    transformOrigin: "left bottom",
                    display: "inline-block",
                  }}
                />
                <span style={{ ...TYPE.h2cn, fontSize: 62, color: COLORS.paperWhite }}>亿</span>
              </div>
              <div
                style={{
                  fontFamily: "'Fragment Mono', monospace",
                  fontSize: 24,
                  letterSpacing: "0.18em",
                  color: "rgba(232,230,220,0.62)",
                }}
              >
                周活 · WEEKLY USERS
              </div>
            </Card>

            {/* 三列入口卡 */}
            <Card
              tone="light"
              style={{
                position: "absolute",
                left: 140,
                top: 432,
                width: 500,
                height: 330,
                padding: 26,
                opacity: prog(frame, cardAt(0), 13),
                transform: `translateY(${(1 - cardIn(0)) * 32}px) rotate(${(1 - cardIn(0)) * 3}deg)`,
              }}
            >
              <div
                style={{
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DocGlyph color={accent} />
              </div>
              <div style={{ ...NAME, marginTop: 14 }}>ChatGPT Work</div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                {["docx", "xlsx", "pptx"].map((t, i) => (
                  <Chip
                    key={t}
                    style={{
                      fontSize: 18,
                      padding: "7px 13px",
                      opacity: workChips(i),
                      transform: `translateY(${(1 - workChips(i)) * 10}px)`,
                    }}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </Card>

            <Card
              tone="light"
              style={{
                position: "absolute",
                left: 710,
                top: 432,
                width: 500,
                height: 330,
                padding: 26,
                opacity: prog(frame, cardAt(1), 13),
                transform: `translateY(${(1 - cardIn(1)) * 32}px) rotate(${(1 - cardIn(1)) * 3}deg)`,
              }}
            >
              <div style={{ height: 140, display: "flex", alignItems: "center" }}>
                <MiniWindow title="codex" variant="dark" width={448} height={130}>
                  <TermLine>
                    <TypeIn text={'codex "refactor auth"'} start={266} cps={15} caretHold={30} />
                  </TermLine>
                </MiniWindow>
              </div>
              <div style={{ ...NAME, marginTop: 14 }}>Codex</div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <Chip
                  style={{
                    fontSize: 18,
                    padding: "7px 13px",
                    opacity: codexChip,
                    transform: `translateY(${(1 - codexChip) * 10}px)`,
                  }}
                >
                  CLI · 终端
                </Chip>
              </div>
            </Card>

            <Card
              tone="light"
              style={{
                position: "absolute",
                left: 1280,
                top: 432,
                width: 500,
                height: 330,
                padding: 26,
                opacity: prog(frame, cardAt(2), 13),
                transform: `translateY(${(1 - cardIn(2)) * 32}px) rotate(${(1 - cardIn(2)) * 3}deg)`,
              }}
            >
              <div style={{ height: 140, display: "flex", alignItems: "center" }}>
                <MiniWindow
                  title="cloud · dots"
                  width={448}
                  height={130}
                  bodyStyle={{ padding: "12px 16px" }}
                >
                  <CloudDesktop />
                </MiniWindow>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
                <span style={{ ...NAME }}>Dots</span>
                <Chip
                  style={{
                    fontSize: 17,
                    padding: "7px 13px",
                    backgroundColor: accent,
                    borderColor: accent,
                    color: COLORS.paperWhite,
                    opacity: dotsBadge,
                    transform: `scale(${0.94 + 0.06 * dotsBadge})`,
                  }}
                >
                  Pro / Business Premium
                </Chip>
              </div>
              <div style={{ ...TYPE.sub, fontSize: 24, marginTop: 20, opacity: 0.75 * dotsBadge }}>
                敏感操作须人工批准
              </div>
            </Card>
          </div>
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
            {EN}
          </div>
        </div>
      </div>

      {/* SFX */}
      <Sequence from={2}>
        <Audio src={staticFile("sfx/page-flip.wav")} />
      </Sequence>
      <Sequence from={numLand}>
        <Audio src={staticFile("sfx/coin-chime.wav")} />
      </Sequence>
    </PaperStage>
  );
};
