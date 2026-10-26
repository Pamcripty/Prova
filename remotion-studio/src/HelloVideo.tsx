import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const HelloVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const scale = interpolate(frame, [24, 120], [1, 1.08], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1020", justifyContent: "center", alignItems: "center" }}>
      <h1
        style={{
          color: "#f5f3ff",
          fontFamily: "sans-serif",
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 40}px) scale(${scale})`,
        }}
      >
        {title}
      </h1>
    </AbsoluteFill>
  );
};
