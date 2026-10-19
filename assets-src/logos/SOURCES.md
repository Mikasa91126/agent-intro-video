# Logo 素材来源登记

采集日期：**2026-10-17**
用途：AI Agent 巡礼科普视频（评论/介绍性质使用，非商业授权素材）

> **商标声明**：下列标志的商标权与著作权归各自权利人所有（Anthropic、OpenAI、Google LLC、
> 北京火山引擎/字节跳动（豆包）、月之暗面 Moonshot AI（Kimi）、Manus AI、DeepSeek）。
> 本片为科普评论用途，仅作标识指代，不表示任何形式的合作、赞助或背书。
> 如需商用发行，请另行取得各品牌方的授权或遵循其品牌规范。

---

## 采集结果总览

| 文件名 | 品牌 | 格式 | 来源方式 | viewBox | 原色版 |
|---|---|---|---|---|---|
| `claude.svg` | Claude / Anthropic | SVG（原色） | lobe-icons（第三方官方图标库） | `0 0 24 24` | 是 `#D97757` |
| `openai.svg` | OpenAI | SVG（单色） | simple-icons | `0 0 24 24` | 品牌本身即单色（黑） |
| `google.svg` | Google | SVG（原色） | lobe-icons（第三方官方图标库） | `0 0 24 24` | 是（4 色 G） |
| `doubao.svg` | 豆包 / 字节跳动 | SVG（原色） | lobe-icons（第三方官方图标库） | `0 0 24 24` | 是（蓝/青/紫） |
| `kimi.svg` | Kimi / 月之暗面 | SVG（单色） | simple-icons | `0 0 24 24` | 否（可着色） |
| `manus.svg` | Manus | SVG（原色） | **品牌官网** manus.im | `0 0 32 32` | 是 `#34322D` |

全部 6 枚均为**矢量 SVG**，无 PNG 降级项。已通过 `xml.etree` 解析（合法 XML）
且均含 `viewBox`。

---

## 逐枚明细

### 1. `claude.svg` — Claude / Anthropic 星芒标

- 来源 URL：`https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons/claude-color.svg`
- 格式：**原色**（单色路径，填充 Claude 官方珊瑚橙 `#D97757`）
- viewBox：`0 0 24 24`；1 条 path
- 处理：迁移 `width/height="1em"` → `24`，移除内联 flex 样式，路径与配色原样保留。
- 备选（单色，simple-icons）：
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/claude.svg`
  （另有 `.../icons/anthropic.svg`，那是 Anthropic 的字母 A 标，非星芒，未采用）

### 2. `openai.svg` — OpenAI 花结标

- 来源 URL：`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg`
- 格式：**单色**（无 fill 属性，默认渲染为黑）——OpenAI 官方标识本身就是单色黑白，
  故此即官方原色处理方式。
- viewBox：`0 0 24 24`；1 条 path
- 处理：原样保存，未改动。
- 备注：需要染色时用 CSS `fill` 覆盖即可（`path { fill: #fff }`）。

### 3. `google.svg` — Google「G」

- 来源 URL：`https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons/google-color.svg`
- 格式：**原色**（官方 4 色：`#4285F4` 蓝 / `#34A853` 绿 / `#FBBC05` 黄 / `#EB4335` 红）
- viewBox：`0 0 24 24`；4 条 path
- 处理：迁移 `width/height="1em"` → `24`，移除内联 flex 样式。
- 备选（单色，simple-icons）：
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/google.svg`

### 4. `doubao.svg` — 豆包（字节跳动）

- 来源 URL：`https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons/doubao-color.svg`
- 格式：**原色**（`#1E37FC` 蓝 ×2 / `#37E1BE` 青 / `#A569FF` 紫）
- viewBox：`0 0 24 24`；4 条 path
- 处理：迁移 `width/height="1em"` → `24`，移除内联 flex 样式。
- 备注：simple-icons **没有** `doubao` 条目（slug 探测 404）。
  品牌官网 favicon 仅有位图且最大 192×192（低于 256 门槛），故未采用：
  `https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/favicon/new-doubao/192x192.png`
  （官网 HTML/CSS/JS 中亦未发现矢量 logo 资源）。本枚为可用的原色矢量替代。

### 5. `kimi.svg` — Kimi / 月之暗面 Moonshot AI

- 来源 URL：`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/kimi.svg`
- 格式：**单色**（无 fill 属性，默认黑）
- viewBox：`0 0 24 24`；1 条 path
- 处理：原样保存，未改动。
- 备注：Kimi 品牌蓝为 `#1783FF`，可用 CSS `fill: #1783FF` 直接还原。
  lobe-icons 的 `kimi-color.svg` 经检查为「浅色 K + 蓝色角标」的深底反白版
  （K 字填充为 `#fff`），在白底上会不可见，故**未采用**，改用本单色版。
  simple-icons 另有 `.../icons/moonshotai.svg`（Moonshot AI 的环形标），非 Kimi 标，未采用。

### 6. `manus.svg` — Manus

- 来源 URL：`https://manus.im/icon.svg?icon.2kbcs13ndm9it.svg`
  （品牌官网 `https://manus.im/` HTML 中 `<link rel="icon" ... type="image/svg+xml">` 直链）
- 格式：**原色**（官方深色 `#34322D`）
- viewBox：`0 0 32 32`；4 条 path
- 处理：**唯一一处内容改动** —— 原文件带一层不透明白色圆角底板
  `<rect width="32" height="32" rx="5.05263" fill="white"/>`（App 图标样式），
  为便于视频中透明叠加，已删除该 rect。**logo 几何路径与官方配色完全未动。**
  若需要还原官方「白底圆角 App 图标」外观，把该 rect 贴回 `<svg>` 开头即可。
  （该 rect 原文件逐字保留在下方备忘中，可直接复制）
- 备选（单色，lobe-icons）：`https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons/manus.svg`
- 备注：simple-icons **没有** `manus` 条目（slug 探测 404）。

原 rect 备忘：
```xml
<rect width="32" height="32" rx="5.05263" fill="white"/>
```

---

## 附注：DeepSeek 鲸鱼标（本工程既有素材，无需采集）

- 文件：`assets-src/deepseek-whale.svg`（本工程已有，**本次未采集、未改动**）
- 同目录另有 `assets-src/deepseek-logo-brandblue.svg`
- 来源：由项目方此前自行提供 / 采集，来源信息请参见该文件或项目既有记录。

---

## 采集路线备注（供后续复用）

1. **simple-icons CDN**（jsdelivr 可达，最省事）：`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg`
   - 本次命中：`openai` / `google` / `anthropic` / `claude` / `bytedance` / `moonshotai` / `kimi`
   - 未命中（404）：`doubao` / `manus`
2. **lobe-icons 静态 SVG 包**（覆盖国产 AI 品牌，含**原色**变体，jsdelivr/unpkg 均可达）：
   `https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons/<name>.svg`
   原色变体加 `-color` 后缀（本次 `doubao-color` / `claude-color` / `google-color` / `kimi-color` 命中；
   `manus-color` / `moonshot-color` / `openai-color` 为 404）
3. **品牌官网** favicon / `<link rel="icon">` 直链（部分站点直接提供 SVG）
4. **Wikimedia Commons**：`commons.wikimedia.org` 与 `upload.wikimedia.org` 本机网络**超时不可达**，
   本次未使用，后续可直接跳过该路线。
