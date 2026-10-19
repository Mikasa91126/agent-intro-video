/**
 * DrawPath —— 墨线绘制（stroke-dashoffset 从头画到尾，端点带小圆点）。
 * 用法：放进任意 <svg> 内（组件返回的是 SVG 子元素）。
 */
import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { COLORS, EASE } from "../theme";

export const DrawPath = ({
  d,
  start = 0,
  dur = 72,
  stroke = COLORS.ink,
  width = 3,
  opacity = 0.9,
  endDot = true,
}: {
  d: string;
  start?: number;
  dur?: number;
  stroke?: string;
  width?: number;
  opacity?: number;
  endDot?: boolean;
}) => {
  const frame = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  const p = EASE.draw(Math.min(1, Math.max(0, (frame - start) / dur)));
  const offset = len * (1 - p);
  const tip = p > 0.001 ? getPointAtLength(d, len * p) : null;

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={offset}
      />
      {endDot && tip && p < 1 ? (
        <circle cx={tip.x} cy={tip.y} r={width * 1.4} fill={stroke} opacity={opacity} />
      ) : null}
    </>
  );
};
