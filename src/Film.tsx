import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS, SCENE_DURATIONS, sceneStart } from "./theme";
import { SCENES } from "./scenes";

/**
 * 《AI Agent 巡礼》总装：19 镜按 SCENE_DURATIONS 无缝排布（10800 帧 @60fps = 180.0s）。
 * 音轨：public/audio/film-music.wav（Moon Walk · Mixkit License，0–180s 剪辑版）。
 * SFX 由各场景在镜内以 <Audio src={staticFile("sfx/xxx.wav")} /> 自行放置。
 */
export const Film = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      <Audio src={staticFile("audio/film-music.wav")} />
      {SCENES.map((Comp, i) => (
        <Sequence
          key={i}
          from={sceneStart(i + 1)}
          durationInFrames={SCENE_DURATIONS[i]}
        >
          <Comp dur={SCENE_DURATIONS[i]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
