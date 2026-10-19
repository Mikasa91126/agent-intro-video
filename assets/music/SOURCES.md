# 音乐素材来源与许可（AI Agent 科普视频 · 180s）

采集日期：2026-10-16　采集方式：curl（浏览器 UA）直连曲库 CDN
曲库：Mixkit（Envato）— https://mixkit.co/free-stock-music/

> 说明：Mixkit 的 **音乐曲目没有单曲页面**（所有 `/free-stock-music/<slug>-<id>/` 形式都会 301 到搜索页，
> 已实测 `/moon-walk-609/`、`/609-moon-walk/`、`/free-stock-music/609/` 三种形式均跳转到
> `https://mixkit.co/free-stock-music/discover/...` 搜索页）。因此「曲目页 URL」一栏给出的是
> **该曲目所在的分类/标签列表页**（曲目信息可在这些页面的 JSON-LD `ItemList` 中核验，
> JSON-LD 内含曲名、作者、时长、版权声明与许可链接），并附 CDN 直链作为唯一稳定的单曲地址。

---

## 许可（三首通用）

- 许可类型：**Mixkit Stock Music Free License**
- 许可页：https://mixkit.co/license/ （弹窗原文接口：https://mixkit.co/license/modal/musicFree/ ）
- JSON-LD 中对该曲的版权声明字段原文：`"copyrightNotice":"Mixkit Stock Music Free License"`，
  同条目的 `"license":"https://mixkit.co/license/#musicFree"`、`"isAccessibleForFree":true`
- **署名要求：无需署名**（Mixkit 官方 LLM 资料页原文：*"Free License: Allows use in commercial
  projects (YouTube videos, social media marketing, online ads, music videos) and personal projects.
  No attribution required."* — https://mixkit.co/llm-info/ ；另见 https://mixkit.co/llms.txt
  *"free to download without watermarks or mandatory attribution"*）

### 许可原文摘录（https://mixkit.co/license/modal/musicFree/ ，逐字）

> **Stock Music Free License**
>
> Allowed: Podcasts / Social Media video posts / Online marketing ads / Educational Purposes / YouTube videos
>
> Not Allowed: CDs & DVDs / TV & Radio Broadcasts / Video Games
>
> Items under the Mixkit Stock Music Free License can be used in your commercial and non-commercial
> projects for free.
>
> You're permitted to download, copy, modify, distribute and publicly perform the Music Items on any
> web or social media platform, including internet-based video on demand services, podcasts and
> advertisements.
>
> You're not allowed to use them in CDs or DVDs, video games or tv or radio broadcast. You're also
> not allowed to remix them (or incorporate in a music-only track), claim them as your own or register
> them on any rights management service.
>
> There are some important limits to these rights, described in our User Terms.

**对本次用途的合规结论**：AI Agent 科普视频属于「Educational Purposes / YouTube videos / Online marketing ads」
范畴，**允许商用、免费、免署名**。需要规避的是：TV/Radio 广播投放、CD/DVD 出版物、电子游戏内嵌、
把素材做进「纯音乐作品」或登记到版权管理系统（Content ID 之类）。剪进视频里做配乐、裁剪/淡入淡出属于
许可明示的 "download, copy, **modify**, distribute and publicly perform"。

---

## candidate-1.mp3 — Moon Walk

| 项 | 内容 |
|---|---|
| 曲名 | Moon Walk |
| 作者 | Eugenio Mininni |
| 风格（曲库标注） | Electronica |
| 曲目页 URL | https://mixkit.co/free-stock-music/tag/technology/ （同曲亦见 tag/science/、tag/corporate/、tag/industry/、tag/investigation/） |
| 下载直链 | https://assets.mixkit.co/music/609/609.mp3 |
| 波形数据（曲库提供） | https://assets.mixkit.co/music/609/609-waveform.json |
| 许可类型 | Mixkit Stock Music Free License（免费商用、免署名；限制见上） |
| 曲库标注时长 | PT3M25S（205s） |
| 实测时长 | 204.69s |
| 文件 | 256 kbps MP3 / 44.1 kHz / stereo / 6,552,227 B (6.25 MB) / md5 ff2b29fbdaf56942756a0d589d6dae51 |
| 发布日期（曲库） | 2020-01-28 |

## candidate-2.mp3 — Your Breath

| 项 | 内容 |
|---|---|
| 曲名 | Your Breath |
| 作者 | Eugenio Mininni |
| 风格（曲库标注） | Corporate Music |
| 曲目页 URL | https://mixkit.co/free-stock-music/corporate-music/ （同曲亦见 tag/technology/、tag/corporate/、tag/industry/） |
| 下载直链 | https://assets.mixkit.co/music/634/634.mp3 |
| 波形数据（曲库提供） | https://assets.mixkit.co/music/634/634-waveform.json |
| 许可类型 | Mixkit Stock Music Free License（免费商用、免署名；限制见上） |
| 曲库标注时长 | PT3M56S（236s） |
| 实测时长 | 236.08s |
| 文件 | 256 kbps MP3 / 44.1 kHz / stereo / 7,557,001 B (7.21 MB) / md5 43c089a03bf7b98aec9fe2af952b976e |
| 发布日期（曲库） | 2020-01-28 |

## candidate-3.mp3 — Kodama Night Town

| 项 | 内容 |
|---|---|
| 曲名 | Kodama Night Town |
| 作者 | Alejandro Magaña (A. M.) |
| 风格（曲库标注） | Electronic |
| 曲目页 URL | https://mixkit.co/free-stock-music/tag/technology/ （同曲亦见 tag/background/、tag/space/，曲风页 /free-stock-music/electronic/） |
| 下载直链 | https://assets.mixkit.co/music/114/114.mp3 |
| 波形数据（曲库提供） | https://assets.mixkit.co/music/114/114-waveform.json |
| 许可类型 | Mixkit Stock Music Free License（免费商用、免署名；限制见上） |
| 曲库标注时长 | PT3M5S（185s） |
| 实测时长 | 184.75s |
| 文件 | 256 kbps MP3 / 48 kHz / stereo / 5,912,134 B (5.64 MB) / md5 38280c4884bf31f5a27dd1fd9a29a7d5 |
| 发布日期（曲库） | 2020-01-28 |

---

## 复现下载命令

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
curl -L -A "$UA" -e "https://mixkit.co/free-stock-music/" -o candidate-1.mp3 https://assets.mixkit.co/music/609/609.mp3
curl -L -A "$UA" -e "https://mixkit.co/free-stock-music/" -o candidate-2.mp3 https://assets.mixkit.co/music/634/634.mp3
curl -L -A "$UA" -e "https://mixkit.co/free-stock-music/" -o candidate-3.mp3 https://assets.mixkit.co/music/114/114.mp3
```

## 备选（未下载，供换曲参考）

同批筛选出的同类曲目（同为 Mixkit Stock Music Free License）：
- **Xceed Thru Johann** — Eugenio Mininni — Electronica, 232.0s — https://assets.mixkit.co/music/556/556.mp3
- **Masking the Masters** — Eugenio Mininni — Orchestral Hybrid, 220.0s — https://assets.mixkit.co/music/552/552.mp3
- **Hazy After Hours** — Alejandro Magaña (A. M.) — Electronica, 127.2s — https://assets.mixkit.co/music/132/132.mp3
- **Slow Rain** — Alejandro Magaña (A. M.) — Electronica, 129.2s — https://assets.mixkit.co/music/122/122.mp3
- **Infinity** — Arulo — Corporate Music, 102.9s — https://assets.mixkit.co/music/440/440.mp3
- **Coffee or Tea** — Michael Ramir C. — Electronica, 124.8s — https://assets.mixkit.co/music/1168/1168.mp3
