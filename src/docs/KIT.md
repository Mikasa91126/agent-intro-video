# KIT ——《AI Agent 巡礼》零件库 API（场景制作必读）

> 全片规范见根目录 `DESIGN.md`（分镜/色板/动效参数/上屏事实）。
> **制作场景时只允许改自己的 `src/scenes/SXX.tsx`**，不得改零件库 / theme / Root / index / Film。

## 0. 场景组件规范

```tsx
import { AbsoluteFill } from "remotion";
import { PaperStage } from "../comps/PaperStage";

/** S08 · 品牌 · Claude（1:15–1:27 · 720f） */
export const S08 = ({ dur }: { dur: number }) => (
  <PaperStage dur={dur} tone="medium" grid={grid}>
    {/* 画面层 */}
  </PaperStage>
);
```

- 帧号：`useCurrentFrame()` 在本镜内从 0 起。
- 确定性铁律：禁 `Math.random()` / `Date.now()`；随机用 `mulberry32(seed)`（`src/lib/anim.ts`）。
- 入场：easeOutExpo 0.6–0.9s（用 `EASE.outExpo` + `prog()`）；出场 easeInCubic 0.3–0.4s（`EASE.exit`）；元素允许 0.1–0.2s 交叠，不排队。
- 每镜结尾做退场（淡出 / 收拢 / 位移）；除收尾镜外不要「硬停」。
- **色彩纪律：任一帧最多「纸底 + 墨 + 一强调」**。强调色默认为陶土 clay；品牌镜按 DESIGN 的轮换色规则用 `interpolateColors(frame, [0, 12], [COLORS.clay, BRAND_COLORS.deepseek])` 之类做 0.2s 渐变。
- 文案严格用 DESIGN.md 分镜原文（不改字）；上屏数字只允许来自 §事实白名单。

## 1. 舞台与排版

```tsx
<PaperStage dur={dur} tone="light|medium|deep" grid={false} glow creep="push|drift|none">
```
- `tone`：light #FAF9F5 ｜ medium #F0EEE6（默认主底）｜ deep #E8E6DC
- `grid`：24px 点阵（概念/网络主题镜开）；`creep`：push=缓推 1.8%、drift=横移（换镜重置方向）

```tsx
import { TYPE } from "../comps/type";
<TYPE 预设：h1(拉丁大标 108) h1cn(中文衬线 92) h2cn(64) quote(金句 66) body(正文 42)
 sub(小字 32) en(英文点缀 36) enItalic(40 陶土斜体) label(等宽标签 24) num(数字看板 168) term(终端 30)>
```

## 2. UI 复刻组件 `src/comps/ui.tsx`

```tsx
<Card tone="light|medium|deep" padding radius>                 // 纸卡：发丝边+轻阴影
<MiniWindow title="zsh — claude" variant="light|dark" width height>  // 迷你窗口（dark=终端）
<TermLine muted success prompt="❯">claude "fix the bug"</TermLine>   // 终端行（success=绿）
<TaskCard done>改动文件 ×3</TaskCard>                          // 任务卡（✓=陶土）
<Chip>Read / Write / Bash</Chip>                              // 等宽小标签
```

## 3. 角色化光标 `src/comps/Cursor.tsx`

```tsx
<Cursor
  path={[{ x: 400, y: 500, f: 0 }, { x: 900, y: 620, f: 60 }, { x: 900, y: 620, f: 78 }]}  // 停顿 18 帧再点击
  clicks={[78]}
  appearAt={10}
/>
```
- 走位自动 easeInOutSine；点击前停顿用同一坐标的两个 waypoint 表达；涟漪 14 帧。
- 演示里「操作」对象的反馈（高亮/出现）应与 clicks 帧对齐（点击后 2–4 帧出现）。

## 4. 光网节点 `src/comps/NodeNet.tsx`

```tsx
<NodeNet
  nodes={[{ x: 500, y: 400, r: 14, accent: true }, ...]}
  edges={[[0, 1], [1, 2], ...]}
  start={20} drawDur={44} stagger={6}
  packetCount={8} packetDur={130} packetColor={COLORS.clay}
/>
```
- 连线逐条绘制、节点错落出现、数据包粒子沿边循环（带弧度）；同屏 ≤12 粒。

## 5. 其余

```tsx
import { TypeIn } from "../comps/TypeIn";
<TypeIn text="npx @deepseek-ai/dsh web" start={60} cps={12} style={{ ...TYPE.term }} />

import { DrawPath } from "../comps/wire";
<svg width={1920} height={1080}><DrawPath d="M 200 700 L 900 700" start={30} dur={72} width={3.5} /></svg>

import { Counter } from "../comps/Counter";   // 等宽数字滚动（1.2s）
<Counter from={0} to={12} start={90} dur={72} format={(v) => v.toFixed(1)} suffix=" 亿" />

// 动画小工具：prog(帧,起点,时长)→0..1、EASE.outExpo/exit/ink/draw、clamp01、mulberry32、stagger
import { prog, clamp01, mulberry32, stagger } from "../lib/anim";
```

## 6. 音效（SFX）

- 音频在 `public/sfx/*.wav`（**已就位 11 个占位**，合成任务随后覆盖同名文件，文件名不变）：
  `paper-drop / page-flip / key-type / enter-click / ui-ping / success-chime / coin-chime / timer-bell / low-hit / confirm-click / whoosh`
- 场景内引用方式（帧相对本镜起点）：

```tsx
import { Audio, staticFile } from "remotion";
<Audio src={staticFile("sfx/ui-ping.wav")} />
```
- 需要延迟或多次播放：放在 `<Sequence from={f} durationInFrames={N}><Audio .../></Sequence>` 里。
- 别滥用：一镜 1–2 个 SFX 为宜；「指导段」少音效（音乐做 drop-out 留白）。

## 7. 渲染自检（做完必须看静帧！）

```bash
cd B:/agent-intro-video
npx remotion still SceneLab out/lab/S08-f120.png --frame=120 --props='{"scene":8}'
```
渲染后用 Read 工具**亲眼看图**（构图/排版/色彩纪律/有没有出框或重叠），不满意就改，至少迭代 2 轮；每镜检查 0.2s / 25% / 55% / 90% 四处。

## 8. 版面网格（全片一致）

- 页边距 140px；主文案块可左下（x140, 底 y≈960）或居中，但**同一幕内保持一致**
- 左上角标签行（`TYPE.label`）放章节名 / 品牌名，x=140, y=96
- 品牌 Logo ≤80px，放角落（右上也行），官方原色或墨色单色
