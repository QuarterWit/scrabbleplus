import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Section from "../../../components/ui/Section";

/** Theme */
const BG = "#262626";
const GOLD = "#F5C97A";
const BROWN = "#6E441A";

type Msg = {
  id: string;
  author: string;          // "You" for self
  text: string;
  ts: number;              // Date.now()
};

export default function LobbyChat() {
  // --- Demo messages ---
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    mkMsg("Ava", "Anyone up for a quick game?"),
    mkMsg("Ben", "Invite me!"),
    mkMsg("Chloe", "GG on the last match 👍"),
    mkMsg("Drew", "Let’s do ranked in 5."),
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);           // someone else typing (demo)
  const [showNewPill, setShowNewPill] = useState(false);

  // --- Refs / scroll state ---
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const atBottomRef = useRef(true);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  // --- Helpers ---
  const canSend = input.trim().length > 0;

  // Fake "others typing" for demo
  useEffect(() => {
    const t1 = setTimeout(() => setIsTyping(true), 1200);
    const t2 = setTimeout(() => setIsTyping(false), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [msgs.length]);

  const recomputeShadows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const canScroll = scrollHeight > clientHeight + 1;
    setShowTopShadow(canScroll && scrollTop > 0);
    setShowBottomShadow(canScroll && scrollTop + clientHeight < scrollHeight - 1);
    atBottomRef.current = scrollTop + clientHeight >= scrollHeight - 2;
  }, []);

  const scrollToBottom = useCallback((smooth = false) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Attach scroll + resize observers
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const before = atBottomRef.current;
      recomputeShadows();
      if (!atBottomRef.current && before) setShowNewPill(false);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      // if near bottom, keep pinned; else show pill
      const wasAtBottom = atBottomRef.current;
      recomputeShadows();
      if (wasAtBottom) scrollToBottom();
      else setShowNewPill(true);
    });
    ro.observe(el);
    if (el.firstElementChild instanceof HTMLElement) ro.observe(el.firstElementChild);
    requestAnimationFrame(recomputeShadows);
    return () => { el.removeEventListener("scroll", onScroll); ro.disconnect(); };
  }, [recomputeShadows, scrollToBottom]);

  // Auto-scroll when messages change (if pinned)
  useEffect(() => {
    if (atBottomRef.current) scrollToBottom();
    requestAnimationFrame(recomputeShadows);
  }, [msgs.length, scrollToBottom, recomputeShadows]);

  // Send
  const send = () => {
    if (!canSend) return;
    setMsgs((m) => [...m, mkMsg("You", input.trim())]);
    setInput("");
    // demo: simulate reply
    setTimeout(() => {
      setMsgs((m) => [...m, mkMsg("Ava", "Sent you an invite!")]);
    }, 800);
  };

  // Enter to send, Shift+Enter newline
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Auto-resize textarea
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; // cap height
  }, [input]);

  // Group by time/author (simple)
  const withDividers = useMemo(() => groupWithDividers(msgs), [msgs]);

  return (
    <Section id="chat">
      <div className="flex w-full h-full min-h-0 flex-col rounded-2xl p-4 md:p-6" style={{ background: BG, color: "#E9EDF3" }}>
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-3 shrink-0">
          <div className="text-lg font-bold text-[color:var(--gold)]" style={{ ["--gold" as any]: GOLD }}>
            Lobby Chat
          </div>
          <div className="text-xs opacity-70">Public • Be nice 🙂</div>
        </div>

        {/* Scroll area */}
        <div className="relative flex-1 min-h-0">
          <div
            ref={scrollerRef}
            className={`
              h-full overflow-y-auto rounded-xl ring-1 ring-white/10 shadow-inner
              [mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]
              [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]
            `}
          >
            <ul className="flex flex-col gap-2 px-3 py-2">
              {withDividers.map((row) =>
                row.kind === "divider" ? (
                  <DateDivider key={row.key} ts={row.ts} />
                ) : (
                  <ChatBubble
                    key={row.msg.id}
                    author={row.msg.author}
                    text={row.msg.text}
                    ts={row.msg.ts}
                    self={row.msg.author === "You"}
                  />
                )
              )}
              {isTyping && <TypingRow />}
            </ul>
          </div>

          {/* New messages pill */}
          {showNewPill && (
            <button
              onClick={() => { scrollToBottom(true); setShowNewPill(false); }}
              className="absolute left-1/2 -translate-x-1/2 bottom-16 rounded-full bg-[color:var(--gold)] px-3 py-1 text-xs font-semibold text-[color:var(--brown)] shadow-md"
              style={{ ["--gold" as any]: GOLD, ["--brown" as any]: BROWN }}
            >
              New messages
            </button>
          )}

          {/* Top/Bottom shadows */}
          <EdgeShadow show={showTopShadow} top />
          <EdgeShadow show={showBottomShadow} />
        </div>

        {/* Composer */}
        <div className="mt-3 flex items-end gap-2 rounded-xl border border-white/10 bg-black/20 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] shrink-0">
          <button
            title="Emoji"
            className="rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-sm hover:bg-black/30"
          >
            😊
          </button>
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message… (Enter to send • Shift+Enter for newline)"
            className="max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm placeholder:text-white/50 focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!canSend}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] transition
                        ${canSend
                          ? "border-[color:var(--brown)]/40 bg-[color:var(--gold)] text-[color:var(--brown)] hover:brightness-95"
                          : "border-white/10 bg-black/20 text-white/50 cursor-not-allowed"}`}
            style={{ ["--gold" as any]: GOLD, ["--brown" as any]: BROWN }}
          >
            Send
          </button>
        </div>
      </div>
    </Section>
  );
}

/* ----------------- Subcomponents ----------------- */

function EdgeShadow({ show, top = false }: { show: boolean; top?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${top ? "top-0 h-6 rounded-t-xl" : "bottom-0 h-6 rounded-b-xl"} transition-opacity duration-150 ${show ? "opacity-100" : "opacity-0"}`}
      style={{
        background: top
          ? "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0))"
          : "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0))",
      }}
    />
  );
}

function ChatBubble({ author, text, ts, self }: { author: string; text: string; ts: number; self: boolean }) {
  return (
    <li className={`flex items-start gap-2 ${self ? "justify-end" : ""}`}>
      {!self && <Avatar letter={first(author)} />}
      <div className={`max-w-[80%] rounded-2xl border px-3 py-2 text-sm shadow-sm
                       ${self
                         ? "border-[color:var(--brown)]/40 bg-[color:var(--gold)] text-[color:var(--brown)]"
                         : "border-white/10 bg-black/30 text-white/90"}`}
           style={{ ["--gold" as any]: GOLD, ["--brown" as any]: BROWN }}>
        {!self && <div className="mb-0.5 text-[11px] font-semibold opacity-80">{author}</div>}
        <div className="whitespace-pre-wrap">{text}</div>
        <div className={`mt-1 text-[10px] ${self ? "text-[color:var(--brown)]/70" : "text-white/50"}`} style={{ ["--brown" as any]: BROWN }}>
          {time(ts)}
        </div>
      </div>
      {self && <Avatar letter={first(author)} self />}
    </li>
  );
}

function Avatar({ letter, self = false }: { letter: string; self?: boolean }) {
  return (
    <span
      className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-extrabold shadow-sm
                  ${self
                    ? "border-[color:var(--brown)]/40 bg-[color:var(--gold)] text-[color:var(--brown)]"
                    : "border-[color:var(--brown)]/30 bg-[color:var(--gold)]/90 text-[color:var(--brown)]"}`}
      style={{ ["--gold" as any]: GOLD, ["--brown" as any]: BROWN }}
      aria-hidden
    >
      {letter}
    </span>
  );
}

function TypingRow() {
  return (
    <li className="flex items-center gap-2">
      <Avatar letter="A" />
      <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90">
        <TypingDots />
      </div>
    </li>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <Dot delay="0ms" />
      <Dot delay="120ms" />
      <Dot delay="240ms" />
    </span>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full opacity-70 animate-bounce"
      style={{ animationDelay: delay, background: GOLD }}
    />
  );
}

function DateDivider({ ts }: { ts: number }) {
  return (
    <li className="my-1 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/10" />
      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] text-white/60">
        {new Date(ts).toLocaleDateString()}
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </li>
  );
}

/* ----------------- Utils ----------------- */

function mkMsg(author: string, text: string): Msg {
  return { id: Math.random().toString(36).slice(2), author, text, ts: Date.now() };
}

function first(s: string) { return (s?.[0] || "?").toUpperCase(); }

function time(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function groupWithDividers(list: Msg[]): Array<{ kind: "divider"; key: string; ts: number } | { kind: "msg"; msg: Msg }> {
  const out: any[] = [];
  let lastDay = "";
  for (const m of list) {
    const day = new Date(m.ts).toDateString();
    if (day !== lastDay) {
      out.push({ kind: "divider", key: "div-" + day, ts: m.ts });
      lastDay = day;
    }
    out.push({ kind: "msg", msg: m });
  }
  return out;
}
