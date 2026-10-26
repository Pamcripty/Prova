import { Composition } from "remotion";
import { HelloVideo } from "./HelloVideo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="HelloVideo"
    component={HelloVideo}
    durationInFrames={120}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: "Setup verified ✓" }}
  />
);
