/**
 * 排版阶梯（1920×1080）—— 层级分工：
 * 衬线 = 标题/金句/品牌名；黑体 = 正文/字幕；等宽 = 数字/代码/标签。
 */
import type { CSSProperties } from "react";
import { COLORS, FONTS } from "../theme";

export const TYPE = {
  /** 拉丁大标（钩子 / 落版） */
  h1: {
    fontFamily: FONTS.serifLatin,
    fontWeight: 500,
    fontSize: 108,
    lineHeight: 1.08,
    letterSpacing: "-0.015em",
    color: COLORS.ink,
  } as CSSProperties,
  /** 中文衬线主标 */
  h1cn: {
    fontFamily: FONTS.serifCN,
    fontWeight: 500,
    fontSize: 92,
    lineHeight: 1.22,
    letterSpacing: "0.02em",
    color: COLORS.ink,
  } as CSSProperties,
  /** 中文衬线副标 */
  h2cn: {
    fontFamily: FONTS.serifCN,
    fontWeight: 500,
    fontSize: 64,
    lineHeight: 1.3,
    letterSpacing: "0.03em",
    color: COLORS.ink,
  } as CSSProperties,
  /** 金句（中英混排常用） */
  quote: {
    fontFamily: FONTS.serifCN,
    fontWeight: 400,
    fontSize: 66,
    lineHeight: 1.45,
    letterSpacing: "0.04em",
    color: COLORS.ink,
  } as CSSProperties,
  /** 中文正文 */
  body: {
    fontFamily: FONTS.sansCN,
    fontWeight: 400,
    fontSize: 42,
    lineHeight: 1.7,
    letterSpacing: "0.01em",
    color: COLORS.ink,
  } as CSSProperties,
  /** 小字说明 */
  sub: {
    fontFamily: FONTS.sansCN,
    fontWeight: 400,
    fontSize: 32,
    lineHeight: 1.6,
    color: COLORS.graphite,
  } as CSSProperties,
  /** 英文点缀（衬线斜体点睛） */
  en: {
    fontFamily: FONTS.serifLatin,
    fontWeight: 400,
    fontSize: 36,
    lineHeight: 1.4,
    color: COLORS.graphite,
  } as CSSProperties,
  /** 英文金句（斜体） */
  enItalic: {
    fontFamily: FONTS.serifLatin,
    fontWeight: 400,
    fontStyle: "italic",
    fontSize: 40,
    lineHeight: 1.4,
    color: COLORS.clay,
  } as CSSProperties,
  /** 标签 / 注（等宽） */
  label: {
    fontFamily: FONTS.mono,
    fontSize: 24,
    letterSpacing: "0.18em",
    color: COLORS.graphite,
    textTransform: "uppercase",
  } as CSSProperties,
  /** 数字看板（等宽 tabular） */
  num: {
    fontFamily: FONTS.mono,
    fontSize: 168,
    lineHeight: 1,
    color: COLORS.clayDark,
    fontVariantNumeric: "tabular-nums",
  } as CSSProperties,
  /** 终端行（等宽） */
  term: {
    fontFamily: FONTS.mono,
    fontSize: 30,
    lineHeight: 1.75,
    color: COLORS.termText,
  } as CSSProperties,
} as const;
