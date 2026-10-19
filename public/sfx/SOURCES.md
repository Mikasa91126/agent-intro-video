# public/sfx —— 音效来源与规格

## 来源声明

**本目录 11 枚 WAV 全部为程序合成，无第三方素材、无采样库、无版权顾虑。**

- 合成脚本：`tools/make_sfx.py`（纯 Python + numpy/scipy，不联网、无外部音频输入）
- 校验脚本：`tools/check_sfx.py`（只读落盘文件，独立复算）
- 声音由正弦 / 三角波 / FM / 白噪声，经带通、TPT 状态变量滤波器（`svf`）、
  指数包络与等功率声像生成；没有引用任何现成音效文件。

## 规格

| 项 | 值 |
|---|---|
| 采样率 | 48000 Hz |
| 声道 | 2（立体声；噪声类去相关加宽，音调类近单声道，保证单声道兼容） |
| 位深 | 16-bit PCM WAV |
| 峰值 | 每枚 -12 ~ -6 dBFS（实测 -10.00 ~ -7.50，4× 过采样真峰仍留 ≥6.4 dB 余量到 -1 dBFS 红线） |
| 首尾 | 首尾各 5ms 升余弦渐入渐出，首尾样本为 0，无爆音 |

## 清单与配方

| 文件 | 时长 | 峰值 | 配方 |
|---|---|---|---|
| `paper-drop.wav` | 0.500s | -8.0 | 三层错位短噪声 → 带通 400–1800Hz → 约 30ms 快衰 + 200Hz 轻「啪」+ 1.8–7kHz 沙沙尾 |
| `page-flip.wav` | 0.400s | -9.5 | 带通中心 800→3000Hz 上扫（40ms，Q 2.2→1.3）+ 纸边小尖头 + 2.2–9kHz 空气尾 |
| `key-type.wav` | 0.800s | -8.5 | 4 连击（间隔 0.15/0.13/0.17s）：每击 2ms 噪声脉冲 + 1.5kHz 谐振体（逐击 ±2% 失谐）+ 低频 thock |
| `enter-click.wav` | 0.200s | -8.0 | 1.2–7.5kHz 噪声尖头（4ms）+ 120Hz 短正弦（τ=32ms）+ 700Hz 轻谐振 |
| `ui-ping.wav` | 0.600s | -9.5 | 1.6kHz 正弦 + 2.76×（4416Hz）FM 分音、调制指数快收；0.18s 回声 0.35×（略暗、反向偏置） |
| `success-chime.wav` | 0.900s | -9.0 | C5-E5-G5 每 60ms 错落，正弦 + 2×/3× 泛音（高次衰更快）、τ=0.5s，左中右微开 |
| `coin-chime.wav` | 0.500s | -9.0 | E6→B6 两枚金币音（非谐分音 1 / 2.42 / 3.86×）、短衰减 + 起音亮片 |
| `timer-bell.wav` | 0.800s | -9.0 | 1.2kHz 三角波钟声（奇次谐波 1/k²、高次轻伸长）+ 3.7kHz 区非谐敲击分音 + 1.7Hz 拍频微光 |
| `low-hit.wav` | 1.200s | -7.5 | 55→40Hz 指数下坠正弦（0.35s）+ 次低音（27.5→20Hz）+ 轻 tanh 饱和，τ=0.45s 尾截到 1.2s |
| `confirm-click.wav` | 0.500s | -8.5 | 机械 click 层（同 `enter-click`）+ 880Hz 轻确认音（+1.5×/2× 泛音，τ=155ms） |
| `whoosh.wav` | 0.900s | -10.0 | 带通中心 300→4000Hz 指数上扫（0.10→0.68s）+ 3.5–10kHz 空气层 + 200Hz 低频体感，两端包络收干净 |

## 确定性（重复运行逐字节一致）

每枚用固定种子的 `np.random.default_rng`（11001–11011），无时间/系统随机源。
`python tools/make_sfx.py` 连跑两次，11 个文件 sha256 完全相同：

```
coin-chime.wav     82a7e9471053aacffa2bf5e09b02e0ed91a679b409a9bcc9a4f0fa438436a487
confirm-click.wav  edc66aaefa947c999a3bb6d96e0729074aa9e0b24c29713ae3f5998da6f0878c
enter-click.wav    28d13719eaaaef364b465464da0423bb01f473dd55c67616dd8afc4227b6ede4
key-type.wav       23b2318ec545c10558afc0616bf4cc09546a1c7e0639ee1bbf08fe2ff19349a6
low-hit.wav        9bd3d92ccfa3cc8e42790c645389f1d3a0d7e23e9224b0dedeee05d06560b89b
page-flip.wav      9905fded70b44d35491b079a6afd5024ecbb8aee6e99efbc7a64514d63970c80
paper-drop.wav     ee99c7f73ba694c3281a6e93ac4a36a2b97c8ffdd1ce2742821994e292647ce4
success-chime.wav  ed81b97caa238f61fe690e4720f17928d38a9ef66a72cd2f714133b58e5ec127
timer-bell.wav     f53a5d3a8bdbf6ae628a0680d09aeba587a541ee9933578aa358411abfcabb43
ui-ping.wav        2f0400a12f9e3968f9e66b668019b9952ff159bf5a438b1a48f3abe5a29b2360
whoosh.wav         9454784358de5eb6ba4830e05c0a70c930ab96a1ecca5326cfd9964b9cf7880d
```

## 怎么复现 / 校验

```bash
cd B:/agent-intro-video
python tools/make_sfx.py        # 重新合成并覆盖同名 WAV（文件名与数量不变）
python tools/check_sfx.py       # 打印表格：时长/采样率/位深/声道/峰值/RMS/峰因数/首尾/结论
python tools/check_sfx.py --hash   # 附带 sha256，用于比对确定性
```

`check_sfx.py` 退出码：全过 0，任一 FAIL 1（缺文件、多文件、越界峰值、首尾未收、削波、直流都会判 FAIL）。

## 混音提示

- 场景内引用 `<Audio src={staticFile("sfx/xxx.wav")} />`；一镜 1–2 枚为宜。
- 峰值均为 -10 ~ -7.5 dBFS，音乐 bed 下方可直接叠放；`low-hit` 能量最大（低频），
  若与音乐低频打架，优先压音乐 30–60Hz 而不是压它。
- `ui-ping` 自带 0.18s 回声，别在时间轴上再叠 delay。
