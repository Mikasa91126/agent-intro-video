/**
 * UI 复刻组件：纸卡 / 迷你窗口 / 终端行 / 任务卡 / 标签。
 * 品牌镜与用途镜的界面演示统一用这套（不截屏、全部重绘）。
 */
import type { CSSProperties, ReactNode } from "react";
import { COLORS, FONTS } from "../theme";
import { TYPE } from "./type";

/* ---------------------------------------------------------------- Card */

export const Card = ({
  children,
  style,
  tone = "medium",
  padding = 28,
  radius = 16,
}: {
  children: ReactNode;
  style?: CSSProperties;
  tone?: "light" | "medium" | "deep";
  padding?: number | string;
  radius?: number;
}) => (
  <div
    style={{
      backgroundColor:
        tone === "light" ? COLORS.paperWhite : tone === "deep" ? COLORS.paperDeep : COLORS.paper,
      border: `1px solid ${COLORS.line}`,
      borderRadius: radius,
      padding,
      boxShadow: "0 18px 44px rgba(31,30,29,0.07)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ----------------------------------------------------------- MiniWindow */

/** 迷你应用窗口（light = 纸面应用；dark = 终端） */
export const MiniWindow = ({
  title,
  variant = "light",
  width,
  height,
  style,
  bodyStyle,
  children,
}: {
  title?: string;
  variant?: "light" | "dark";
  width?: number;
  height?: number;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  children: ReactNode;
}) => {
  const dark = variant === "dark";
  const dotColor = dark ? "rgba(232,230,220,0.28)" : "rgba(20,20,19,0.22)";
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: dark ? COLORS.ink : COLORS.paperWhite,
        border: `1px solid ${dark ? "rgba(232,230,220,0.16)" : COLORS.line}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: dark
          ? "0 22px 60px rgba(20,20,19,0.35)"
          : "0 18px 44px rgba(31,30,29,0.08)",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: `1px solid ${dark ? "rgba(232,230,220,0.1)" : COLORS.lineSoft}`,
          flexShrink: 0,
        }}
      >
        <span style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: dotColor }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: dotColor }} />
        <span style={{ width: 11, height: 11, borderRadius: 99, backgroundColor: dotColor }} />
        {title ? (
          <span
            style={{
              marginLeft: 12,
              fontFamily: FONTS.mono,
              fontSize: 20,
              letterSpacing: "0.06em",
              color: dark ? "rgba(232,230,220,0.6)" : COLORS.grey,
            }}
          >
            {title}
          </span>
        ) : null}
      </div>
      <div style={{ flex: 1, padding: "18px 22px", overflow: "hidden", ...bodyStyle }}>
        {children}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- TermLine */

export const TermLine = ({
  children,
  muted = false,
  success = false,
  prompt = "❯",
}: {
  children: ReactNode;
  muted?: boolean;
  success?: boolean;
  prompt?: string;
}) => (
  <div
    style={{
      ...TYPE.term,
      fontSize: 28,
      opacity: muted ? 0.45 : 1,
      color: success ? COLORS.termGreen : COLORS.termText,
      whiteSpace: "pre",
    }}
  >
    <span style={{ color: COLORS.clay, opacity: 0.9 }}>{prompt} </span>
    {children}
  </div>
);

/* ------------------------------------------------------------- TaskCard */

export const TaskCard = ({
  children,
  done = false,
  style,
}: {
  children: ReactNode;
  done?: boolean;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      backgroundColor: COLORS.paper,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 10,
      padding: "16px 22px",
      boxShadow: "0 10px 26px rgba(31,30,29,0.06)",
      ...style,
    }}
  >
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: 7,
        border: `1.5px solid ${done ? COLORS.clay : COLORS.line}`,
        backgroundColor: done ? COLORS.clay : "transparent",
        color: COLORS.paperWhite,
        fontSize: 18,
        lineHeight: "24px",
        textAlign: "center",
        fontFamily: FONTS.body,
      }}
    >
      {done ? "✓" : ""}
    </span>
    <span style={{ ...TYPE.body, fontSize: 28, lineHeight: 1.4 }}>{children}</span>
  </div>
);

/* ----------------------------------------------------------------- Chip */

export const Chip = ({
  children,
  style,
  color = COLORS.graphite,
}: {
  children: ReactNode;
  style?: CSSProperties;
  color?: string;
}) => (
  <span
    style={{
      display: "inline-block",
      fontFamily: FONTS.mono,
      fontSize: 21,
      letterSpacing: "0.1em",
      color,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 8,
      padding: "8px 16px",
      backgroundColor: "rgba(250,249,245,0.7)",
      ...style,
    }}
  >
    {children}
  </span>
);
