/**
 * Cursor —— 角色化光标（Cowork 片手法）：
 * 沿 waypoint 缓动走位（easeInOutSine，不走直线）、点击前停顿由 waypoint 时刻控制、
 * 点击涟漪 240ms。全部确定性。
 */
import { useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type CursorWaypoint = { x: number; y: number; f: number };

const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;

export const Cursor = ({
  path,
  clicks = [],
  size = 34,
  appearAt = 0,
  vanishAt,
}: {
  /** waypoint 序列：f = 到达该点的帧号（在同一坐标系内） */
  path: CursorWaypoint[];
  /** 点击帧号列表（涟漪 14 帧） */
  clicks?: number[];
  size?: number;
  appearAt?: number;
  vanishAt?: number;
}) => {
  const frame = useCurrentFrame();
  if (frame < appearAt || (vanishAt !== undefined && frame > vanishAt) || path.length === 0) {
    return null;
  }

  // 位置：在 waypoint 段间做 easeInOutSine
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    if (frame <= a.f) break;
    const t = Math.min(1, (frame - a.f) / Math.max(1, b.f - a.f));
    if (frame < b.f) {
      const e = easeInOutSine(t);
      x = a.x + (b.x - a.x) * e;
      y = a.y + (b.y - a.y) * e;
      break;
    }
    x = b.x;
    y = b.y;
  }

  const arrowH = size * 0.66;

  return (
    <>
      {clicks.map((cf, i) => {
        const p = (frame - cf) / 14;
        if (p <= 0 || p >= 1) return null;
        const r = 14 + p * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `2px solid ${COLORS.clay}`,
              opacity: (1 - p) * 0.7,
              pointerEvents: "none",
            }}
          />
        );
      })}
      <svg
        width={size}
        height={size * 1.5}
        viewBox="0 0 14 21"
        style={{
          position: "absolute",
          left: x,
          top: y,
          filter: "drop-shadow(0 3px 6px rgba(20,20,19,0.35))",
          pointerEvents: "none",
        }}
      >
        <path
          d="M1 1 L1 16.2 L4.6 12.9 L7.4 19.4 L10.3 18.1 L7.5 11.7 L12.6 11.7 Z"
          fill={COLORS.ink}
          stroke={COLORS.paperWhite}
          strokeWidth={1.1}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
