import { Easing } from "remotion";

/**
 * 视觉系统 ——《AI Agent 巡礼》180s
 * 色板取自 anthropic.com / claude.com 生产 CSS 实取（经对抗性核查）：
 * ivory 三级 + slate 墨色 + clay 陶土；品牌镜按轮换色规则过渡。
 */
export const COLORS = {
  /* 暖白三级（全局纸感基底） */
  paperWhite: "#FAF9F5", // ivory light：最亮层
  paper: "#F0EEE6", // ivory medium：主底
  paperDeep: "#E8E6DC", // ivory dark：分区 / 卡背
  /* 墨色文字 */
  ink: "#141413", // slate dark：主文字 / 终端底
  graphite: "#3D3D3A", // 次级文字
  grey: "#5E5D59", // 注释 / 来源小字
  /* 强调（全片唯一默认强调色） */
  clay: "#D97757",
  clayDark: "#C6613F", // 关键数字落地闪色
  /* 规线 */
  line: "rgba(20,20,19,0.16)",
  lineSoft: "rgba(20,20,19,0.08)",
  /* 终端内点缀（仅 UI 复刻用，非品牌强调） */
  termGreen: "#7FA06A",
  termText: "#E8E6DC",

  /* 暖色别名（兼容复用零件库旧键） */
  abyss: "#141413",
  deep: "#2A2927",
  brand: "#D97757",
  bright: "#D97757",
  ice: "#D4A27F",
  mist: "#C9C4B8",
  ivory: "#FAF9F5",
  white: "#FFFFFF",
} as const;

/** 品牌轮换色（品牌镜的「主色时刻」；任一间最多「纸底 + 墨 + 一强调」） */
export const BRAND_COLORS = {
  /** 全片默认强调色（也是 Claude 镜主色） */
  clay: "#D97757",
  /** OpenAI：黑白双色卡 */
  openai: "#141413",
  /** DeepSeek：天空蓝 */
  deepseek: "#6A9BCC",
  /** Google：矿石绿 */
  google: "#629987",
  /** 国内代表：回落陶土 */
  cn: "#D97757",
} as const;

export const FONTS = {
  /** 拉丁衬线（标题 / 金句 / 英文点缀） */
  serifLatin: "'Source Serif 4', Georgia, 'Times New Roman', serif",
  /** 中文衬线（标题 / 品牌名 / 金句） */
  serifCN: "'Noto Serif SC', 'Source Han Serif SC', 'SimSun', serif",
  /** 中文黑体（正文 / 字幕） */
  sansCN: "'Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif",
  /** 拉丁无衬线（界面数据） */
  body: "'DM Sans', 'Noto Sans SC', sans-serif",
  slogan: "'Montserrat', 'Noto Sans SC', sans-serif",
  /** 等宽（数字 / 代码 / 终端 / 标签） */
  mono: "'Fragment Mono', 'JetBrains Mono', monospace",
} as const;

/** 动效语言参数（DESIGN.md → motionLanguage 的 12 条） */
export const EASE = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1), // 入场主曲线 0.6–0.9s
  exit: Easing.bezier(0.55, 0, 1, 0.45), // 出场 easeInCubic 近似
  charReveal: Easing.bezier(0.22, 1, 0.36, 1), // 字符垂直裁剪
  ink: Easing.bezier(0.65, 0, 0.35, 1), // 墨迹扩散 / 纸张翻转
  draw: Easing.bezier(0.65, 0, 0.35, 1), // 墨线绘制
} as const;

export const FPS = 60;
export const DURATION_IN_FRAMES = 10800; // 180s

/**
 * 19 镜时长（帧），总和 = 10800（180.000s）
 * 四幕边界：科普 0:00–1:15 ｜ 品牌 1:15–2:15 ｜ 用途 2:15–2:35 ｜ 指导 2:35–2:52 ｜ 收尾 2:52–3:00
 * （音乐 Moon Walk 的 75s 大推进 = 第 4500 帧 = 品牌巡礼开场，天然咬合）
 */
export const SCENE_DURATIONS = [
  600, 600, 720, 600, 600, 720, 660, // S1–S7 科普
  720, 720, 720, 720, 720, // S8–S12 品牌巡礼
  420, 420, 360, // S13–S15 用途
  360, 360, 300, // S16–S18 使用指导
  480, // S19 收尾
] as const;

export const SCENE_TITLES = [
  "开场钩子",
  "会聊天 vs 会做事",
  "大脑+手脚+循环",
  "简史时间线",
  "MCP 标准",
  "一个 Agent 是一支团队",
  "多代理幕后",
  "品牌 · Claude",
  "品牌 · OpenAI",
  "品牌 · DeepSeek",
  "品牌 · Google",
  "品牌 · 国内代表",
  "用途一 · 编程",
  "用途二 · 研究",
  "用途三 · 办公自动化",
  "指导一 · 怎么提需求",
  "指导二 · 安全习惯",
  "指导三 · 入门路径",
  "收尾 · 方向盘",
] as const;

/** 第 id 镜（1 起）的起始帧 */
export const sceneStart = (id: number): number =>
  SCENE_DURATIONS.slice(0, id - 1).reduce((a, b) => a + b, 0);
