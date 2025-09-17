import React, { useEffect, useMemo, useRef, useState } from "react";
import Section from "../../../components/ui/Section";

/**
 * Scrabble-themed Online Players section
 * Edge-shadows + fade mask on scroll
 */

export default function OnlinePlayers() {
  // --- UI State ---
  const [tab, setTab] = useState("all"); // all | friends | nearby
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // rating | games | winrate | recent | name
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [rankFilter, setRankFilter] = useState(new Set<string>());

  // --- Mock Data ---
  const players = useMemo(
    () => [
      mkPlayer(1, "Ava Lin", 1860, 420, 260, 8, true, true, 1.2, "Gold"),
      mkPlayer(2, "Ben Ortiz", 1490, 300, 150, 58, false, true, 3.8, "Silver"),
      mkPlayer(3, "Chloe Park", 2010, 880, 560, 2, true, false, 0.6, "Platinum"),
      mkPlayer(4, "Drew Singh", 1725, 640, 360, 1440, false, false, 12.4, "Gold"),
      mkPlayer(5, "Eli Zhang", 2140, 1200, 820, 30, true, true, 0.3, "Diamond"),
      mkPlayer(6, "Faye Kim", 1320, 150, 60, 5, true, false, 22.9, "Bronze"),
      mkPlayer(7, "Gus Reed", 1585, 505, 255, 300, false, true, 7.1, "Silver"),
      mkPlayer(8, "Hana Noor", 1965, 710, 445, 18, true, false, 2.2, "Platinum"),
      mkPlayer(9, "Ivan Petrov", 1210, 98, 40, 2880, false, false, 4.0, "Bronze"),
      mkPlayer(10, "Jiya Rao", 1675, 333, 199, 1, true, true, 0.7, "Gold"),
      mkPlayer(11, "Kai Okada", 2270, 1410, 980, 120, true, false, 15.0, "Grandmaster"),
      mkPlayer(12, "Liam Patel", 1410, 220, 110, 720, false, true, 6.3, "Silver"),
    ],
    []
  );

  // --- Derived List ---
  const visible = useMemo(() => {
    let list = [...players];
    if (tab === "friends") list = list.filter((p) => p.isFriend);
    if (tab === "nearby") list = list.filter((p) => p.distanceKm <= 5);
    if (onlineOnly) list = list.filter((p) => p.isOnline);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (rankFilter.size) list = list.filter((p) => rankFilter.has(p.rank));
    list.sort((a, b) => compareBy(sortBy, a, b));
    return list;
  }, [players, tab, query, sortBy, onlineOnly, rankFilter]);

  const allRanks = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Grandmaster"];

  const scrollerRef = useRef<HTMLDivElement | null>(null);
const [showTopShadow, setShowTopShadow] = useState(false);
const [showBottomShadow, setShowBottomShadow] = useState(false);

const recomputeShadows = React.useCallback(() => {
  const el = scrollerRef.current;
  if (!el) return;
  const { scrollTop, scrollHeight, clientHeight } = el;
  // hide when no scroll needed
  const canScroll = scrollHeight > clientHeight + 1;
  setShowTopShadow(canScroll && scrollTop > 0);
  setShowBottomShadow(canScroll && scrollTop + clientHeight < scrollHeight - 1);
}, []);

useEffect(() => {
  const el = scrollerRef.current;
  if (!el) return;

  const onScroll = () => recomputeShadows();
  el.addEventListener("scroll", onScroll, { passive: true });

  // observe layout/content changes
  const ro = new ResizeObserver(() => recomputeShadows());
  ro.observe(el);
  if (el.firstElementChild instanceof HTMLElement) ro.observe(el.firstElementChild);

  // initial compute
  requestAnimationFrame(recomputeShadows);

  return () => {
    el.removeEventListener("scroll", onScroll);
    ro.disconnect();
  };
}, [recomputeShadows]);

// When filters/results change: reset scroll + recompute after paint
useEffect(() => {
  const el = scrollerRef.current;
  if (!el) return;
  el.scrollTop = 0;
  requestAnimationFrame(recomputeShadows);
}, [
  tab,
  query,
  sortBy,
  onlineOnly,
  // rankFilter is a Set; use size so deps actually change
  rankFilter.size,
  visible.length,
]);


  return (
    <Section id="players">
      <div
        className="flex h-full min-h-0 flex-col rounded-2xl p-4 md:p-6"
        style={{ background: "#262626", color: "#E9EDF3" }}
      >
        {/* Controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between shrink-0">
          <div className="flex gap-2">
            <TabButton active={tab === "all"} onClick={() => setTab("all")}>All</TabButton>
            <TabButton active={tab === "friends"} onClick={() => setTab("friends")}>Friends</TabButton>
            <TabButton active={tab === "nearby"} onClick={() => setTab("nearby")}>Nearby</TabButton>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search players"
                className="w-56 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#F5C97A]"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="h-4 w-4 accent-[#F5C97A]"
                />
                Online only
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs opacity-70">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C97A]"
              >
                <option value="rating">Rating (desc)</option>
                <option value="games">Games played</option>
                <option value="winrate">Win rate</option>
                <option value="recent">Recently active</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            <button
              onClick={() => {
                setTab("all");
                setQuery("");
                setSortBy("rating");
                setOnlineOnly(false);
                setRankFilter(new Set());
              }}
              className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-sm hover:bg-black/20"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Rank Filter Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs opacity-70">Ranks</span>
          {allRanks.map((r) => (
            <ToggleChip
              key={r}
              active={rankFilter.has(r)}
              onClick={() => toggleRank(rankFilter, setRankFilter, r)}
            >
              <RankBadge rank={r} />
            </ToggleChip>
          ))}
        </div>

        {/* Count */}
        <div className="mt-3 text-xs opacity-70 shrink-0">
          {visible.length} player{visible.length !== 1 ? "s" : ""} shown
        </div>

        {/* Scroll area with fade mask + inner shadows */}
        <div className="relative mt-4 flex-1 min-h-0">
          <div
            ref={scrollerRef}
            className={`
              h-full overflow-y-auto no-scrollbar rounded-xl ring-1 ring-white/10 shadow-inner
              [mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]
              [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]
            `}
          >
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 p-0 m-0">
              {visible.map((p) => (
                <li
                  key={p.id}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/10 p-3 transition
                             hover:border-[#F5C97A]/40 hover:bg-black/20 will-change-transform"
                >
                  <div className="flex items-center gap-3">
                    <ScrabbleTile letter={firstLetter(p.name)} points={tilePoints(firstLetter(p.name))} />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold" style={{ color: "#E9EDF3" }}>{p.name}</span>
                        {p.isOnline ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-medium text-green-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-300" /> Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
                            Last {formatLastSeen(p.lastSeenMin)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs opacity-80">
                        <RankBadge rank={p.rank} />
                        <span>⭐ {p.rating}</span>
                        <span>🎮 {p.games} games</span>
                        <span>🏆 {winRate(p).toFixed(0)}% WR</span>
                        {typeof p.distanceKm === "number" && <span>📍 {p.distanceKm.toFixed(1)} km</span>}
                        {p.isFriend && (
                          <span className="rounded-full bg-[#F5C97A]/15 px-2 py-0.5 text-[10px] font-medium text-[#F5C97A]">
                            Friend
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="rounded-xl border border-[#6E441A]/40 bg-[#F5C97A] px-3 py-2 text-sm font-semibold text-[#6E441A] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] transition hover:brightness-95">
                      Challenge
                    </button>
                    {!p.isFriend && (
                      <button className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm transition hover:bg-black/30">
                        Add friend
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top/Bottom shadow caps (match parent bg) */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-6 rounded-t-xl transition-opacity duration-150
                       ${showTopShadow ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0))" }}
          />
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 rounded-b-xl transition-opacity duration-150
                        ${showBottomShadow ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0))" }}
          />
        </div>
      </div>
    </Section>
  );
}

/* ---------- Helpers & subcomponents ---------- */

function mkPlayer(
  id: number,
  name: string,
  rating: number,
  games: number,
  wins: number,
  lastSeenMin: number,
  isOnline: boolean,
  isFriend: boolean,
  distanceKm: number,
  rank: string
) {
  return { id, name, rating, games, wins, lastSeenMin, isOnline, isFriend, distanceKm, rank };
}

function firstLetter(name: string) {
  return (name?.[0] || "?").toUpperCase();
}

function tilePoints(letter: string) {
  const map: Record<string, number> = {
    A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
    N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
  };
  return map[letter] ?? 1;
}

function formatLastSeen(min: number) {
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function winRate(p: any) {
  return (p.wins / Math.max(1, p.games)) * 100;
}

function compareBy(key: string, a: any, b: any) {
  switch (key) {
    case "rating": return b.rating - a.rating;
    case "games": return b.games - a.games;
    case "winrate": return winRate(b) - winRate(a);
    case "recent": return a.lastSeenMin - b.lastSeenMin;
    case "name": return a.name.localeCompare(b.name);
    default: return 0;
  }
}

function toggleRank(currentSet: Set<string>, setSet: (s: Set<string>) => void, value: string) {
  const next = new Set(currentSet);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  setSet(next);
}

function TabButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#F5C97A] text-[#6E441A] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
          : "border border-white/10 bg-black/10 text-white/90 hover:bg-black/20"
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function ToggleChip({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] transition ${
        active
          ? "bg-[#F5C97A]/20 text-[#F5C97A] border border-[#F5C97A]/40"
          : "bg-white/5 text-white/80 border border-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function RankBadge({ rank }: { rank: string }) {
  const swatch = rankColor(rank);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{
        background: `${swatch.bg}`,
        color: `${swatch.fg}`,
        border: `1px solid ${swatch.border}`,
      }}
    >
      {rank}
    </span>
  );
}

function rankColor(rank: string) {
  switch (rank) {
    case "Bronze": return { bg: "#5a3e2a", fg: "#E9EDF3", border: "#8b5a3c" };
    case "Silver": return { bg: "#606c78", fg: "#E9EDF3", border: "#8a98a6" };
    case "Gold": return { bg: "#6E441A", fg: "#F5C97A", border: "#a0692a" };
    case "Platinum": return { bg: "#3c6c6f", fg: "#E9EDF3", border: "#5aa2a7" };
    case "Diamond": return { bg: "#2d3e78", fg: "#E9EDF3", border: "#4a63bb" };
    case "Grandmaster": return { bg: "#3b1f5e", fg: "#E9EDF3", border: "#6b3fa6" };
    default: return { bg: "#444", fg: "#E9EDF3", border: "#666" };
  }
}

function ScrabbleTile({ letter, points }: { letter: string; points: number }) {
  return (
    <div
      className="relative grid h-14 w-14 place-items-center rounded-xl border text-2xl font-extrabold shadow-md transition group-hover:rotate-[-1deg] group-hover:scale-[1.02]"
      style={{
        background: "#F5C97A",
        color: "#6E441A",
        borderColor: "#6E441A33",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.3), 0 6px 12px rgba(0,0,0,.25)",
      }}
      aria-label={`Tile ${letter} worth ${points} points`}
    >
      <span>{letter}</span>
      <span className="absolute bottom-1 right-1 text-[10px] font-bold opacity-80">{points}</span>
    </div>
  );
}
