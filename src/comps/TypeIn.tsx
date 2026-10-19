/**
 * TypeIn —— 等宽逐字敲入 + 光标（CLI / 输入框演示用）。
 */
import type { CSSProperties } from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export const TypeIn = ({
  text,
  start,
  cps = 14,
  caret = true,
  caretHold = 40,
  style,
}: {
  text: string;
  start: number;
  /** 每秒字符数 */
  cps?: number;
  caret?: boolean;
  /** 打完后光标保留的帧数 */
  caretHold?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - start);
  const n = Math.min(text.length, Math.floor((elapsed * cps) / 60));
  const typedDone = start + (text.length * 60) / cps;
  const showCaret =
    caret && frame >= start - 20 && frame <= typedDone + caretHold;
  const blink = Math.floor(frame / 24) % 2 === 0;

  return (
    <span style={{ ...style, whiteSpace: "pre" }}>
      {text.slice(0, n)}
      {showCaret ? (
        <span style={{ opacity: blink ? 1 : 0, color: COLORS.clay }}>▍</span>
      ) : null}
    </span>
  );
};
