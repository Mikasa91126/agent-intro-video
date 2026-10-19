# 《AI Agent 巡礼》· 设计规范（DESIGN SPEC）

> 定稿：2026-10-17 ｜ 基于七维调研 + 对抗性核查（15 agent，全部上屏事实含来源）
> 规格：**180s · 1920×1080 · 60fps · 中文主文案＋英文点缀 · 外采配乐（Moon Walk · Mixkit License）**
> 定位：多品牌 AI Agent 大众科普 + 轻使用指导 · 概念偏科普评论（商标归各自所有，片尾标注）

---

## 0. 一句话与决策

**LLM 会聊天，Agent 会做事——三分钟看懂主流 AI Agent：它们是什么、能替你做什么、怎么用得又快又稳。**
EN: LLMs chat, agents work. What today's AI agents are, what they do for you, and how to run them safely.

已拍板（用户）：180s｜Moon Walk 配乐｜用官方 Logo（科普评论用途+片尾注明商标归属）｜风格 = Claude 暖白 × 光网节点 × 办公亮色。

四幕边界（帧）：科普 0–4500（0:00–1:15）｜品牌巡礼 4500–8100（1:15–2:15）｜用途 8100–9300（2:15–2:35）｜使用指导 9300–10320（2:35–2:52）｜收尾 10320–10800（2:52–3:00）。
**Moon Walk 的 75s 大推进 = 第 4500 帧 = S8 品牌巡礼开场**（结构与音乐天然咬合）。

## 1. 分镜表（19 镜，合计 10800 帧 = 180.000s）

> 每镜 copyCN/copyEN 为定稿文案（不改字）；SFX 文件名对应 `public/sfx/`。

### S01 开场钩子（600f · 0:00–0:10）
- 画面：黑场 0.3s → 暖白纸面两行字词级垂直裁剪浮现（stagger 0.03s）；陶土圆点光标点击「干活」二字 → 弹出三个迷你窗口（代码 / 表格 / 网页），被光标依次拖拽排成一列；全程 1.6% 缓推；末段下划线上扫。
- CN：AI 不只会聊天了。它会替你干活。｜EN: AI doesn't just talk anymore. It gets things done.
- 转场：字符垂直裁剪浮现（出镜 8 帧淡出）｜SFX：paper-drop（0.3s）+ enter-click（点击帧）

### S02 会聊天 vs 会做事（600f · 0:10–0:20）
- 画面：上下分屏：上半聊天窗气泡滚动（纯文字）；下半同一句提示词驱动三步流程——「文件夹 → 代码行 → 网页结果」，墨线绘制连起，陶土数据包沿连线跑；中缝一条墨色分界线（从中间展开）。
- CN：聊天机器人给你答案；Agent 给你结果。｜EN: Chatbots give answers. Agents deliver results.
- 转场：墨迹扩散（径向 mask）｜SFX：key-type + success-chime（下半完成时）

### S03 大脑 + 手脚 + 循环（720f · 0:20–0:32）
- 画面：MCP 式剪纸插画：陶土圆（大脑）+ 白色方手（工具，两枚）+ 环形箭头组成三角；「想一步 → 做一步 → 看结果」三节点依次点亮（各配 ui-ping）；数据包沿环线循环；节点标签出现后停 1.2s 呼吸。
- CN：Agent = 大脑（大模型）+ 手脚（工具）+ 循环。想一步，做一步，看结果。｜EN: Agent = brain (LLM) + hands (tools) + a loop. Think, act, observe.
- 转场：纸张翻转（卡片背面 #E8E6DC）｜SFX：ui-ping ×3

### S04 简史时间线（600f · 0:32–0:42）
- 画面：墨线绘制水平时间线（1.2s easeInOutCubic）；三刻度依次点亮：#D97757 圆点 + 日期与数字——2023-03 AutoGPT（8.2 万 GitHub 星）、2024-03 Devin（SWE-bench 13.86%）、2024-10 computer use（OSWorld 14.9%）；线尾延伸出画面留悬念；底部小注「数字为发布时口径」。
- CN：2023，AutoGPT 出圈；2024，Devin 自封首位 AI 工程师；同年，AI 学会用电脑。｜EN: 2023: AutoGPT goes viral. 2024: agents learn to use computers.
- 转场：横向 wipe（纸面推拉）｜SFX：tick ×3（对齐刻度）

### S05 MCP 标准（600f · 0:42–0:52）
- 画面：左列 5 个工具小块（文件 / 数据库 / 浏览器 / 日历 / 代码），右列 3 个 agent 圆点（其一为星形 Claude）；先呈现「无标准」的混乱贝塞尔线团（0.8s）；随后画面中心落下一枚陶土「接口」（USB-C 形），所有连线以 outExpo 重新经由接口汇聚成干净扇形；接口上标 `MCP`，小字「开源标准 · 由 Anthropic 提出（2024-11）」。
- CN：MCP：给 AI 装一个统一接口——像 USB-C，一次接通所有工具。｜EN: MCP: one port for every tool—the USB-C of AI.
- 转场：settle（缩放 1.03→1 淡入）｜SFX：whoosh（重连瞬间）+ ui-ping

### S06 一个 Agent 是一支团队（720f · 0:52–1:04）
- 画面：单代理圆点分裂为 4 个子代理圆点（stagger 0.12s），各带任务卡沿四条并行泳道推进（进度环逐个闭合），最终汇聚为一张大卡片（盖章「完成」）。
- CN：现在：一个 Agent 背后，是一支团队——多代理并行，各自闭环。｜EN: Today, one agent is a team: subagents working in parallel.
- 转场：墨迹扩散｜SFX：whoosh ×4（分裂）+ success-chime（汇总）

### S07 多代理幕后（660f · 1:04–1:15）
- 画面：NodeNet 全景：中心主代理节点 + 环向 4 个子代理（研究 / 编码 / 检索 / 校验）；连线双向数据包；子代理逐个回报 ✓（绿勾小卡）；最后交叉验证（两条线互指 + 小放大镜图元）→ 汇总节点发出完成脉冲。角落小注「Anthropic 内部评测：多代理研究系统较单代理提升 90.2%（token 约 15 倍）」。
- CN：幕后：主代理拆任务，子代理并行开工——研究、编码、检索各跑各的，最后交叉验证、汇总成一份结果。｜EN: Under the hood: a lead agent splits the job; subagents run in parallel, then cross-check and merge.
- 转场：节点网格亮起 → 下一镜品牌色渐变起手｜SFX：ui-ping ×4 + confirm-click（汇总）

### S08 品牌 · Claude（720f · 1:15–1:27）【品牌色时刻：clay】
- 画面：纸面中央墨线绘制 Claude 星芒标志（角点出现）；右侧终端窗口（dark）TypeIn 敲入 `claude "fix the failing tests"` → 三行 TermLine（Read/Write/Bash 各一，最后一行成功绿）→ 底部五端行：终端 · IDE · 桌面 · 浏览器 · 手机（五个 chip 依次点亮）；角落官方 logo（≤80px，墨色/原色）。
- CN：Claude：最强公开模型 + 最完整的 Agent 工作台。Claude Code 读代码、改文件、跑命令——五端在手。｜EN: Claude: top model, full agent toolkit. Claude Code reads, edits and runs—across five surfaces.
- 转场：品牌色时刻（clay 亮起）｜SFX：key-type + success-chime

### S09 品牌 · OpenAI（720f · 1:27–1:39）【黑白双色卡】
- 画面：黑白双色卡纸张翻转出现；三列入口卡依次滑入：ChatGPT Work（文档图标 + 一行 docx/xlsx/pptx 标签）、Codex（终端图元）、Dots（云电脑小窗 + 角标「Pro / Business Premium」；小字「敏感操作须人工批准」）；上方数字看板 count-up：12 亿（周活）。
- CN：OpenAI：12 亿人每周在用。Work 交付文档表格，Codex 写代码，Dots 自带云电脑替你跑腿。｜EN: OpenAI: 1.2B weekly users. Work for docs, Codex for code, Dots with its own cloud computer.
- 转场：黑白卡纸张翻转｜SFX：page-flip + coin-chime（数字落定）

### S10 品牌 · DeepSeek（720f · 1:39–1:51）【品牌色时刻：天空蓝 #6A9BCC】
- 画面：左侧分叉节点图标（开源）；中部权重方块阵列逐格点亮拼出「552B」；右侧价格看板 count-up（$0.15 / $0.60，每百万 token · 错峰价）；底部终端行 TypeIn：`npx @deepseek-ai/dsh web`（DSH = DeepSeek Harness，MIT 开源）；角落官方鲸鱼 logo（≤80px）。
- CN：DeepSeek：把 Agent 做成开源基础设施。552B 大模型、1M 上下文、权重 MIT——错峰价每百万 token 只要 $0.15。｜EN: DeepSeek: open-source agent infrastructure. 552B MoE, 1M context, MIT weights, $0.15 per million tokens off-peak.
- 转场：节点网格亮起 → 品牌色渐变（clay→天空蓝）｜SFX：key-type + coin-chime

### S11 品牌 · Google（720f · 1:51–2:03）【品牌色时刻：矿石绿 #629987】
- 画面：左右并排：Antigravity 双栏窗口（编辑器 + 浏览器，墨线绘制框体）与 Jules 流程卡（GitHub → 云 VM → PR 三节点墨线相连，数据包单向流过）；左下旧 Mariner 图标淡化置灰 + 角标「已下线 2026-05-04」；角落官方 G logo（≤80px）。
- CN：Google：Antigravity 写代码，Jules 在云端接活——提需求，等一个 PR。｜EN: Google: Antigravity codes; Jules works async in the cloud and returns a PR.
- 转场：品牌色渐变 + 墨线流程绘制｜SFX：whoosh（VM 启动）+ ui-ping（PR 完成）

### S12 品牌 · 国内代表（720f · 2:03–2:15）【强调色回落 clay】
- 画面：三联卡（stagger 0.12s）：豆包（数字 count-up 180 万亿/日 + 「与飞书深度打通」小字）、Kimi（300 枚迷你子代理圆点同时脉冲一次，标「K3 · 最多 300 子代理」）、Manus（地图节点与手机图标连一条墨线，小字「2.0 · 携手 OPPO，Find X10 首发」）；三卡下方统一小注「以各品牌官方口径为准」。
- CN：国内同样热闹：豆包日均调用 180 万亿 token；Kimi K3 最多 300 个子代理；Manus 恢复独立，携手 OPPO。｜EN: In China: Doubao at 180 trillion tokens a day, Kimi K3 runs 300 sub-agents, Manus is back solo—and on OPPO phones.
- 转场：纸面推拉（三卡依次入）｜SFX：ui-ping ×3

### S13 用途一 · 编程（420f · 2:15–2:22）
- 画面：左「一句需求」卡片，右 IDE 复刻窗口；光标角色化操作：TypeIn 输入需求 → 运行 → 测试通过绿勾 → diff 高亮行滑入；右侧 TaskCard 列「改动文件 ×3 / 测试通过」。
- CN：用途一：写代码。描述需求，Agent 动手改文件——你只审查结果。｜EN: Use case 1: coding. Describe it; the agent edits files; you review the diff.
- 转场：任务卡滑入｜SFX：key-type + enter-click + success-chime

### S14 用途二 · 研究（420f · 2:22–2:29）
- 画面：浏览器多标签叠成扇面（stagger 0.12s），每张卡出现「已读 ✓」；扇面收拢成一份报告卡，引用角标逐条亮；角落小字「ChatGPT Work / Gemini / 联网检索（示例）」。
- CN：用途二：做研究。几十个来源，一杯咖啡的时间，回来一份带引用的报告。｜EN: Use case 2: research. Dozens of sources, one coffee break, a sourced report.
- 转场：扇开 → 收拢｜SFX：page-flip ×3 + confirm-click（盖章）

### S15 用途三 · 办公自动化（360f · 2:29–2:35）
- 画面：三窗口复刻：表格（数字自动填充、单元格依次点亮）→ PPT（封面自排版）→ 网页预览；角落定时旋钮特写 + 标签「每周五 17:00 自动生成周报」。
- CN：用途三：办公自动化。表格、PPT、周报、数据看板——定时替你交付。｜EN: Use case 3: office automation. Sheets, decks, reports, dashboards—delivered on schedule.
- 转场：墨迹扩散｜SFX：key-type + timer-bell

### S16 指导一 · 怎么提需求（360f · 2:35–2:41）
- 画面：输入框特写：一句模糊需求被删除线划掉，重写为三段式（目标 / 验收标准 / 权限边界）并以陶土高亮块标记；下方 rubric 检查清单逐行打勾（三声 tick）。
- CN：怎么提需求：目标 + 验收标准 + 权限边界。说得越具体，干得越靠谱。｜EN: How to ask: goal + acceptance criteria + permission bounds. Specific in, reliable out.
- 转场：纸张翻转｜SFX：key-type + tick ×3

### S17 指导二 · 安全习惯（360f · 2:41–2:47）
- 画面：审批弹窗复刻：多个「允许？」弹窗快速闪过（模糊、渐快），一个危险操作弹窗（删除 / 转账图标）被一只人手按下「拒绝」定格；角落数据条 count-up：「权限弹窗同意率约 93%→97%」「1,053 人受控实验中，人只拦下 13.6% 危险命令」，标注小字「据 Anthropic 数据（2026-08 报道）」。
- CN：安全习惯：审批弹窗别连点——点得越多，漏得越多。删除、发送、付款、发布，先确认再执行。｜EN: Stay safe: don't blind-click approvals. Delete, send, pay, publish—confirm first.
- 转场：快速闪切（0.1s/切）→ 定格｜SFX：click 连击（渐快）+ low-hit（定格）+ confirm-click

### S18 指导三 · 入门路径（300f · 2:47–2:52）
- 画面：三张路径小卡滑动推进（stagger 0.12s）：① 上传一份文件 ② 要一份表格 ③ 先预览、别改原文件；终点亮起陶土对勾。
- CN：今天就能试：上传一份文件，要一份表格——先预览，别改原文件。｜EN: Try it today: upload a file, ask for a table—preview first, never overwrite.
- 转场：任务卡滑入（三连）｜SFX：tick ×3 + success-chime

### S19 收尾 · 方向盘（480f · 2:52–3:00）
- 画面：回到开场纸面：所有品牌卡收拢为一颗陶土圆点，落在一枚确认键上——人的手指按下（点击涟漪）；相机 1.6% 缓推至落版：圆点 + 金句 + 片尾署名行；末 1.2s 静止定格。
- CN：Agent 替你跑腿，方向盘还在你手里。｜EN: Agents do the running. You keep the wheel.
- 片尾小字（静止）：本片为概念科普，商标归各自品牌所有 · Sources: 官方文档 / 公开报道（详见项目 SOURCES）· 2026
- 转场：全元素收拢（0.9s outExpo）｜SFX：confirm-click（最后一拍）

## 2. 视觉系统

### 2.1 色板（anthropic.com / claude.com 生产 CSS 实取 + 核查）
| Hex | 名称 | 用途 |
|---|---|---|
| #FAF9F5 | ivory light | 最亮层（纸面受光、卡片亮面） |
| #F0EEE6 | ivory medium | 全局主底 |
| #E8E6DC | ivory dark | 分区 / 卡背 / 翻转背面 |
| #141413 | slate ink | 主文字、终端底 |
| #3D3D3A | 灰墨 | 次级文字 |
| #D97757 | clay | 全片唯一默认强调色 |
| #C6613F | clay dark | 关键数字落地闪色 |
| #6A9BCC | 天空蓝 | DeepSeek 镜主色时刻 |
| #629987 | 矿石绿 | Google 镜主色时刻 |

规则：任一帧最多「纸底 + 墨 + 一强调」；品牌镜切换强调色做 12 帧渐变；终端内绿仅限终端 UI（#7FA06A）。

### 2.2 排版
衬线（Source Serif 4 / 思源宋体）= 标题金句品牌名（500–600）；黑体（思源黑体）= 正文/字幕；等宽（Fragment Mono）= 数字/代码/标签（tabular）。字号：主标 96–120 / 金句 66–72 / 正文 40–44 / 小字 32 / 数字看板 168–220。

### 2.3 材质
纸感颗粒 5.5%；左上暖光径向；24px 点阵网格（概念/网络镜）；发丝描边 0.5–1px；圆角 4/8/16；阴影轻而散（0 18px 44px rgba(31,30,29,0.07)）。

## 3. 动效语言（12 条）
①双曲线（入 outExpo 0.6–0.9s / 出 easeInCubic 0.3–0.4s，交叠 0.1–0.2s）②字符垂直裁剪（0.5s，stagger 0.02–0.03s，中文按词）③单镜 camera creep（0.5–1%，无静止帧）④纸张翻转（rotateY 85°→0，0.7s，背面 #E8E6DC）⑤墨迹扩散（径向 mask 1.1×，0.8s）⑥节点数据包粒子（4–6px，单程 1.5–2.5s，≤12 粒）⑦任务卡滑入（y32→0 + rot3→0，0.55s，stagger 0.12s）⑧数字 count-up（1.2s，tabular，落定闪强调色 100ms）⑨光标角色化（缓动走位、点击前停 300ms、涟漪 240ms）⑩墨线绘制（1.2s easeInOutCubic，端点圆点）⑪品牌色时刻（12 帧渐变）⑫音乐同步（品牌五镜切点=75/87/99/111/123s 恰在曲目段内；卡片落点尽量贴 4/4 拍）。

## 4. 音频
- **曲目**：Moon Walk（Eugenio Mininni，Mixkit Stock Music Free License，可商用免署名）。剪辑版 `public/audio/film-music.wav`：0–180s + 176.5–180s 淡出。
- **结构映射（实测）**：0–75s 安静引入（科普幕）→ **75s drop = 品牌巡礼开场** → 120–135s 峰值（Google/国内段）→ 160–170s 自然 breakdown（恰在指导段）→ 165s+ outro 衰减（收尾幕）。
- **SFX**：11 枚程序合成（`public/sfx/`，见分镜表）；指导段整体少音效。

## 5. 事实政策（摘要——完整白名单见调研简报，上屏仅取以下）

**safeNumbers（节选）**：ChatGPT 周活超 12 亿（2026-09 DevDay 官方）｜Claude 模型价：Fable 5.1 $10/$50、Opus 5.5 $4/$20（官方快照）｜DeepSeek V4.1-Flash：552B MoE、1M 上下文、TB2.1 90.6（官方口径）、错峰价 $0.15/$0.60（官方定价页）｜DSH GitHub 251k stars、MIT 开源｜豆包 180 万亿 token/日（火山引擎官方）；Kimi K3 最多 300 子代理（官方）｜Manus 2.0 × OPPO Find X10 首发（OPPO 官宣）｜Jules 免费 15 任务/天、Pro $19.99/月；Mariner 已下线 2026-05-04（官方）｜权限弹窗同意率 93%→97%、1,053 人实验人仅拦 13.6%（据 Anthropic 数据 2026-08 报道）｜多代理提升 90.2%（Anthropic 内部评测须标注）｜AutoGPT 8.2 万星 / Devin 13.86% / computer use 14.9%（发布时口径须标注）。

**avoid（摘要）**：各品牌未复核的 ARR/估值；「Opus 5.5 与 Fable 同级」等错误表述；已下线产品（Operator、ChatGPT agent 模式、Atlas、Mariner）不得作现役出现；MCP 旧统计（1 万+ 服务器）不得写成现役；「Chat|Cowork 切换器」已退场不得展示；境外产品统一措辞「以你所在地区可用性为准」。

## 6. 工程与流程
- 工程 `B:\agent-intro-video`；KIT API 见 `src/docs/KIT.md`；场景只改 `src/scenes/SXX.tsx`
- 配乐/音效/Logo 素材来源记录：`assets/music/SOURCES.md`、`public/sfx/SOURCES.md`、`assets-src/logos/SOURCES.md`
- 渲染：`npx remotion render Film out/Agent-Atlas-180s.mp4`；单镜检查用 SceneLab（见 KIT）

## 7. 决策记录
- 时长 180s（用户授权我定；简报原案 120s 扩表方案执行，新增 S5 MCP / S7 多代理幕后）
- 配乐 Moon Walk（用户拍板；98BPM 恰在预设区间，75s drop 对齐品牌幕）
- 官方 Logo 以「科普评论用途」入镜（用户拍板）+ 片尾商标归属声明
- 品牌色轮换规则：clay 默认 → OpenAI 黑白 → DeepSeek 天空蓝 → Google 矿石绿 → 国内回落 clay
