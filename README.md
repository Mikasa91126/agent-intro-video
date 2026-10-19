# 《AI Agent 巡礼》· 180s 多品牌 AI Agent 科普片（Remotion 工程）

> 180s · 1920×1080 · 60fps · 中文主文案 + 英文点缀 · 配乐外采（Moon Walk · Mixkit License 可商用免署名）
> 定位：概念科普（各品牌商标归其所有，片尾已注明）

## 快速开始

```bash
cd B:/agent-intro-video
npm run dev                          # 预览工作室（Film / SceneLab / KitLab）
npm run render                       # 渲染成片 → out/Agent-Atlas-180s.mp4
npx remotion still SceneLab out/lab/S08-f120.png --frame=120 --props='{"scene":8}'
```

## 结构

```
DESIGN.md            设计规范（四幕 19 镜分镜 / 视觉系统 / 动效 12 条 / 事实政策 / 决策记录）
src/theme.ts         色板（Anthropic 官网实取）+ 品牌轮换色 + 19 镜时长表（10800 帧 = 180.000s）
src/comps/           PaperStage 亮场舞台 / NodeNet 光网节点 / Cursor 角色光标 / ui 复刻组件 /
                     TypeIn 逐字敲入 / DrawPath 墨线 / type 排版阶梯 / Counter / Grain（复用）
src/lib/             动效工具（anim / fonts）
src/scenes/S01–S19   19 个镜头（每镜接收 dur，帧号镜内从 0 起）
src/Film.tsx         总装（音轨 audio/film-music.wav）
tools/               sheet.py 拼图验收 / make_sfx.py + check_sfx.py 音效合成与校验
assets-src/          官方素材源（各品牌 Logo SVG + SOURCES.md；DeepSeek 鲸鱼 SVG）
public/logos/        场景引用的品牌 Logo（真件）
public/sfx/          11 枚程序合成音效（SOURCES.md 说明无版权素材）
public/audio/        film-music.wav（180.0s 剪辑版）
assets/music/        外采曲目候选（candidate-1/2/3 + SOURCES.md + ANALYSIS.md）
```

## 素材来源与许可

- 配乐：**Moon Walk**（Eugenio Mininni）· Mixkit Stock Music Free License（可商用、免署名；不可单独再发行/注册版权）
- 音效：11 枚全部程序合成（无第三方素材），详见 `public/sfx/SOURCES.md`
- 品牌 Logo：取自官方站点 / lobe-icons / simple-icons，详见 `assets-src/logos/SOURCES.md`（商标归各自品牌所有）

## 事实纪律

上屏数字与表述全部来自 DESIGN.md §5 白名单（经七维调研 + 对抗性核查，含来源口径）；已下线产品（Operator / ChatGPT agent 模式 / Atlas / Mariner）只作历史语境；境外产品统一措辞「以你所在地区可用性为准」。
