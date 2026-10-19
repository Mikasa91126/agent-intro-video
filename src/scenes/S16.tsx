/**
 * S16 · 指导一 · 怎么提需求（2:35–2:41 · 360f）
 * 输入框里一句模糊需求被删除线划掉 → 重写为三段式（目标 / 验收标准 / 权限边界，陶土高亮块）
 * → 下方 rubric 检查清单逐行打勾。
 */
import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { COLORS, EASE, FONTS } from "../theme";
import { prog } from "../lib/anim";

const VAGUE = "帮我优化一下这个项目";

const REWRITE: { tag: string; text: string; en: string }[] = [
  { tag: "目标", text: "把首页首屏加载压到 1 秒内", en: "GOAL" },
  { tag: "验收标准", text: "Lighthouse 性能 ≥ 90，现有测试全绿", en: "ACCEPTANCE" },
  { tag: "权限边界", text: "只改 src/ 下的文件，不加新依赖", en: "PERMISSIONS" },
];

const RUBRIC = ["目标可验证：有数字或明确产物", "验收标准写清：怎么算通过", "权限边界写明：能改什么、不能碰什么"];

const slide = (frame: number, start: number, dur = 34): CSSProperties => {
  const p = EASE.outExpo(prog(frame, start, dur));
  return { opacity: Math.min(1, p * 1.9), transform: `translateY(${(1 - p) * 30}px)` };
};

export const S16 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(prog(frame, 0, 10), 1 - prog(frame, dur - 18, 18));
  /** 转场：纸张翻转（rotateY 85°→0，0.7s） */
  const flip = EASE.ink(prog(frame, 0, 42));

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <AbsoluteFill style={{ opacity: fade, perspective: 2400 }}>
       <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "0% 50%",
          transform: `rotateY(${((1 - flip) * -85).toFixed(1)}deg)`,
        }}
       >
        {/* 章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          指导一 · 怎么提需求 ｜ HOW TO ASK
        </div>

        {/* ---------------- 输入框：模糊需求 ---------------- */}
        <div style={{ position: "absolute", left: 140, top: 174, width: 1640, ...slide(frame, 16, 38) }}>
          <div
            style={{
              height: 116,
              backgroundColor: COLORS.paperWhite,
              border: `1px solid ${COLORS.line}`,
              borderRadius: 14,
              boxShadow: "0 18px 44px rgba(31,30,29,0.07)",
              padding: "0 30px",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <span style={{ fontFamily: FONTS.mono, fontSize: 30, color: COLORS.clay }}>❯</span>
            <StruckText frame={frame} />
            <span style={{ marginLeft: "auto", fontFamily: FONTS.mono, fontSize: 20, letterSpacing: "0.12em", color: COLORS.grey }}>
              模糊需求 / VAGUE
            </span>
          </div>
        </div>

        {/* ---------------- 三段式重写 ---------------- */}
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 316,
            fontFamily: FONTS.mono,
            fontSize: 21,
            letterSpacing: "0.14em",
            color: COLORS.grey,
            opacity: prog(frame, 138, 14),
          }}
        >
          重写 · 三段式 / REWRITE
        </div>
        <div style={{ position: "absolute", left: 140, top: 352, width: 1640, display: "flex", flexDirection: "column", gap: 16 }}>
          {REWRITE.map((row, i) => (
            <RewriteRow key={row.tag} row={row} start={150 + i * 16} frame={frame} />
          ))}
        </div>

        {/* ---------------- rubric 检查清单 ---------------- */}
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 652,
            fontFamily: FONTS.mono,
            fontSize: 21,
            letterSpacing: "0.14em",
            color: COLORS.grey,
            opacity: prog(frame, 236, 14),
          }}
        >
          提交前自检 / RUBRIC
        </div>
        <div style={{ position: "absolute", left: 140, top: 692, width: 1640, display: "flex", flexDirection: "column", gap: 6 }}>
          {RUBRIC.map((r, i) => (
            <CheckRow key={r} text={r} start={244 + i * 14} frame={frame} />
          ))}
        </div>

        {/* ---------------- 主文案 ---------------- */}
        <div style={{ position: "absolute", left: 140, bottom: 96, maxWidth: 1560 }}>
          <div style={{ ...TYPE.body, fontSize: 40 }}>
            怎么提需求：目标 + 验收标准 + 权限边界。说得越具体，干得越靠谱。
          </div>
          <div style={{ ...TYPE.en, fontStyle: "italic", fontSize: 32, color: COLORS.grey, marginTop: 10 }}>
            How to ask: goal + acceptance criteria + permission bounds. Specific in, reliable out.
          </div>
        </div>
       </div>
      </AbsoluteFill>

      <Sequence from={58} durationInFrames={70}>
        <Audio src={staticFile("sfx/key-type.wav")} />
      </Sequence>
      {[244, 258, 272].map((f) => (
        <Sequence key={f} from={f} durationInFrames={40}>
          <Audio src={staticFile("sfx/ui-ping.wav")} />
        </Sequence>
      ))}
    </PaperStage>
  );
};

/* ------------------------------------------------------ 模糊需求 + 删除线 */

const StruckText = ({ frame }: { frame: number }) => {
  const show = prog(frame, 60, 10);
  const strike = EASE.draw(prog(frame, 118, 26));
  const dim = 1 - prog(frame, 136, 20) * 0.68;
  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      <span style={{ ...TYPE.body, fontSize: 38, color: COLORS.ink, opacity: show * dim }}>
        {VAGUE.slice(0, Math.ceil(show * VAGUE.length))}
      </span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          height: 2.5,
          width: `${strike * 100}%`,
          backgroundColor: COLORS.ink,
          opacity: show * 0.8,
        }}
      />
    </span>
  );
};

/* ---------------------------------------------------------------- 三段式行 */

const RewriteRow = ({
  row,
  start,
  frame,
}: {
  row: { tag: string; text: string; en: string };
  start: number;
  frame: number;
}) => {
  const p = EASE.outExpo(prog(frame, start, 36));
  const wipe = EASE.draw(prog(frame, start + 8, 26));
  return (
    <div
      style={{
        height: 80,
        borderRadius: 12,
        border: `1px solid rgba(217,119,87,0.34)`,
        backgroundColor: `rgba(217,119,87,0.09)`,
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 30px",
        opacity: Math.min(1, p * 1.9),
        transform: `translateY(${(1 - p) * 26}px)`,
      }}
    >
      {/* 陶土高亮块（自左向右擦亮） */}
      <span
        style={{
          width: 190,
          height: 52,
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* 陶土高亮块：自左向右擦亮，文字随底色一起浮现 */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 9,
            backgroundColor: COLORS.clay,
            clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONTS.serifCN,
            fontSize: 29,
            letterSpacing: "0.12em",
            color: COLORS.paperWhite,
            opacity: Math.min(1, Math.max(0, (wipe - 0.45) / 0.35)),
          }}
        >
          {row.tag}
        </span>
      </span>
      <span style={{ ...TYPE.body, fontSize: 36, color: COLORS.ink }}>{row.text}</span>
      <span
        style={{
          marginLeft: "auto",
          fontFamily: FONTS.mono,
          fontSize: 19,
          letterSpacing: "0.14em",
          color: COLORS.clay,
          opacity: 0.8,
        }}
      >
        {row.en}
      </span>
    </div>
  );
};

/* ---------------------------------------------------------------- 检查清单 */

const CheckRow = ({ text, start, frame }: { text: string; start: number; frame: number }) => {
  const p = EASE.outExpo(prog(frame, start, 26));
  const tick = EASE.outExpo(prog(frame, start + 6, 18));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        height: 38,
        opacity: Math.min(1, p * 1.9),
        transform: `translateX(${(1 - p) * -18}px)`,
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          border: `1.5px solid ${tick > 0.2 ? COLORS.clay : COLORS.line}`,
          backgroundColor: tick > 0.2 ? COLORS.clay : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ opacity: tick }}>
          <path d="M4 12.5 L9.4 18 L20 7" fill="none" stroke={COLORS.paperWhite} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span style={{ ...TYPE.sub, fontSize: 28, color: COLORS.graphite }}>{text}</span>
    </div>
  );
};
