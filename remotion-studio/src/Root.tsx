import { Composition } from "remotion";
import { HelloVideo } from "./HelloVideo";
import { calculateRecensioneMetadata, Recensione } from "./cortedoro/Recensione";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HelloVideo"
      component={HelloVideo}
      durationInFrames={120}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ title: "Setup verified ✓" }}
    />
    <Composition
      id="CortedoroRecensione"
      component={Recensione}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1080}
      calculateMetadata={calculateRecensioneMetadata}
      defaultProps={{
        testo: "Un posto speciale: accoglienza impeccabile e ogni dettaglio curato con passione. Torneremo sicuramente!",
        autore: "Cliente di esempio",
        stelle: 5,
        brand: "CORTEDORO",
      }}
    />
  </>
);
