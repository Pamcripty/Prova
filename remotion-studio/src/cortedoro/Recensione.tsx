import "./fonts";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CalculateMetadataFunction } from "remotion";

export type RecensioneProps = {
  testo: string;
  autore: string;
  stelle: number;
  brand: string;
};

const colors = {
  cream: "#f6efe0",
  creamDeep: "#ece0c4",
  ink: "#1f1913",
  inkSoft: "#5b4f40",
  gold: "#b8862b",
  goldLight: "#e3c06b",
  starOff: "#d9ccb0",
};

// Timing in frames (30 fps)
const STAR_START = 12;
const STAR_GAP = 7;
const TEXT_START = 52;
const FRAMES_PER_WORD = 4;
const HOLD_AFTER_TEXT = 150; // 5 s so the end card is readable
const MIN_DURATION = 300; // 10 s

const words = (testo: string) => testo.trim().split(/\s+/);
const textEnd = (testo: string) => TEXT_START + words(testo).length * FRAMES_PER_WORD;

export const calculateRecensioneMetadata: CalculateMetadataFunction<RecensioneProps> = ({ props }) => ({
  durationInFrames: Math.max(MIN_DURATION, textEnd(props.testo) + HOLD_AFTER_TEXT),
});

const Star: React.FC<{ index: number; filled: boolean }> = ({ index, filled }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = STAR_START + index * STAR_GAP;
  const pop = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 160 } });
  const glow = interpolate(frame - start, [0, 6, 22], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lit = filled && frame >= start;

  return (
    <svg
      width={78}
      height={78}
      viewBox="0 0 24 24"
      style={{
        transform: `scale(${lit ? 0.6 + pop * 0.4 : 0.9})`,
        filter: lit ? `drop-shadow(0 0 ${glow * 14}px ${colors.goldLight})` : undefined,
      }}
    >
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
        fill={lit ? colors.gold : colors.starOff}
      />
    </svg>
  );
};

export const Recensione: React.FC<RecensioneProps> = ({ testo, autore, stelle, brand }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const list = words(testo);
  const end = textEnd(testo);
  const ease = Easing.out(Easing.cubic);

  const fadeIn = (start: number, length = 18) =>
    interpolate(frame, [start, start + length], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

  const labelIn = 1; // visible from frame 0: it is the post's cover
  const quoteIn = 1;
  const authorIn = fadeIn(end + 6);
  // Brand is on the cover from frame 0; the rule draws in once the review is read
  const ruleWidth = interpolate(frame, [end + 12, end + 36], [0, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const brandIn = 1;
  const breathe = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  const rating = Math.max(0, Math.min(5, Math.round(stelle)));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, ${colors.cream} 0%, ${colors.creamDeep} 100%)`,
        alignItems: "center",
        fontFamily: "EB Garamond, serif",
        color: colors.ink,
      }}
    >
      <div style={{ position: "absolute", top: 44, left: 44, right: 44, bottom: 44, border: `2px solid ${colors.gold}`, opacity: 0.5 * labelIn }} />

      <div
        style={{
          marginTop: 118,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "0.32em",
          color: colors.inkSoft,
          opacity: labelIn,
        }}
      >
        COSA DICONO DI NOI
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} index={i} filled={i < rating} />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          marginTop: 84,
          width: 860,
          textAlign: "center",
          transform: `scale(${breathe})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 6,
            top: -112,
            fontFamily: "Playfair Display, serif",
            fontWeight: 700,
            fontSize: 180,
            lineHeight: 1,
            color: colors.gold,
            opacity: 0.35 * quoteIn,
          }}
        >
          “
        </div>
        <p
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: list.length > 40 ? 44 : list.length > 26 ? 50 : 60, // long reviews shrink to stay above the brand
            lineHeight: 1.32,
            margin: 0,
          }}
        >
          {list.map((word, i) => {
            const start = TEXT_START + i * FRAMES_PER_WORD;
            const p = spring({ frame: frame - start, fps, config: { damping: 200 }, durationInFrames: 14 });
            return (
              <span
                key={i}
                style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 18}px)`, marginRight: "0.26em" }}
              >
                {word}
              </span>
            );
          })}
        </p>
        <div
          style={{
            marginTop: 34,
            fontSize: 36,
            fontWeight: 500,
            color: colors.inkSoft,
            opacity: authorIn,
            transform: `translateY(${(1 - authorIn) * 12}px)`,
          }}
        >
          — {autore}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 108, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: ruleWidth, height: 2, background: colors.gold, marginBottom: 26 }} />
        <div
          style={{
            fontFamily: "Playfair Display, serif",
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: "0.22em",
            color: colors.gold,
            opacity: brandIn,
          }}
        >
          {brand}
        </div>
      </div>
    </AbsoluteFill>
  );
};
