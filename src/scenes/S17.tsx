/**
 * S17 · 指导二 · 安全习惯（2:41–2:47 · 360f）
 * 审批弹窗快速闪过（模糊、渐快、可数：6 个）→ 危险操作弹窗被一只「手」按下「拒绝」定格；
 * 右侧数据条 count-up：同意率约 93%→97%、1,053 人实验中人只拦下 13.6%。
 */
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { TYPE } from "../comps/type";
import { Card } from "../comps/ui";
import { Cursor } from "../comps/Cursor";
import { Counter } from "../comps/Counter";
import { COLORS, EASE, FONTS } from "../theme";
import { mulberry32, prog } from "../lib/anim";

const SLIDE = Easing.bezier(0.16, 1, 0.3, 1);

/** 6 个快速闪过的普通审批弹窗（间距 14→6 渐减 = 渐快但可数） */
const FLASH: { t: number; life: number; tag: string; op: string; cmd: string }[] = [
  { t: 30, life: 18, tag: "READ", op: "读取 src/ 下的文件", cmd: "Read src/**" },
  { t: 44, life: 16, tag: "BASH", op: "运行测试", cmd: "Bash npm test" },
  { t: 56, life: 15, tag: "WRITE", op: "写入 build/ 目录", cmd: "Write build/*" },
  { t: 67, life: 13, tag: "FETCH", op: "抓取网页", cmd: "Fetch example.com" },
  { t: 77, life: 12, tag: "BASH", op: "安装依赖", cmd: "Bash npm i sharp" },
  { t: 85, life: 11, tag: "EDIT", op: "修改配置文件", cmd: "Edit config.json" },
];
const CLICKS = [39, 53, 65, 75, 84, 91];

const DANGER_AT = 96;
const ARRIVE = 136;
const PRESS = 148;

/* 对话框几何 */
const DLG = { x: 300, y: 300, w: 560, h: 340 };
const BTN_Y = DLG.y + DLG.h - 26 - 52; // 按钮行顶
/** 按钮行右对齐：拒绝 538..678 ｜ 允许 694..834 */
const ALLOW = { x: 764, y: BTN_Y + 26 };
const DENY = { x: 608, y: BTN_Y + 26 };

export const S17 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(prog(frame, 0, 10), 1 - prog(frame, dur - 18, 18));
  const jit = mulberry32(17);
  const cursorPath = [{ x: 1120, y: 780, f: 24 }];
  CLICKS.forEach((cf) => {
    const x = ALLOW.x + (jit() * 2 - 1) * 16;
    const y = ALLOW.y + (jit() * 2 - 1) * 11;
    cursorPath.push({ x, y, f: cf });
    cursorPath.push({ x, y, f: cf + 4 });
  });

  return (
    <PaperStage dur={dur} tone="medium" creep="push">
      <AbsoluteFill style={{ opacity: fade }}>
        {/* 章节标签 */}
        <div style={{ position: "absolute", left: 140, top: 96, ...TYPE.label }}>
          指导二 · 安全习惯 ｜ STAY SAFE
        </div>

        {/* ---------------- 闪过的普通弹窗 ---------------- */}
        {FLASH.map((d, i) => (
          <FlashDialog key={d.t} d={d} i={i} frame={frame} />
        ))}

        {/* ---------------- 危险弹窗（定格） ---------------- */}
        {frame >= DANGER_AT ? <DangerDialog frame={frame} /> : null}

        {/* ---------------- 弹窗计数点（可数） ---------------- */}
        <div style={{ position: "absolute", left: DLG.x + 4, top: DLG.y + DLG.h + 30, display: "flex", gap: 12 }}>
          {FLASH.map((d, i) => {
            const lit = prog(frame, d.t + 4, 8);
            return (
              <span
                key={i}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: 99,
                  backgroundColor: lit > 0.5 ? COLORS.ink : "rgba(20,20,19,0.16)",
                  opacity: 0.4 + lit * 0.6,
                }}
              />
            );
          })}
          <span
            style={{
              marginLeft: 8,
              fontFamily: FONTS.mono,
              fontSize: 19,
              letterSpacing: "0.1em",
              color: COLORS.grey,
              opacity: prog(frame, 100, 14),
            }}
          >
            连点 6 次
          </span>
        </div>

        {/* ---------------- 右手按下「拒绝」 ---------------- */}
        <PressingHand frame={frame} />

        {/* ---------------- 角落数据条 ---------------- */}
        {frame >= 212 ? <DataStrip frame={frame} /> : null}

        {/* ---------------- 主文案 ---------------- */}
        <div style={{ position: "absolute", left: 140, bottom: 96, maxWidth: 1200 }}>
          <div style={{ ...TYPE.body, fontSize: 40, lineHeight: 1.5 }}>
            安全习惯：审批弹窗别连点——点得越多，漏得越多。
          </div>
          <div style={{ ...TYPE.body, fontSize: 40, lineHeight: 1.5 }}>删除、发送、付款、发布，先确认再执行。</div>
          <div style={{ ...TYPE.en, fontStyle: "italic", fontSize: 30, color: COLORS.grey, marginTop: 8 }}>
            Stay safe: don't blind-click approvals. Delete, send, pay, publish—confirm first.
          </div>
        </div>

        {/* 光标：在「允许」上连点 */}
        <Cursor path={cursorPath} clicks={CLICKS} appearAt={30} vanishAt={102} />
      </AbsoluteFill>

      {CLICKS.map((f) => (
        <Sequence key={f} from={f} durationInFrames={30}>
          <Audio src={staticFile("sfx/enter-click.wav")} />
        </Sequence>
      ))}
      <Sequence from={PRESS} durationInFrames={50}>
        <Audio src={staticFile("sfx/low-hit.wav")} />
      </Sequence>
      <Sequence from={PRESS + 8} durationInFrames={60}>
        <Audio src={staticFile("sfx/confirm-click.wav")} />
      </Sequence>
    </PaperStage>
  );
};

/* -------------------------------------------------------------- 弹窗外壳 */

const DialogFrame = ({ children, style, border }: { children: ReactNode; style?: CSSProperties; border?: string }) => (
  <div
    style={{
      position: "absolute",
      left: DLG.x,
      top: DLG.y,
      width: DLG.w,
      height: DLG.h,
      boxSizing: "border-box",
      backgroundColor: COLORS.paperWhite,
      border: border ?? `1px solid ${COLORS.line}`,
      borderRadius: 16,
      boxShadow: "0 24px 60px rgba(31,30,29,0.14)",
      padding: 26,
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    {children}
  </div>
);

const TitleRow = ({ variant }: { variant: "normal" | "danger" }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ fontFamily: FONTS.mono, fontSize: 20, letterSpacing: "0.1em", color: COLORS.grey }}>
      审批 · 需要你确认
    </span>
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: 18,
        letterSpacing: "0.12em",
        padding: "5px 14px",
        borderRadius: 99,
        border: `1px solid ${variant === "danger" ? COLORS.clay : COLORS.line}`,
        color: variant === "danger" ? COLORS.clay : COLORS.grey,
      }}
    >
      {variant === "danger" ? "危险操作" : "普通操作"}
    </span>
  </div>
);

const Tags = ({ tag }: { tag: string }) => (
  <span
    style={{
      fontFamily: FONTS.mono,
      fontSize: 17,
      letterSpacing: "0.1em",
      color: COLORS.grey,
      border: `1px solid ${COLORS.line}`,
      borderRadius: 6,
      padding: "5px 12px",
      flexShrink: 0,
    }}
  >
    {tag}
  </span>
);

/** 按钮行：右对齐「拒绝 / 允许」 */
const Buttons = ({ denyPress, allowPress }: { denyPress?: number; allowPress?: number }) => (
  <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", gap: 16 }}>
    <span
      style={{
        width: 140,
        height: 52,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS.sansCN,
        fontSize: 25,
        border: `1.5px solid ${denyPress ? COLORS.clay : COLORS.ink}`,
        backgroundColor: denyPress ? COLORS.clay : "transparent",
        color: denyPress ? COLORS.paperWhite : COLORS.ink,
        transform: denyPress ? "translateY(1.5px)" : "none",
      }}
    >
      拒绝
    </span>
    <span
      style={{
        width: 140,
        height: 52,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS.sansCN,
        fontSize: 25,
        border: `1.5px solid ${COLORS.ink}`,
        backgroundColor: allowPress ? COLORS.ink : "rgba(20,20,19,0.86)",
        color: COLORS.paperWhite,
        opacity: allowPress ? 1 : 0.9,
      }}
    >
      允许
    </span>
  </div>
);

/* ------------------------------------------------------------ 闪过的弹窗 */

const FlashDialog = ({ d, i, frame }: { d: (typeof FLASH)[number]; i: number; frame: number }) => {
  const appear = prog(frame, d.t, 4);
  const leave = prog(frame, d.t + d.life - 6, 6);
  const o = Math.min(1, appear * 2) * (1 - leave);
  if (o <= 0.001) return null;
  const blur = 6 - appear * 3.5 + leave * 5;
  const clickAt = CLICKS[i];
  const clicked = frame >= clickAt && frame < clickAt + 5;

  return (
    <DialogFrame
      style={{
        opacity: o,
        filter: `blur(${blur}px)`,
        transform: `scale(${1.03 - appear * 0.03})`,
      }}
    >
      <TitleRow variant="normal" />
      <div style={{ height: 1, backgroundColor: COLORS.lineSoft, margin: "20px 0 24px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Tags tag={d.tag} />
        <span style={{ ...TYPE.body, fontSize: 28, color: COLORS.ink }}>{d.op}</span>
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.grey, marginTop: 14, paddingLeft: 4 }}>
        {d.cmd}
      </div>
      <Buttons allowPress={clicked ? 1 : 0} />
    </DialogFrame>
  );
};

/* -------------------------------------------------------------- 危险弹窗 */

const DangerDialog = ({ frame }: { frame: number }) => {
  const settle = EASE.outExpo(prog(frame, DANGER_AT, 26));
  const pressed = frame >= PRESS;
  const stampP = Math.min(1, prog(frame, PRESS + 8, 12) * 1.6);
  return (
    <>
      <DialogFrame
        border={pressed ? `1.5px solid ${COLORS.clay}` : `1px solid ${COLORS.line}`}
        style={{
          opacity: Math.min(1, settle * 1.8),
          transform: `scale(${1.035 - settle * 0.035})`,
        }}
      >
        <TitleRow variant="danger" />
        <div style={{ height: 1, backgroundColor: COLORS.lineSoft, margin: "18px 0 20px" }} />

        <OpRow icon={<TrashIcon color={COLORS.ink} />} text="删除 3 个文件" cmd="rm -rf build/ draft/ tmp/" />
        <div style={{ height: 12 }} />
        <OpRow icon={<CoinIcon color={COLORS.ink} />} text="转账 ¥ 12,000" cmd="transfer --to 6222 **** 0198" />

        <Buttons denyPress={pressed ? 1 : 0} />
      </DialogFrame>

      {/* 定格标记 */}
      <div
        style={{
          position: "absolute",
          left: DLG.x + DLG.w + 22,
          top: DLG.y + 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: stampP,
          transform: `translateX(${(1 - stampP) * -14}px)`,
        }}
      >
        <span style={{ fontFamily: FONTS.mono, fontSize: 21, letterSpacing: "0.1em", color: COLORS.clay }}>✓ 已拒绝</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 21, letterSpacing: "0.1em", color: COLORS.grey }}>· 未执行</span>
      </div>
    </>
  );
};

const OpRow = ({ icon, text, cmd }: { icon: ReactNode; text: string; cmd: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <span style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${COLORS.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </span>
    <div>
      <div style={{ ...TYPE.body, fontSize: 27, color: COLORS.ink, lineHeight: 1.25 }}>{text}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 19, color: COLORS.grey, marginTop: 4 }}>{cmd}</div>
    </div>
  </div>
);

const TrashIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M4 7h16M10 4h4M6.5 7l1 13h9l1-13M10 11v6M14 11v6" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CoinIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="1.7" />
    <path d="M9 9.4l3 3 3-3M12 12.4V16M9.5 13.6h5M9.5 15h5" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------------------------------------------------------------- 按下拒绝 */

const HAND = { w: 156, h: 176, tipX: 74, tipY: 6 };

const PressingHand = ({ frame }: { frame: number }) => {
  const travel = EASE.outExpo(prog(frame, 100, 36));
  const push = prog(frame, ARRIVE + 2, 12);
  if (frame < 96) return null;
  const restX = 655 - HAND.tipX;
  const restY = DENY.y - 14 - HAND.tipY;
  const x = 1880 + (restX - 1880) * travel;
  const y = 600 + (restY - 600) * travel + push * 12;
  const o = Math.min(1, prog(frame, 100, 12) * 1.6);
  const rp = prog(frame, PRESS, 16);

  const shapes = (
    <>
      {/* 食指 */}
      <rect x={56} y={6} width={36} height={106} rx={18} />
      {/* 拳 */}
      <rect x={34} y={92} width={104} height={72} rx={26} />
      {/* 拇指 */}
      <rect x={12} y={100} width={52} height={30} rx={15} transform="rotate(-14 38 115)" />
    </>
  );

  return (
    <div style={{ position: "absolute", left: x, top: y, width: HAND.w, height: HAND.h, opacity: o, pointerEvents: "none" }}>
      <svg width={HAND.w} height={HAND.h} viewBox={`0 0 ${HAND.w} ${HAND.h}`} style={{ filter: "drop-shadow(0 10px 18px rgba(20,20,19,0.26))" }}>
        <g stroke={COLORS.paperWhite} strokeWidth={6}>
          {shapes}
        </g>
        <g fill={COLORS.ink}>{shapes}</g>
        {/* 蜷起的手指分缝 */}
        <g stroke={COLORS.paperWhite} strokeWidth={2.6} strokeLinecap="round" opacity={0.5} fill="none">
          <path d="M 98 110 q 22 2 32 10" />
          <path d="M 98 132 q 22 2 30 9" />
        </g>
      </svg>
      {/* 按压涟漪 */}
      {frame >= PRESS && frame < PRESS + 16 ? (
        <span
          style={{
            position: "absolute",
            left: 655 - x - (14 + rp * 26),
            top: DENY.y - y - (14 + rp * 26),
            width: (14 + rp * 26) * 2,
            height: (14 + rp * 26) * 2,
            borderRadius: "50%",
            border: `2px solid ${COLORS.clay}`,
            opacity: (1 - rp) * 0.75,
          }}
        />
      ) : null}
    </div>
  );
};

/* ---------------------------------------------------------------- 数据条 */

const DataStrip = ({ frame }: { frame: number }) => {
  const p = SLIDE(prog(frame, 212, 40));
  return (
    <div style={{ position: "absolute", left: 1140, top: 250, width: 640, opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
      <Card tone="light" padding={32} style={{ height: 470 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 20, letterSpacing: "0.12em", color: COLORS.grey }}>
          权限弹窗同意率 / APPROVAL RATE
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 14 }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 46, color: COLORS.graphite }}>约 93%</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 34, color: COLORS.grey }}>→</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 60, color: COLORS.clayDark, lineHeight: 1 }}>
            <Counter from={93} to={97} start={228} dur={76} format={(v) => v.toFixed(0)} suffix="%" />
          </span>
        </div>

        <BarRow label="93%" value={0.93} start={228} color="rgba(20,20,19,0.34)" frame={frame} />
        <BarRow label="97%" value={0.97} start={238} color={COLORS.clay} frame={frame} />

        <div style={{ height: 1, backgroundColor: COLORS.lineSoft, margin: "26px 0 22px" }} />

        <div style={{ fontFamily: FONTS.mono, fontSize: 30, color: COLORS.ink }}>
          <Counter to={1053} start={244} dur={76} /> <span style={{ fontSize: 24, color: COLORS.graphite }}>人实验</span>
        </div>
        <div style={{ ...TYPE.body, fontSize: 26, color: COLORS.graphite, marginTop: 10, lineHeight: 1.45 }}>
          人只拦下 <span style={{ color: COLORS.clayDark, fontWeight: 600 }}>13.6%</span> 危险命令
        </div>
        <div style={{ marginTop: 14, height: 12, borderRadius: 99, backgroundColor: "rgba(20,20,19,0.10)", overflow: "hidden" }}>
          <span
            style={{
              display: "block",
              height: 12,
              width: `${0.136 * Math.min(1, prog(frame, 258, 40)) * 100}%`,
              minWidth: 6,
              borderRadius: 99,
              backgroundColor: COLORS.clay,
            }}
          />
        </div>

        <div style={{ marginTop: "auto", fontFamily: FONTS.mono, fontSize: 18, letterSpacing: "0.06em", color: COLORS.grey }}>
          据 Anthropic 数据（2026-08 报道）
        </div>
      </Card>
    </div>
  );
};

const BarRow = ({
  label,
  value,
  start,
  color,
  frame,
}: {
  label: string;
  value: number;
  start: number;
  color: string;
  frame: number;
}) => {
  const p = EASE.draw(prog(frame, start, 44));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
      <span style={{ fontFamily: FONTS.mono, fontSize: 19, color: COLORS.grey, width: 54 }}>{label}</span>
      <span style={{ flex: 1, height: 12, borderRadius: 99, backgroundColor: "rgba(20,20,19,0.10)", overflow: "hidden" }}>
        <span style={{ display: "block", height: 12, width: `${value * p * 100}%`, borderRadius: 99, backgroundColor: color }} />
      </span>
    </div>
  );
};
