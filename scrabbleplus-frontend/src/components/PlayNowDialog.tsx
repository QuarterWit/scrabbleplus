import React from "react";

type Mode = "quick" | "ranked" | "private" | "ai";

export default function PlayNowDialog(props: {
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onContinueAsGuest: () => void;
  onSelectMode: (mode: Mode) => void;
}) {
  const { open, onClose, isLoggedIn, onLogin, onContinueAsGuest, onSelectMode } = props;
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // focus trap
  const firstBtnRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    if (open) firstBtnRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100]"
      aria-modal="true"
      role="dialog"
      aria-labelledby="playnow-title"
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#262626] p-5 text-[#E9EDF3] shadow-2xl ring-1 ring-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 id="playnow-title" className="text-lg font-bold text-[#F5C97A]">Play Now</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm hover:bg-black/30"
            >
              ✕
            </button>
          </div>

          {/* Auth Gate */}
          {!isLoggedIn ? (
            <div className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 text-sm text-white/80">
                You’re not logged in. Choose:
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  ref={firstBtnRef}
                  onClick={onLogin}
                  className="flex-1 rounded-xl border border-[#6E441A]/40 bg-[#F5C97A] px-4 py-2 text-sm font-semibold text-[#6E441A] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:brightness-95"
                >
                  Log In / Sign Up
                </button>
                <button
                  onClick={onContinueAsGuest}
                  className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm hover:bg-black/30"
                >
                  Continue as AI Guest
                </button>
              </div>
              <div className="mt-2 text-[11px] text-white/50">
                Guest mode: quick solo vs AI, limited features.
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-xl border border-white/10 bg-black/10 p-3">
              <div className="text-sm text-white/80">Welcome back! Choose a mode:</div>
            </div>
          )}

          {/* Modes */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ModeCard
              title="Quick Match"
              subtitle="Fast queue, casual"
              icon="⚡"
              onClick={() => onSelectMode("quick")}
            />
            <ModeCard
              title="Ranked"
              subtitle="MMR, leaderboard"
              icon="🏆"
              onClick={() => onSelectMode("ranked")}
            />
            <ModeCard
              title="Private Room"
              subtitle="Invite friends"
              icon="🔒"
              onClick={() => onSelectMode("private")}
            />
            <ModeCard
              title="VS AI"
              subtitle="Solo practice"
              icon="🤖"
              onClick={() => onSelectMode("ai")}
            />
          </div>

          {/* Footer actions */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-[11px] text-white/50">
              Be fair. No cheating or offensive language.
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm hover:bg-black/30"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mode card button */
function ModeCard(props: { title: string; subtitle: string; icon: string; onClick: () => void }) {
  const { title, subtitle, icon, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-left transition hover:border-[#F5C97A]/40 hover:bg-black/30"
    >
      <div
        className="grid h-12 w-12 place-items-center rounded-xl border text-xl font-extrabold shadow-sm"
        style={{ background: "#F5C97A", color: "#6E441A", borderColor: "#6E441A33" }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-white/70">{subtitle}</div>
      </div>
      <span className="translate-x-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
        ➜
      </span>
    </button>
  );
}
