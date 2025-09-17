// src/pages/landing/sections/Hero.tsx
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import Stat from "../../../components/ui/Stat";
import ScrabbleTitlePixi from "../../../components/composites/ScrabbleTitlePixi";

export default function Hero() {
  return (
    <Section id="hero" className="gap-4" >
       {/* The animated title */}
      <div >
        <ScrabbleTitlePixi baseTileSize={58} minTileSize={30} tileScale={0.9} height={80} tileShadow={false}  text="SCRABBLE+"/>
      </div>

      <div className="flex gap-3">
        <Button variant="pressable" className="" >Play Now</Button>
      </div>

      <div className="flex gap-6">
        <Stat label="playing now" value="3,142" />
        <Stat label="games today" value="28k" />
        <Stat label="avg queue" value="<10s" />
      </div>
    </Section>
  );
}
