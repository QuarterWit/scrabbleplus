// src/pages/landing/sections/Hero.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import Stat from "../../../components/ui/Stat";
import ScrabbleTitlePixi from "../../../components/composites/ScrabbleTitlePixi";
import PlayNowDialog from "../../../components/PlayNowDialog";

export default function Hero() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const isLoggedIn = false; // TODO
  const navigate = useNavigate();

  return (
    <Section id="hero" className="gap-4">
      <div>
        <ScrabbleTitlePixi baseTileSize={58} minTileSize={30} tileScale={0.9} height={80} tileShadow={false} text="SCRABBLE+" />
      </div>

      <div className="flex gap-3">
        <Button variant="pressable" onClick={() => setDialogOpen(true)}>Play Now</Button>
      </div>

      <div className="flex gap-6">
        <Stat label="playing now" value="3,142" />
        <Stat label="games today" value="28k" />
        <Stat label="avg queue" value="<10s" />
      </div>

      <PlayNowDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogin={() => { /* TODO: login */ }}
        onContinueAsGuest={() => {
          // route to /game with AI mode
          setDialogOpen(false);
          navigate("/game", { state: { mode: "ai" } });
        }}
        onSelectMode={(mode) => {
          setDialogOpen(false);
          navigate("/game", { state: { mode } });
        }}
      />
    </Section>
  );
}
