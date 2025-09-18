// src/components/Header.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearActiveGame, selectActiveGame } from "../app/store/activeGameSlice";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onGame = pathname.startsWith("/game");
  const active = useSelector(selectActiveGame);

  function handleResign() {
    // optional confirm
    if (!window.confirm("Resign current game and return to Lobby?")) return;
    dispatch(clearActiveGame());
    navigate("/"); // back to Landing
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/10"
            style={{ background: "#262626", color: "#E9EDF3" }}>
      {/* Left: Brand */}
      <button onClick={() => navigate("/")} className="flex items-center gap-2 min-w-[180px]">
        <div className="grid h-10 w-10 place-items-center rounded-lg border text-xl font-extrabold"
             style={{ background:"#F5C97A", color:"#6E441A", borderColor:"#6E441A33" }}>S</div>
        <span className="text-lg font-bold">ScrabblePlus</span>
      </button>

      {/* Center nav (hide on game) */}
      <nav className={`hidden md:flex items-center gap-6 text-sm ${onGame ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <a href="#players" className="hover:text-[#F5C97A]">Players</a>
        <a href="#chat" className="hover:text-[#F5C97A]">Chat</a>
        <a href="#modes" className="hover:text-[#F5C97A]">Game Modes</a>
        <a href="#competitive" className="hover:text-[#F5C97A]">Competitive</a>
      </nav>

      {/* Right actions */}
      <div className="min-w-[260px] flex justify-end items-center gap-2">
        {/* Show Resume when not on /game but a match exists */}
        {active && !onGame && (
          <>
            <span className="hidden sm:inline rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/70">
              In match <b className="font-mono">{active.id}</b>
            </span>
            <button
              onClick={() => navigate("/game", { state: { mode: active.mode } })}
              className="rounded-lg border border-[#6E441A]/40 bg-[#F5C97A] px-3 py-1.5 text-sm font-semibold text-[#6E441A] hover:brightness-95"
            >
              Resume →
            </button>
          </>
        )}

        {/* On game: back + resign */}
        {onGame && (
          <>
            <button
              onClick={() => navigate("/")}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-sm hover:bg-black/30"
            >
              ← Lobby
            </button>
            <button
              onClick={handleResign}
              className="rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-1.5 text-sm font-semibold text-red-300 hover:bg-red-500/30"
            >
              Resign
            </button>
          </>
        )}

        {/* If no active game and not on game: login/profile as you had */}
        {!active && !onGame && (
          <button className="rounded-xl border border-[#6E441A]/40 bg-[#F5C97A] px-4 py-2 text-sm font-semibold text-[#6E441A] hover:brightness-95">
            Log In
          </button>
        )}
      </div>
    </header>
  );
}
