// src/pages/game/GamePage.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveGame, clearActiveGame } from "../../app/store/activeGameSlice";

const BG = "#262626";
const GOLD = "#F5C97A";
const BROWN = "#6E441A";

type Mode = "quick" | "ranked" | "private" | "ai" | undefined;

export default function GamePage() {
  const navigate = useNavigate();
  const loc = useLocation() as { state?: { mode?: Mode } };
  const mode: Mode = loc.state?.mode;
  const dispatch = useDispatch();

  useEffect(() => {
    // Use a real match id from your backend; stubbed here:
    const matchId = "ABC-123";
    const mode = (history.state?.usr?.mode ?? "quick") as any; // or from location.state
    dispatch(setActiveGame({ id: matchId, mode }));

    return () => {
      // Only clear if you truly end the match here; if you want to persist across navigation,
      // move clearActiveGame() to your "Resign/End" action instead.
      // dispatch(clearActiveGame());
    };
  }, [dispatch]);

  return (
    <div className="h-full min-h-0 flex flex-col" style={{ background: BG, color: "#E9EDF3" }}>
 
      {/* Main area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3 p-3">
        {/* Board area */}
        <div className="min-h-0 rounded-2xl border border-white/10 bg-black/10 p-3 flex flex-col">
          {/* Board header */}
          <div className="mb-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <PlayerPill name="You" score={142} self />
              <span className="text-white/50">vs</span>
              <PlayerPill name="Ava" score={137} />
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs">
              Bag: 34 tiles
            </div>
          </div>

          {/* Board canvas placeholder */}
          <div className="flex-1 min-h-0">
            <div
              className="h-full w-full rounded-xl ring-1 ring-white/10 shadow-inner grid place-items-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.03) 25%, transparent 25%) 0 0/24px 24px, linear-gradient(225deg, rgba(255,255,255,0.03) 25%, transparent 25%) 0 0/24px 24px, linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%) 0 0/24px 24px, linear-gradient(315deg, rgba(255,255,255,0.03) 25%, transparent 25%) 0 0/24px 24px",
              }}
            >
              <span className="text-white/50 text-sm">Board goes here (Pixi/Canvas/DOM)</span>
            </div>
          </div>

          {/* Rack + controls */}
          <div className="mt-3 flex items-center gap-2">
            <RackTile letter="A" points={1} />
            <RackTile letter="E" points={1} />
            <RackTile letter="R" points={1} />
            <RackTile letter="T" points={1} />
            <RackTile letter="Q" points={10} />
            <RackTile letter="L" points={1} />
            <RackTile letter="N" points={1} />
            <div className="ml-auto flex items-center gap-2">
              <button className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-sm hover:bg-black/30">
                Shuffle
              </button>
              <button className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-sm hover:bg-black/30">
                Exchange
              </button>
              <button
                className="rounded-lg border border-[color:var(--brown)]/40 bg-[color:var(--gold)] px-3 py-1.5 text-sm font-semibold text-[color:var(--brown)] shadow-[inset_0_0_0_1px_rgba(0,0,0,.1)] hover:brightness-95"
                style={{ ["--gold" as any]: GOLD, ["--brown" as any]: BROWN }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="min-h-0 flex flex-col gap-3">
          {/* Moves / score */}
          <div className="flex-1 min-h-0 rounded-2xl border border-white/10 bg-black/10 p-3 flex flex-col">
            <div className="mb-2 text-sm font-semibold text-[#F5C97A]">Moves</div>
            <div className="relative flex-1 min-h-0">
              <div
                className="h-full overflow-y-auto rounded-lg ring-1 ring-white/10 shadow-inner
                           [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-12px),transparent)]
                           [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-12px),transparent)]"
              >
                <ul className="space-y-1 text-sm">
                  {MOCK_MOVES.map((m, i) => (
                    <li key={i} className="flex items-center justify-between rounded px-2 py-1 hover:bg-white/5">
                      <span className="text-white/80">{m.player}</span>
                      <span className="font-mono text-white/70">{m.word}</span>
                      <span className="text-white/60">+{m.points}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Chat preview (compact) */}
          <div className="h-40 rounded-2xl border border-white/10 bg-black/10 p-3 flex flex-col">
            <div className="mb-2 text-sm font-semibold text-[#F5C97A]">Table Chat</div>
            <div className="flex-1 min-h-0 overflow-y-auto text-sm space-y-1">
              <div className="text-white/80"><b>Ava:</b> Gl & hf!</div>
              <div className="text-white/80"><b>You:</b> Have fun! 👍</div>
              <div className="text-white/80"><b>Ava:</b> Nice open.</div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm placeholder:text-white/50 focus:outline-none"
                placeholder="Type…"
              />
              <button className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm hover:bg-black/30">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */
function PlayerPill({ name, score, self = false }: { name: string; score: number; self?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs ${
        self ? "border-[color:var(--brown)]/40 bg-[color:var(--gold)] text-[color:var(--brown)]"
             : "border-white/10 bg-black/20 text-white/90"
      }`}
      style={{ ["--gold" as any]: GOLD, ["--brown" as any]: BROWN }}
    >
      <span className="font-semibold">{name}</span>
      <span className="rounded bg-black/20 px-1.5 py-0.5 font-mono">{score}</span>
    </span>
  );
}

function RackTile({ letter, points }: { letter: string; points: number }) {
  return (
    <div
      className="relative grid h-10 w-10 place-items-center rounded-lg border text-lg font-extrabold shadow-md"
      style={{
        background: GOLD,
        color: BROWN,
        borderColor: "#6E441A33",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.25), 0 6px 12px rgba(0,0,0,.25)",
      }}
      aria-label={`Tile ${letter} worth ${points} points`}
    >
      <span>{letter}</span>
      <span className="absolute bottom-0.5 right-1 text-[10px] font-bold opacity-80">{points}</span>
    </div>
  );
}

function labelForMode(m: Mode) {
  switch (m) {
    case "quick": return "Quick Match";
    case "ranked": return "Ranked";
    case "private": return "Private Room";
    case "ai": return "VS AI";
    default: return "Unranked";
  }
}

const MOCK_MOVES = [
  { player: "You", word: "LATER", points: 18 },
  { player: "Ava", word: "QUIZ", points: 44 },
  { player: "You", word: "NODE", points: 9 },
  { player: "Ava", word: "PIXEL", points: 22 },
  { player: "You", word: "REACT", points: 13 },
];
