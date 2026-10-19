import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp01 } from "./lib/anim";
import { PaperStage } from "./comps/PaperStage";
import { TYPE } from "./comps/type";
import { Card, Chip, MiniWindow, TaskCard, TermLine } from "./comps/ui";
import { Cursor } from "./comps/Cursor";
import { NodeNet } from "./comps/NodeNet";
import { TypeIn } from "./comps/TypeIn";
import { DrawPath } from "./comps/wire";
import { COLORS, EASE } from "./theme";

/**
 * KitLab —— 零件库视觉验收台（非成片内容）。
 * 一次性检视：舞台/网格、节点网络+数据包、纸卡、终端窗口、任务卡、光标、逐字敲入、墨线。
 */
export const KitLab = ({ dur = 600 }: { dur?: number }) => {
  const frame = useCurrentFrame();
  return (
    <PaperStage dur={dur} tone="medium" grid>
      <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
        KIT LAB · 零件验收 · F{String(frame).padStart(4, "0")}
      </div>

      {/* 节点网络 + 数据包 */}
      <NodeNet
        nodes={[
          { x: 430, y: 420, r: 16, accent: true },
          { x: 700, y: 300, r: 12 },
          { x: 720, y: 560, r: 12 },
          { x: 950, y: 430, r: 14, accent: true },
        ]}
        edges={[
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3],
        ]}
        start={20}
        packetCount={7}
        packetDur={120}
      />

      {/* 纸卡 + 终端窗口 */}
      <Card
        style={{ position: "absolute", left: 1120, top: 210, width: 640 }}
        padding={26}
      >
        <MiniWindow title="zsh — claude" variant="dark" height={300}>
          <TermLine muted>claude "fix the failing tests"</TermLine>
          <TermLine>
            <TypeIn text="Read src/agent.ts" start={90} cps={11} caret={false} />
          </TermLine>
          <TermLine success>✓ 3 files changed · tests pass</TermLine>
        </MiniWindow>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <Chip>Read / Write / Bash</Chip>
          <Chip style={{ color: COLORS.clay, borderColor: COLORS.clay }}>
            5 surfaces
          </Chip>
        </div>
      </Card>

      {/* 任务卡 */}
      <div
        style={{
          position: "absolute",
          left: 140,
          bottom: 220,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: 520,
        }}
      >
        <TaskCard done>改动文件 ×3</TaskCard>
        <TaskCard done>测试全部通过</TaskCard>
        <TaskCard>等待你审查 diff</TaskCard>
      </div>

      {/* 墨线绘制 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <DrawPath
          d="M 660 870 C 900 870, 1050 780, 1240 700"
          start={30}
          dur={80}
          width={3.5}
        />
      </svg>

      {/* 光标：走到任务卡并点击 */}
      <Cursor
        path={[
          { x: 1560, y: 860, f: 0 },
          { x: 700, y: 830, f: 120 },
          { x: 700, y: 830, f: 140 },
        ]}
        clicks={[140]}
        appearAt={10}
      />

      {/* 陶土下划线 */}
      <div
        style={{
          position: "absolute",
          left: 140,
          bottom: 130,
          width: interpolate(frame, [60, 110], [0, 460], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: EASE.outExpo,
          }),
          height: 4,
          backgroundColor: COLORS.clay,
        }}
      />

      {/* 品牌 Logo 条（真件验收） */}
      <div
        style={{
          position: "absolute",
          right: 140,
          bottom: 118,
          display: "flex",
          gap: 30,
          alignItems: "center",
          opacity: clamp01((frame - 60) / 30),
        }}
      >
        {["claude", "openai", "google", "deepseek", "doubao", "kimi", "manus"].map(
          (n) => (
            <Img
              key={n}
              src={staticFile(`logos/${n}.svg`)}
              style={{ width: 52, height: 52, objectFit: "contain" }}
            />
          ),
        )}
      </div>
    </PaperStage>
  );
};
