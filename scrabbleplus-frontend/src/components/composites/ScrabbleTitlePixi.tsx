// src/components/composites/ScrabbleTitlePixi.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Application, useTick, useExtend } from "@pixi/react";
import {
  Container as PixiContainer,
  Graphics as PGraphics,
  Text as PixiText,
  Ticker,
} from "pixi.js";

/** Map Scrabble letter points (simplified) */
const POINTS: Record<string, number> = {
  A:1,B:3,C:3,D:2,E:1,F:4,G:2,H:4,I:1,J:8,K:5,L:1,M:3,N:1,O:1,P:3,
  Q:10,R:1,S:1,T:1,U:1,V:4,W:4,X:8,Y:4,Z:10,"+":0," ":0
};

type TileProps = {
  x: number;
  y: number;
  size: number;
  ch: string;
  tileShadow: boolean; // controls ONLY tile drop shadow
};

function Tile({ x, y, size, ch, tileShadow }: TileProps) {
  const radius = Math.max(8, size * 0.12);

  const drawFace = useCallback((g: PGraphics) => {
    g.clear();

    // Tile drop shadow (toggleable)
    if (tileShadow) {
      g.setFillStyle({ color: 0x000000, alpha: 0.18 });
      g.roundRect(6, 10, size, size, radius);
      g.fill();
    }

    // Face + border
    g.setFillStyle({ color: 0xf5c97a });
    g.setStrokeStyle({ width: 2, color: 0x8a5a24, alpha: 1 });
    g.roundRect(0, 0, size, size, radius);
    g.fill();
    g.stroke();
  }, [size, radius, tileShadow]);

  const letter = ch.toUpperCase();
  const pts = POINTS[letter] ?? 0;
  const fontFace = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

  return (
    <pixiContainer x={x} y={y}>
      <pixiGraphics draw={drawFace} />
      <pixiText
        text={letter}
        anchor={0.5}
        x={size * 0.5}
        y={size * 0.55}
        style={{
          fill: 0x1a1a1a,
          fontSize: Math.round(size * 0.56),
          fontWeight: "900",
          fontFamily: fontFace,
          letterSpacing: -1,
        }}
      />
      {/[A-Z]/.test(letter) && (
        <pixiText
          text={String(pts)}
          anchor={1}
          x={size - 6}
          y={size - 6}
          style={{
            fill: 0x2a2a2a,
            fontSize: Math.max(10, Math.round(size * 0.14)),
            fontWeight: "800",
            fontFamily: fontFace,
          }}
        />
      )}
    </pixiContainer>
  );
}

type SceneProps = {
  width: number;
  height: number;
  letters: string[];
  layout: { size: number; targets: Array<{ x: number; y: number }> };
  starts: Array<{ x: number; y: number }>;
  stepDelay: number;
  placeDuration: number;
  loop: boolean;

  // Slot realism/spacing knobs
  slotPadPct: number;   // air around tile inside slot (relative to tile size)
  slotGapPct: number;   // visual separation between slots (relative to tile size)
  wellInsetPct: number; // how far the inner "well" is inset (depth feel)

  // Tiles
  tileShadow: boolean;  // ONLY tiles' shadow
};

// ⬇️ This child is *inside* <Application>, so hooks have context
function PixiScene({
  width, height, letters, layout, starts, stepDelay, placeDuration, loop,
  slotPadPct, slotGapPct, wellInsetPct, tileShadow
}: SceneProps) {
  // Register Pixi classes (must be inside App context)
  useExtend({ Container: PixiContainer, Graphics: PGraphics, Text: PixiText });

  // animation clock
  const [t, setT] = useState(0);
  useTick((ticker: Ticker) => setT((s) => s + ticker.deltaTime / 60));

  // easeOutBack
  const ease = (u: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    const x = Math.min(1, Math.max(0, u));
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };

  // simple loop (no reset → plays once unless you wire a reset elsewhere)
  useEffect(() => {
    if (!loop) return;
    // const total = stepDelay * (letters.length - 1) + placeDuration + 1.2;
    // if (t > total) setT(0);
  }, [t, loop]);

  return (
    <>
      {/* realistic slots behind each target (bevel shadow ALWAYS on) */}
      <pixiGraphics
        draw={(g: PGraphics) => {
          g.clear();
          const size = layout.size;

          // Tuning knobs (relative to tile size)
          const slotPad   = Math.floor(size * slotPadPct);         // space around tile inside slot
          const wellInset = Math.max(3, Math.floor(size * wellInsetPct));
          const cornerR   = Math.max(8, Math.floor(size * 0.22));

          // Extra space between slots (visual only, doesn't move tiles)
          const slotGapPx = Math.floor(size * slotGapPct);

          // Ambient shadow bloom/offset (subtle)
      const ambientGrow = Math.max(2, Math.floor(size * 0.06));
      const ambientDrop = Math.max(1, Math.floor(size * 0.06));


          for (const t of layout.targets) {
            // Outer slot rect (inset by slotGapPx/2 so adjacent slots don't touch)
            const x = t.x - slotPad + slotGapPx / 2;
            const y = t.y - slotPad + slotGapPx / 2;
            const w = size + slotPad * 2 - slotGapPx;
            const h = size + slotPad * 2 - slotGapPx;

            // Ambient shadow (always on)
            g.setFillStyle({ color: 0x000000, alpha: 0.12 });
            g.roundRect(
              x - Math.floor(ambientGrow * 0.6),
              y + ambientDrop,
              w + ambientGrow,
              h + ambientGrow,
              cornerR + 2
            );
            g.fill();

            // Board surface
            g.setFillStyle({ color: 0xE9EDF3, alpha: 1 });
            g.setStrokeStyle({ width: 2, color: 0xC2CCD9, alpha: 1 });
            g.roundRect(x, y, w, h, cornerR);
            g.fill();
            g.stroke();

            // Inner well (recess)
            const ix = x + wellInset;
            const iy = y + wellInset;
            const iw = w - wellInset * 2;
            const ih = h - wellInset * 2;
            const ir = Math.max(4, cornerR - wellInset);

            g.setFillStyle({ color: 0xD5DDE8, alpha: 1 }); // slightly darker to suggest depth
            g.roundRect(ix, iy, iw, ih, ir);
            g.fill();

            // Bevel highlight (top-left) — always
            g.setStrokeStyle({ width: 2, color: 0xFFFFFF, alpha: 0.55 });
            g.roundRect(ix + 1, iy + 1, iw - 2, ih - 2, Math.max(3, ir - 1));
            g.stroke();

            // Bevel shadow (bottom-right) — ALWAYS ON
            g.setStrokeStyle({ width: 2, color: 0x8A96A6, alpha: 0.40 });
            g.roundRect(ix, iy, iw, ih, ir);
            g.stroke();

            // Inner rim (subtle)
            g.setStrokeStyle({ width: 1, color: 0xB7C2D0, alpha: 0.5 });
            g.roundRect(ix + 2, iy + 2, iw - 4, ih - 4, Math.max(2, ir - 2));
            g.stroke();
          }
        }}
      />

      {/* tiles */}
      <pixiContainer>
        {letters.map((ch, i) => {
          const start = starts[i]!;
          const target = layout.targets[i]!;
          const delay = i * stepDelay;
          const u = Math.max(0, t - delay) / placeDuration;
          const k = ease(u);
          const x = start.x + (target.x - start.x) * k;
          const y = start.y + (target.y - start.y) * k;
          return (
            <Tile
              key={`${i}-${ch}-${width}-${height}`}
              x={x}
              y={y}
              size={layout.size}
              ch={ch}
              tileShadow={tileShadow}
            />
          );
        })}
      </pixiContainer>
    </>
  );
}

type Props = {
  text?: string;

  /** LAYOUT SPACING + SIZE */
  gap?: number;             // spacing between tiles/slots (layout)
  baseTileSize?: number;    // preferred tile size (upper bound)
  minTileSize?: number;     // hard lower bound for tile size
  tileScale?: number;       // scale after fit (0.5 = half, 1 = same)

  /** ANIMATION */
  stepDelay?: number;
  placeDuration?: number;
  loop?: boolean;

  /** CANVAS */
  className?: string;
  height?: number;

  /** SLOT TUNING (relative to tile size) */
  slotPadPct?: number;      // default 0.16 → air around tile inside slot
  slotGapPct?: number;      // default 0.12 → visual gap between slots
  wellInsetPct?: number;    // default 0.10 → recess depth feel

  /** TILES */
  tileShadow?: boolean;     // ONLY tiles' shadow (default false)
};

export default function ScrabbleTitlePixi({
  text = "SCRABBLE+",

  // Size & spacing
  gap = 14,
  baseTileSize = 64,
  minTileSize = 28,
  tileScale = 1,

  // Animation
  stepDelay = 0.28,
  placeDuration = 0.65,
  loop = false,             // play once by default

  // Canvas
  className = "",
  height = 220,

  // Slots
  slotPadPct = 0.16,
  slotGapPct = 0.12,
  wellInsetPct = 0.10,

  // Tiles
  tileShadow = false,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(800);
  const letters = useMemo(() => text.split(""), [text]);

  // measure container
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(Math.max(320, el.clientWidth)));
    ro.observe(el);
    setWidth(Math.max(320, el.clientWidth));
    return () => ro.disconnect();
  }, []);

  // layout with size control
  const layout = useMemo(() => {
    if (!letters.length || !width) return null;

    const n = letters.length;

    // Tile that would fit if we gave each one equal room
    const unscaledFit = Math.floor((width - gap * (n - 1)) / n);

    // Respect base preference and container fit
    const fitCandidate = Math.min(baseTileSize, unscaledFit);

    // Enforce min bound
    let size = Math.max(minTileSize, fitCandidate);

    // Apply user scale (then clamp)
    size = Math.floor(size * tileScale);
    size = Math.min(size, unscaledFit, baseTileSize);
    size = Math.max(minTileSize, size);

    const totalW = n * size + (n - 1) * gap;
    const startX = Math.round((width - totalW) / 2);
    const y = Math.round((height - size) / 2);
    const targets = Array.from({ length: n }, (_, i) => ({ x: startX + i * (size + gap), y }));

    return { size, targets };
  }, [letters.length, width, height, baseTileSize, minTileSize, tileScale, gap]);

  // random starts
  const starts = useMemo(() => {
    const w = width, h = height;
    const rand = (a: number, b: number) => Math.random() * (b - a) + a;
    const sides: Array<"top"|"right"|"bottom"|"left"> = ["top","right","bottom","left"];
    return letters.map(() => {
      const side = sides[Math.floor(Math.random() * sides.length)];
      switch (side) {
        case "top": return { x: rand(-80, w + 80), y: -120 };
        case "right": return { x: w + 120, y: rand(-80, h + 80) };
        case "bottom": return { x: rand(-80, w + 80), y: h + 120 };
        case "left": return { x: -120, y: rand(-80, h + 80) };
      }
    });
  }, [letters, width, height]);

  if (!layout) {
    return <div ref={wrapperRef} className={`w-full ${className}`} style={{ height }} />;
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`} style={{ height }}>
      <Application width={width} height={height} backgroundAlpha={0} antialias>
        <PixiScene
          width={width}
          height={height}
          letters={letters}
          layout={layout}
          starts={starts as Array<{x:number;y:number}>}
          stepDelay={stepDelay}
          placeDuration={placeDuration}
          loop={loop}
          slotPadPct={slotPadPct}
          slotGapPct={slotGapPct}
          wellInsetPct={wellInsetPct}
          tileShadow={tileShadow}
        />
      </Application>
    </div>
  );
}
