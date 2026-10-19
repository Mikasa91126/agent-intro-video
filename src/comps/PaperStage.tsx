/**
 * PaperStage —— 亮场舞台：暖白纸底 / 左上暖光 / 可选点阵网格 / 纸感颗粒 /
 * 单镜 camera creep（无静止帧，换镜重置方向）。
 */
import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Grain } from "./fx";

export const PaperStage = ({
  dur,
  tone = "medium",
  grid = false,
  glow = true,
  grain = true,
  creep = "push",
  children,
}: {
  dur: number;
  /** light = #FAF9F5 ｜ medium = #F0EEE6 ｜ deep = #E8E6DC */
  tone?: "light" | "medium" | "deep";
  /** 24px 点阵网格（仅概念 / 网络主题镜建议开启） */
  grid?: boolean;
  /** 左上暖光渐变 */
  glow?: boolean;
  grain?: boolean;
  /** push = 缓推 1.6% ｜ drift = 横向漂移 ｜ none */
  creep?: "push" | "drift" | "none";
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const scale =
    creep === "none"
      ? 1
      : interpolate(frame, [0, dur], [1.002, creep === "push" ? 1.018 : 1.01]);
  const driftX = creep === "drift" ? interpolate(frame, [0, dur], [-8, 8]) : 0;
  const bg =
    tone === "light" ? COLORS.paperWhite : tone === "deep" ? COLORS.paperDeep : COLORS.paper;

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      {glow ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 62% 52% at 16% 6%, ${COLORS.paperWhite} 0%, rgba(250,249,245,0) 60%)`,
          }}
        />
      ) : null}
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(circle, rgba(20,20,19,0.055) 1.1px, transparent 1.1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{ transform: `scale(${scale}) translateX(${driftX}px)` }}
      >
        {children}
      </AbsoluteFill>
      {grain ? <Grain opacity={0.055} /> : null}
    </AbsoluteFill>
  );
};
