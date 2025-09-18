import Hero from "./sections/Hero";
import QuickStart from "./sections/QuickStart";
import LiveNow from "./sections/LiveNow";
import OnlinePlayers from "./sections/OnlinePlayers";
import LobbyChat from "./sections/LobbyChat";
import GameModes from "./sections/GameModes";
import Competitive from "./sections/Competitive";
import Footer from "./sections/Footer";

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Hero: 3 parts */}
      <div className="min-h-0">
        <Hero />
      </div>

      {/* Middle: 6 parts */}
      <div className="flex-[6] min-h-0 flex ">
        {/* OnlinePlayers scrolls */}
        <div className="basis-1/2 min-h-0 flex">
            <OnlinePlayers />
        </div>

        {/* LobbyChat stays fixed (no overflow set) */}
        <div className="basis-1/2 min-h-0">
          <LobbyChat />
        </div>
      </div>

      {/* Footer: 1 part */}
      <div className="flex-[0.5] h-full">
        <Footer />
      </div>
    </div>
  );
}

