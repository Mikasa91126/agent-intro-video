import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PaperStage } from "../comps/PaperStage";
import { MiniWindow } from "../comps/ui";
import { FadeText } from "../comps/Text";
import { TYPE } from "../comps/type";
import { COLORS, EASE, FONTS, SCENE_TITLES } from "../theme";
import { clamp01, prog } from "../lib/anim";

/* ------------------------------------------------------------------ 共用小件 */

/** 顶部：章节标签 + 主文案（中文衬线）+ 英文点缀，左侧陶土竖线 */
const Head = ({ kicker, cn, en }: { kicker: string; cn: string; en: string }) => {
  const frame = useCurrentFrame();
  const ruleP = EASE.outExpo(clamp01((frame - 6) / 26));
  return (
    <div style={{ position: "absolute", left: 140, top: 96, width: 1400 }}>
      <FadeText start={0} y={0} dur={18}>
        <div style={{ ...TYPE.label }}>{kicker}</div>
      </FadeText>
      <div style={{ position: "absolute", left: 0, top: 52, display: "flex", gap: 26 }}>
        <div
          style={{
            width: 3,
            borderRadius: 2,
            backgroundColor: COLORS.clay,
            transform: `scaleY(${ruleP})`,
            transformOrigin: "top",
          }}
        />
        <div>
          <FadeText start={6} y={14} dur={46}>
            <div
              style={{
                fontFamily: FONTS.serifCN,
                fontWeight: 400,
                fontSize: 42,
                lineHeight: 1.42,
                letterSpacing: "0.02em",
                color: COLORS.ink,
                maxWidth: 1180,
              }}
            >
              {cn}
            </div>
          </FadeText>
          <FadeText start={16} y={10} dur={46}>
            <div
              style={{
                fontFamily: FONTS.serifLatin,
                fontStyle: "italic",
                fontSize: 28,
                lineHeight: 1.4,
                color: COLORS.graphite,
                marginTop: 8,
              }}
            >
              {en}
            </div>
          </FadeText>
        </div>
      </div>
    </div>
  );
};

/** 半屏角标（右缘） */
const HalfTag = ({ x, y, children, start }: { x: number; y: number; children: string; start: number }) => (
  <FadeText start={start} y={8} dur={30} style={{ position: "absolute", left: x - 420, top: y, width: 420, textAlign: "right" }}>
    <div style={{ ...TYPE.label, fontSize: 21, letterSpacing: "0.24em" }}>{children}</div>
  </FadeText>
);

/* ------------------------------------------------------------------ 聊天内容 */

const CHAT: { me?: boolean; t: string }[] = [
  { me: true, t: "帮我写一段自我介绍。" },
  { t: "好的——「我叫小 A，喜欢把复杂的事情拆开做。」语气还可以再调。" },
  { me: true, t: "再口语一点。" },
  { t: "没问题，这是更口语的一版，你可以直接复制。" },
  { me: true, t: "把这个文件夹里的笔记整理成一个网页。" },
  { t: "我可以帮你梳理结构：首页放标题和目录，正文按主题分组，结尾加索引……" },
  { me: true, t: "能直接给我一个网页文件吗？" },
  { t: "抱歉，我不能改动你的文件。你可以照上面的结构自己搭一个。" },
];

const ChatFeed = () => {
  const frame = useCurrentFrame();
  const scroll = prog(frame, 30, 550) * 520;
  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${24 - scroll}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "18px 26px",
        }}
      >
        {CHAT.map((b, i) => (
          <div
            key={i}
            style={{
              alignSelf: b.me ? "flex-end" : "flex-start",
              maxWidth: 780,
              backgroundColor: b.me ? COLORS.paperDeep : COLORS.paperWhite,
              border: `1px solid ${COLORS.lineSoft}`,
              borderRadius: 14,
              padding: "13px 22px",
              fontFamily: FONTS.sansCN,
              fontSize: 26,
              lineHeight: 1.5,
              color: COLORS.ink,
            }}
          >
            {b.t}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 44,
          background: `linear-gradient(to bottom, ${COLORS.paperWhite}, rgba(250,249,245,0))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 44,
          background: `linear-gradient(to top, ${COLORS.paperWhite}, rgba(250,249,245,0))`,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ 图形零件 */

const Glyph = ({ children }: { children: ReactNode }) => (
  <svg width={96} height={96} viewBox="0 0 100 100" fill="none" stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const FolderGlyph = () => (
  <Glyph>
    <path d="M14 24 H34 L45 36 H86 A8 8 0 0 1 94 44 V78 A8 8 0 0 1 86 86 H14 A8 8 0 0 1 6 78 V32 A8 8 0 0 1 14 24 Z" />
  </Glyph>
);

const CodeGlyph = () => (
  <Glyph>
    <path d="M 30 32 L 12 50 L 30 68" />
    <path d="M 70 32 L 88 50 L 70 68" />
    <path d="M 56 26 L 44 74" />
  </Glyph>
);

const WebGlyph = () => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - 414) / 34);
  return (
    <svg width={108} height={96} viewBox="0 0 112 100" fill="none" stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      <rect x={6} y={14} width={100} height={76} rx={10} />
      <path d="M6 38 H106" />
      <circle cx={20} cy={26} r={2.6} fill={COLORS.ink} />
      <circle cx={32} cy={26} r={2.6} fill={COLORS.ink} />
      <g opacity={p}>
        <rect x={20} y={50} width={44} height={9} rx={4.5} fill={COLORS.ink} stroke="none" />
        <rect x={20} y={68} width={72} height={6} rx={3} fill={COLORS.ink} stroke="none" opacity={0.55} />
        <rect x={20} y={80} width={58} height={6} rx={3} fill={COLORS.ink} stroke="none" opacity={0.35} />
      </g>
    </svg>
  );
};

/** 陶土对勾徽标 */
const Check = ({ size = 44, at }: { size?: number; at: number }) => {
  const frame = useCurrentFrame();
  const p = EASE.outExpo(clamp01((frame - at) / 18));
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: -16,
        top: -16,
        width: size,
        height: size,
        borderRadius: 99,
        backgroundColor: COLORS.clay,
        color: COLORS.paperWhite,
        fontSize: size * 0.6,
        lineHeight: `${size}px`,
        textAlign: "center",
        fontFamily: FONTS.body,
        transform: `scale(${0.4 + 0.6 * p})`,
        boxShadow: "0 8px 20px rgba(198,97,63,0.35)",
      }}
    >
      ✓
    </div>
  );
};

/* ------------------------------------------------------------------- 场景 */

/** S02 · 会聊天 vs 会做事（10s–20s · 600f） */
export const S02 = ({ dur }: { dur: number }) => {
  const frame = useCurrentFrame();

  // 中缝：自中心向两侧展开
  const seamP = EASE.outExpo(clamp01((frame - 8) / 44));
  const seamW = 1640 * seamP;

  // 上半：聊天窗入场
  const winP = EASE.outExpo(clamp01((frame - 20) / 26));

  // 下半：三节点
  const tileP = (i: number) => EASE.outExpo(clamp01((frame - 80 - i * 8) / 24));
  const labelP = (i: number) => clamp01((frame - 112 - i * 6) / 18);
  const lineP = EASE.draw(clamp01((frame - 130) / 72));
  const popP = (t: number) => (frame < t ? 0 : Math.exp(-(frame - t) / 14));

  // 数据包：两段 + 尾段持续流动
  const pA = EASE.outExpo(clamp01((frame - 220) / 90));
  const pB = EASE.outExpo(clamp01((frame - 330) / 90));
  const loopPhase = (frame - 500) % 110;
  const loop = frame >= 500 && loopPhase < 90;

  const pktA = 500 + 460 * pA;
  const pktB = 960 + 340 * pB;
  const pktC = 620 + 680 * (loop ? loopPhase / 90 : 0);

  // 完成
  const doneAt = 466;

  // 退场：墨迹扩散（径向 mask 收缩）+ 轻微推近
  const exP = clamp01((frame - (dur - 14)) / 14);
  const mask = `radial-gradient(circle at 50% 50%, rgba(0,0,0,1) ${(1 - exP) * 118}%, rgba(0,0,0,0) ${(1 - exP) * 118 + 18}%)`;

  return (
    <PaperStage dur={dur} tone="medium" grid>
      <Sequence from={30} durationInFrames={70}>
        <Audio src={staticFile("sfx/key-type.wav")} />
      </Sequence>
      <Sequence from={doneAt} durationInFrames={80}>
        <Audio src={staticFile("sfx/success-chime.wav")} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: 1 - exP,
          transform: `scale(${1 + exP * 0.02})`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        <Head
          kicker={`科普 02 · ${SCENE_TITLES[1]}`}
          cn="聊天机器人给你答案；Agent 给你结果。"
          en="Chatbots give answers. Agents deliver results."
        />

        {/* ---------------------------------------------------- 上半 · 聊天 */}
        <HalfTag x={1780} y={272} start={26}>
          CHATBOT · 聊天机器人
        </HalfTag>
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 306,
            width: 1440,
            opacity: winP,
            transform: `translateY(${(1 - winP) * 18}px)`,
          }}
        >
          <MiniWindow title="chat" variant="light" height={252} bodyStyle={{ padding: 0 }}>
            <ChatFeed />
          </MiniWindow>
        </div>

        {/* ------------------------------------------------------ 中缝分界 */}
        <div
          style={{
            position: "absolute",
            left: 960 - seamW / 2,
            top: 596,
            width: seamW,
            height: 2,
            borderRadius: 2,
            backgroundColor: COLORS.ink,
            opacity: seamP * 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 954,
            top: 590,
            width: 12,
            height: 12,
            borderRadius: 99,
            backgroundColor: COLORS.clay,
            transform: `scale(${seamP})`,
          }}
        />

        {/* -------------------------------------------- 下半 · Agent 三步 */}
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 630,
            display: "flex",
            alignItems: "center",
            gap: 16,
            height: 54,
            padding: "0 26px",
            borderRadius: 12,
            backgroundColor: COLORS.paperWhite,
            border: `1px solid ${COLORS.line}`,
            boxShadow: "0 10px 26px rgba(31,30,29,0.06)",
            opacity: lineP,
            transform: `translateY(${(1 - lineP) * 10}px)`,
          }}
        >
          <span style={{ fontFamily: FONTS.mono, fontSize: 24, color: COLORS.clay }}>❯</span>
          <span style={{ fontFamily: FONTS.sansCN, fontSize: 26, color: COLORS.ink, letterSpacing: "0.01em" }}>
            把这个文件夹里的笔记整理成一个网页。
          </span>
        </div>
        <HalfTag x={1780} y={642} start={30}>
          AGENT · 会做事
        </HalfTag>

        {/* 连线 + 数据包（在卡片之下） */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            d="M 620 800 L 1300 800"
            fill="none"
            stroke={COLORS.ink}
            strokeOpacity={0.32}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="680 680"
            strokeDashoffset={680 * (1 - lineP)}
          />
          {frame >= 240 ? <circle cx={pktA} cy={800} r={7} fill={COLORS.clay} /> : null}
          {frame >= 350 ? <circle cx={pktB} cy={800} r={7} fill={COLORS.clay} /> : null}
          {loop ? <circle cx={pktC} cy={800} r={7} fill={COLORS.clay} opacity={0.9} /> : null}
        </svg>

        {[
          { x: 620, label: "文件夹", glyph: <FolderGlyph />, popAt: 200 },
          { x: 960, label: "代码行", glyph: <CodeGlyph />, popAt: 312 },
          { x: 1300, label: "网页结果", glyph: <WebGlyph />, popAt: 422 },
        ].map((t, i) => (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: t.x - 92,
                top: 708,
                width: 184,
                height: 184,
                borderRadius: 18,
                backgroundColor: COLORS.paperWhite,
                border: `1px solid ${COLORS.line}`,
                boxShadow: "0 18px 44px rgba(31,30,29,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: tileP(i),
                transform: `scale(${0.92 + 0.08 * tileP(i) + 0.028 * popP(t.popAt)})`,
              }}
            >
              {t.glyph}
              {i === 2 ? <Check at={doneAt} /> : null}
            </div>
            <div
              style={{
                position: "absolute",
                left: t.x - 160,
                top: 908,
                width: 320,
                textAlign: "center",
                fontFamily: FONTS.sansCN,
                fontSize: 26,
                letterSpacing: "0.06em",
                color: COLORS.graphite,
                opacity: labelP(i),
              }}
            >
              {t.label}
            </div>
          </div>
        ))}
      </AbsoluteFill>
    </PaperStage>
  );
};
