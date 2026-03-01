"use client";

import { useEffect, useState } from "react";

const P = 8; // 1 "pixel" no sistema SVG
const FRAME_MS = 380; // mesmo ritmo do AnimatedLogo

// Corpo arredondado — 6 cols × 5 rows
const BODY: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],
  [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],
  [2,0],      [2,2],[2,3],      [2,5], // gaps para olhos em col 1 e 4
  [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],
  [4,1],[4,2],[4,3],[4,4],
];

// Destaque (brilho no topo-esquerdo)
const HIGHLIGHT: [number, number][] = [[0,2],[0,3],[1,1]];

// Olhos
const EYES: [number, number][] = [[2,1],[2,4]];

// Tentáculos — col por frame (frame 0: próximos, frame 1: abertos)
const TENTACLE_COLS: [number[], number[]] = [
  [1, 4],
  [0, 5],
];

export function ClaudeMascot({ style }: { style?: React.CSSProperties }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 2), FRAME_MS);
    return () => clearInterval(id);
  }, []);

  // Frame 0: corpo em y=P (deslocado 8px p/ baixo para dar espaço ao bob)
  // Frame 1: corpo em y=0 (subiu)
  const bodyY = frame === 0 ? P : 0;

  // Tentáculos sempre logo abaixo do corpo
  const tentacleY = 5 * P + bodyY;
  const tentacleCols = TENTACLE_COLS[frame];

  return (
    <svg
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated", ...style }}
    >
      {/* Corpo */}
      {BODY.map(([row, col], i) => (
        <rect key={i} x={col * P} y={row * P + bodyY} width={P} height={P} fill="#D96030" />
      ))}

      {/* Brilho */}
      {HIGHLIGHT.map(([row, col], i) => (
        <rect key={`h${i}`} x={col * P} y={row * P + bodyY} width={P} height={P} fill="#F07848" />
      ))}

      {/* Olhos */}
      {EYES.map(([row, col], i) => (
        <rect key={`e${i}`} x={col * P} y={row * P + bodyY} width={P} height={P} fill="#1A0800" />
      ))}

      {/* Tentáculos */}
      {tentacleCols.map((col, i) => (
        <rect key={`t${i}`} x={col * P} y={tentacleY} width={P} height={P} fill="#A84820" />
      ))}

      {/* Sombra — cresce quando corpo desce, encolhe quando sobe */}
      <rect x={8}  y={66} width={8}  height={4} fill="#0F0F0D" opacity={frame === 0 ? 0.35 : 0.15} />
      <rect x={16} y={64} width={16} height={4} fill="#0F0F0D" opacity={frame === 0 ? 0.45 : 0.2}  />
      <rect x={32} y={66} width={8}  height={4} fill="#0F0F0D" opacity={frame === 0 ? 0.35 : 0.15} />
    </svg>
  );
}
