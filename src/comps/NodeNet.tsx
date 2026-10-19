/**
 * NodeNet —— 光网节点：节点 + 连线（可逐条绘制）+ 数据包粒子（沿连线循环、带弧度）。
 * 概念镜 / MCP / 多代理镜的图形语言核心。全部确定性。
 */
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { EASE } from "../theme";

export type NetNode = { x: number; y: number; r: number; accent?: boolean };

export const NodeNet = ({
  nodes,
  edges,
  start = 0,
  drawDur = 44,
  stagger = 6,
  packetCount = 8,
  packetColor = COLORS.clay,
  packetDur = 130,
  packetSize = 5,
  strokeColor = COLORS.ink,
  strokeOpacity = 0.2,
  strokeWidth = 1.6,
  packetOffset = 0,
}: {
  nodes: NetNode[];
  /** 边 = 节点索引对 */
  edges: Array<[number, number]>;
  /** 帧参数（镜内 0 基） */
  start?: number;
  drawDur?: number;
  stagger?: number;
  packetCount?: number;
  packetColor?: string;
  packetDur?: number;
  packetSize?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  /** 数据包相位偏移（负值可让包裹在 start 前就已在途） */
  packetOffset?: number;
}) => {
  const frame = useCurrentFrame();

  const edgeProgress = (i: number) =>
    EASE.outExpo(
      Math.min(1, Math.max(0, (frame - start - i * stagger) / drawDur)),
    );

  const nodeProgress = (i: number) =>
    EASE.outExpo(
      Math.min(1, Math.max(0, (frame - start - 10 - i * stagger) / drawDur)),
    );

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0 }}
    >
      {edges.map(([a, b], i) => {
        const A = nodes[a];
        const B = nodes[b];
        const p = edgeProgress(i);
        return (
          <line
            key={`e${i}`}
            x1={A.x}
            y1={A.y}
            x2={A.x + (B.x - A.x) * p}
            y2={A.y + (B.y - A.y) * p}
            stroke={strokeColor}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      })}
      {nodes.map((n, i) => {
        const p = nodeProgress(i);
        if (p <= 0) return null;
        return (
          <circle
            key={`n${i}`}
            cx={n.x}
            cy={n.y}
            r={n.r * (0.6 + 0.4 * p)}
            fill={n.accent ? packetColor : strokeColor}
            fillOpacity={n.accent ? 0.92 : 0.78}
            stroke={COLORS.paperWhite}
            strokeWidth={1.4}
          />
        );
      })}
      {edges.length > 0
        ? Array.from({ length: packetCount }, (_, i) => {
            const e = edges[i % edges.length];
            const A = nodes[e[0]];
            const B = nodes[e[1]];
            const speed = packetDur * (1 + (i % 3) * 0.18);
            const raw = (frame - start - packetOffset + i * 23) / speed;
            if (raw < 0) return null;
            const t = raw % 1;
            // 直线 + 轻微弧度
            const mx = (A.x + B.x) / 2;
            const my = (A.y + B.y) / 2;
            const dx = B.x - A.x;
            const dy = B.y - A.y;
            const len = Math.hypot(dx, dy) || 1;
            const dir = i % 2 === 0 ? 1 : -1;
            const bow = 0.06 * len * dir;
            const nx = -dy / len;
            const ny = dx / len;
            // 二次贝塞尔（中点抬升）
            const px = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * (mx + nx * bow) + t * t * B.x;
            const py = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * (my + ny * bow) + t * t * B.y;
            const fade = Math.min(1, Math.min(t, 1 - t) * 6);
            return (
              <circle
                key={`p${i}`}
                cx={px}
                cy={py}
                r={packetSize}
                fill={packetColor}
                opacity={0.85 * fade}
              />
            );
          })
        : null}
    </svg>
  );
};
