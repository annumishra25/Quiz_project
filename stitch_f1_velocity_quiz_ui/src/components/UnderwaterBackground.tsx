import React, { useState, useRef, useEffect } from "react";

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Bubble {
  id: number; x: number; size: number; duration: number; delay: number; drift: number;
}
interface ColorFish {
  id: number; y: number; scale: number; duration: number; delay: number;
  flip: boolean; opacity: number; bodyColor: string; finColor: string; accent: string;
}
interface FloatingPlant {
  id: number; x: number; y: number; duration: number; delay: number; scale: number; hue: number;
}
interface Swimmer {
  id: number; y: number; scale: number; duration: number; delay: number;
  flip: boolean; opacity: number; strokeDelay: number; suitColor: string;
}

const FISH_PALETTES = [
  { bodyColor: "#e8622a", finColor: "#c44a18", accent: "#f9e090" }, // clownfish orange
  { bodyColor: "#c060d8", finColor: "#9040b0", accent: "#e8b0f8" }, // purple
  { bodyColor: "#30c878", finColor: "#1a9050", accent: "#a0f8c0" }, // green
  { bodyColor: "#f0c030", finColor: "#c89010", accent: "#fff8a0" }, // yellow
  { bodyColor: "#40a8f0", finColor: "#206890", accent: "#a0e0ff" }, // blue
  { bodyColor: "#f04060", finColor: "#b02040", accent: "#ffa0b0" }, // red-pink
  { bodyColor: "#20d8d0", finColor: "#108888", accent: "#90fff8" }, // teal
  { bodyColor: "#f880c0", finColor: "#c04090", accent: "#ffd0e8" }, // pink
];

const BUBBLES: Bubble[] = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: randomBetween(5, 95),
  size: randomBetween(4, 14),
  duration: randomBetween(7, 18),
  delay: -randomBetween(0, 14),
  drift: randomBetween(-25, 25),
}));

const FISH: ColorFish[] = Array.from({ length: 14 }, (_, i) => {
  const p = FISH_PALETTES[i % FISH_PALETTES.length];
  return {
    id: i,
    y: randomBetween(10, 82),
    scale: randomBetween(0.3, 0.85),
    duration: randomBetween(18, 40),
    delay: -randomBetween(0, 28),
    flip: i % 2 === 0,
    opacity: randomBetween(0.65, 0.95),
    ...p,
  };
});

const SUIT_COLORS = ["#1a6eb5", "#b51a4a", "#1ab578", "#b5881a", "#6e1ab5", "#1ab5b5"];

const SWIMMERS: Swimmer[] = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  y: randomBetween(8, 52),
  scale: randomBetween(0.55, 0.85),
  duration: randomBetween(22, 38),
  delay: -randomBetween(0, 24),
  flip: i % 2 === 0,
  opacity: randomBetween(0.7, 0.92),
  strokeDelay: randomBetween(0, 1.2),
  suitColor: SUIT_COLORS[i % SUIT_COLORS.length],
}));

const FLOATING_PLANTS: FloatingPlant[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: randomBetween(3, 97),
  y: randomBetween(20, 72),
  duration: randomBetween(6, 14),
  delay: -randomBetween(0, 10),
  scale: randomBetween(0.5, 1.3),
  hue: randomBetween(260, 310), // lavender to magenta range
}));

// Lavender plant positions along the bottom
const LAVENDER_PLANTS = [
  30, 110, 190, 280, 360, 440, 520, 610, 700, 780, 860, 940, 1030, 1110, 1200, 1290, 1370, 1420,
];

// ─── Swimmer SVG Component ─────────────────────────────────────
function SwimmerComponent({ suitColor, strokeDelay }: { suitColor: string; strokeDelay: number }) {
  const skin = "#d4956a";
  const cap  = "#1a2a3a";
  const suit = suitColor;
  const sd   = `${strokeDelay}s`;
  return (
    <g>
      {/* Trailing bubbles from kick */}
      <circle cx="-52" cy="6" r="2.2" fill="#a0e8f8" opacity="0.4" />
      <circle cx="-58" cy="2" r="1.4" fill="#a0e8f8" opacity="0.3" />
      <circle cx="-48" cy="-2" r="1.8" fill="#a0e8f8" opacity="0.25" />

      {/* Kick legs — alternating via animation */}
      <g style={{ transformOrigin: "-22px 8px", animation: `kickUp 0.9s ${sd} ease-in-out infinite` }}>
        <path d={`M-22,8 Q-34,16 -46,10 Q-52,6 -58,8`}
          stroke={suit} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d={`M-58,8 Q-64,10 -66,6`}
          stroke={skin} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      </g>
      <g style={{ transformOrigin: "-22px 10px", animation: `kickDown 0.9s ${sd} ease-in-out infinite` }}>
        <path d={`M-22,10 Q-34,20 -46,16 Q-52,14 -58,18`}
          stroke={suit} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d={`M-58,18 Q-64,20 -66,16`}
          stroke={skin} strokeWidth="5.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Torso */}
      <path d="M-22,4 Q0,0 16,4 Q18,10 16,14 Q0,16 -22,14 Z"
        fill={suit} />

      {/* Rear arm — pull phase (sweeping back) */}
      <g style={{ transformOrigin: "14px 8px", animation: `armPull 1.2s ${sd} ease-in-out infinite` }}>
        <path d={`M14,8 Q24,4 36,-2 Q46,-6 52,-10`}
          stroke={skin} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d={`M52,-10 Q58,-14 60,-18`}
          stroke={skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>

      {/* Front arm — recovery phase (reaching forward) */}
      <g style={{ transformOrigin: "14px 8px", animation: `armReach 1.2s ${sd} ease-in-out infinite` }}>
        <path d={`M14,8 Q20,-4 30,-14 Q36,-20 44,-22`}
          stroke={skin} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d={`M44,-22 Q50,-24 54,-22`}
          stroke={skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>

      {/* Head */}
      <circle cx="20" cy="4" r="10" fill={skin} />
      {/* Cap */}
      <path d="M12,-2 Q20,-14 28,-2" stroke={cap} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Goggle strap */}
      <ellipse cx="26" cy="4" rx="5" ry="4" fill="#1a3a50" opacity="0.85" />
      <circle cx="26" cy="4" r="2.5" fill="#0a2030" />
      <circle cx="27" cy="3" r="1" fill="#60c8f0" opacity="0.7" />
    </g>
  );
}

// ─── Submarine SVG Shape ───────────────────────────────────────
function SubmarineShape() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="112" ry="38" fill="#256b8a" />
      <ellipse cx="0" cy="0" rx="112" ry="38" fill="url(#hullGloss)" />
      <ellipse cx="-107" cy="0" rx="20" ry="30" fill="#1c5470" />
      <rect x="-20" y="-60" width="44" height="30" rx="7" fill="#1a4f6e" />
      <rect x="-16" y="-65" width="36" height="9" rx="4" fill="#133d56" />
      <rect x="8" y="-80" width="5" height="24" rx="2" fill="#133d56" />
      <rect x="5" y="-84" width="12" height="7" rx="2" fill="#133d56" />
      <line x1="-12" y1="-65" x2="-12" y2="-84" stroke="#133d56" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="-12" cy="-86" r="3.5" fill="#f0c040" opacity="0.9" />
      {([-55, -18, 18, 52] as number[]).map((px, i) => (
        <g key={i}>
          <circle cx={px} cy="-3" r="11" fill="#0a2f40" stroke="#3a9fc0" strokeWidth="2.2" />
          <circle cx={px} cy="-3" r="7.5" fill="#071e2c" />
          <circle cx={px - 2.5} cy="-5.5" r="2.8" fill="#90e0f8" opacity="0.5" />
        </g>
      ))}
      <polygon points="62,-38 94,-38 102,-64 72,-54" fill="#1a4f6e" />
      <polygon points="62,38 94,38 102,64 72,54" fill="#1a4f6e" />
      <ellipse cx="-15" cy="-17" rx="72" ry="9" fill="white" opacity="0.06" />
      <circle cx="-106" cy="0" r="5" fill="#f5e060" opacity="0.9" />
      <circle cx="108" cy="-30" r="3.5" fill="#50ee90" opacity="0.85" />
    </>
  );
}

// ─── Fish SVG Component ────────────────────────────────────────
function ColoredFish({ bodyColor, finColor, accent }: { bodyColor: string; finColor: string; accent: string }) {
  return (
    <g>
      <polygon points="-24,0 -42,-13 -42,13" fill={finColor} />
      <ellipse cx="0" cy="0" rx="26" ry="11" fill={bodyColor} />
      <polygon points="-8,-11 4,-22 16,-11" fill={finColor} opacity="0.9" />
      <polygon points="-4,11 4,20 12,11" fill={finColor} opacity="0.8" />
      <line x1="-2" y1="-10" x2="-2" y2="10" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="14" cy="-3" r="5" fill="#0a1a22" />
      <circle cx="15" cy="-4.5" r="2" fill={accent} opacity="0.8" />
      <circle cx="15.5" cy="-4.5" r="0.8" fill="white" opacity="0.9" />
    </g>
  );
}

// ─── Sea Plant Component ───────────────────────────────────────
function FloatingSeaPlant({ scale, hue }: { scale: number; hue: number }) {
  const c1 = `hsl(${hue}, 60%, 70%)`;
  const c2 = `hsl(${hue + 15}, 55%, 55%)`;
  const c3 = `hsl(${hue - 10}, 65%, 80%)`;
  return (
    <g transform={`scale(${scale})`} opacity="0.55">
      <ellipse cx="0" cy="0" rx="9" ry="12" fill={c1} />
      <path d="M-4,10 Q-18,28 -10,42" stroke={c2} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M0,12 Q2,30 -4,46" stroke={c2} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M4,10 Q16,26 10,42" stroke={c2} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="-2" cy="-4" rx="3.5" ry="5" fill={c3} opacity="0.5" />
    </g>
  );
}

// ─── CSS style keyframes ───────────────────────────────────────
const CSS = `
  @keyframes bubbleRise {
    0%   { transform: translate(var(--bx), 920px) scale(1); opacity: 0; }
    6%   { opacity: 0.75; }
    92%  { opacity: 0.35; }
    100% { transform: translate(calc(var(--bx) + var(--drift) * 1px), -30px) scale(0.55); opacity: 0; }
  }
  @keyframes rayPulse {
    0%, 100% { opacity: 0.7; }
    50%       { opacity: 1; }
  }
  @keyframes subBob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(7px); }
  }
  @keyframes propSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes fishL {
    from { transform: translateX(-260px); }
    to   { transform: translateX(1700px); }
  }
  @keyframes fishR {
    from { transform: translateX(1700px) scaleX(-1); }
    to   { transform: translateX(-260px) scaleX(-1); }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-7deg); }
    50%       { transform: rotate(7deg); }
  }
  @keyframes lavSway {
    0%, 100% { transform: rotate(-5deg); }
    50%       { transform: rotate(5deg); }
  }
  @keyframes floatDrift {
    0%        { transform: translate(0px, 0px) rotate(0deg); }
    33%       { transform: translate(8px, -12px) rotate(4deg); }
    66%       { transform: translate(-6px, -6px) rotate(-3deg); }
    100%      { transform: translate(0px, 0px) rotate(0deg); }
  }
  @keyframes shimmer {
    0%, 100% { opacity: 0.08; }
    50%       { opacity: 0.18; }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.55; }
    50%       { opacity: 0.85; }
  }
  @keyframes kickUp {
    0%, 100% { transform: rotate(-14deg) translateY(-3px); }
    50%       { transform: rotate(10deg) translateY(3px); }
  }
  @keyframes kickDown {
    0%, 100% { transform: rotate(10deg) translateY(3px); }
    50%       { transform: rotate(-14deg) translateY(-3px); }
  }
  @keyframes armPull {
    0%   { transform: rotate(-30deg); opacity: 1; }
    40%  { transform: rotate(20deg); opacity: 1; }
    50%  { opacity: 0.2; }
    90%  { transform: rotate(-30deg); opacity: 0.2; }
    100% { opacity: 1; }
  }
  @keyframes armReach {
    0%   { transform: rotate(15deg); opacity: 0.2; }
    10%  { opacity: 1; }
    50%  { transform: rotate(-25deg); opacity: 1; }
    60%  { opacity: 0.2; }
    100% { transform: rotate(15deg); opacity: 0.2; }
  }
  @keyframes swimmerBob {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(4px) rotate(2deg); }
  }
  @keyframes bubble-pop {
    0%   { transform: scale(0) translateY(0px);   opacity: 1;   }
    55%  { transform: scale(1) translateY(-18px);  opacity: 0.7; }
    100% { transform: scale(1.4) translateY(-35px); opacity: 0;   }
  }
`;

export function UnderwaterBackground() {
  const [subX, setSubX] = useState(-250);
  const rafRef = useRef<number>(0);
  const t0Ref = useRef<number | null>(null);

  // Click bubbles state
  const [clickBubbles, setClickBubbles] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);

  // Submarine horizontal translation tick
  useEffect(() => {
    let active = true;
    const tick = (ts: number) => {
      if (!active) return;
      if (t0Ref.current === null) {
        t0Ref.current = ts - Math.random() * 40 * 1000;
      }
      const elapsed = (ts - t0Ref.current) / 1000;
      const W = window.innerWidth + 500;
      const CYCLE = 40; // 40 seconds trip duration
      setSubX(-260 + ((elapsed % CYCLE) / CYCLE) * W);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Global window click bubble spawner
  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      const ids = Array.from({ length: 9 }, (_, i) => ({
        id:  nextId.current++,
        x:   cx + (i - 4) * 13,
        y:   cy,
      }));
      setClickBubbles(prev => [...prev, ...ids]);
      setTimeout(() => {
        setClickBubbles(prev => {
          const idSet = new Set(ids.map(b => b.id));
          return prev.filter(b => !idSet.has(b.id));
        });
      }, 950);
    };

    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/* SVG Canvas Background */}
      <svg
        className="fixed inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 0 }}
      >
        <defs>
          <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04192a" />
            <stop offset="45%" stopColor="#052438" />
            <stop offset="85%" stopColor="#020f1c" />
            <stop offset="100%" stopColor="#010810" />
          </linearGradient>
          <linearGradient id="hullGloss" x1="0" y1="-1" x2="0" y2="1">
            <stop offset="0%" stopColor="#7adcf8" stopOpacity="0.28" />
            <stop offset="55%" stopColor="black" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="bubbleG" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#b8eeff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3ab8e0" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient id="causticsR" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="#1ab0d8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#031118" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lavGlow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#c878f8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7040a0" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lightGlow">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Base ocean */}
        <rect width="1440" height="900" fill="url(#ocean)" />

        {/* Caustics */}
        <rect width="1440" height="900" fill="url(#causticsR)"
          style={{ animation: "rayPulse 9s ease-in-out infinite" }} />

        {/* Light shafts */}
        {[180, 410, 660, 880, 1120, 1360].map((x, i) => (
          <polygon key={i}
            points={`${x - 35},0 ${x + 35},0 ${x + 110},900 ${x - 110},900`}
            fill="#22b8d8"
            opacity={0.016 + (i % 3) * 0.005}
            style={{ animation: `rayPulse ${5 + i * 1.2}s ease-in-out ${i * 0.6}s infinite` }}
          />
        ))}

        {/* Plankton */}
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i}
            cx={(i * 139.7) % 1440} cy={(i * 71.3) % 900}
            r={0.6 + (i % 4) * 0.4} fill="#5adcf8"
            opacity={0.1 + (i % 5) * 0.04}
          />
        ))}

        {/* Floating mid-water plants */}
        {FLOATING_PLANTS.map((fp) => (
          <g key={fp.id}
            style={{
              transform: `translate(${fp.x * 14.4}px, ${fp.y * 9}px)`,
              animation: `floatDrift ${fp.duration}s ${fp.delay}s ease-in-out infinite`,
            }}
          >
            <g filter="url(#softGlow)" style={{ animation: `glowPulse ${fp.duration * 0.7}s ${fp.delay}s ease-in-out infinite` }}>
              <FloatingSeaPlant scale={fp.scale} hue={fp.hue} />
            </g>
          </g>
        ))}

        {/* Colored fish */}
        {FISH.map((f) => (
          <g key={f.id}
            style={{
              animation: `${f.flip ? "fishR" : "fishL"} ${f.duration}s ${f.delay}s linear infinite`,
            }}
          >
            <g transform={`translate(0, ${f.y * 9})`} opacity={f.opacity}>
              <g transform={`scale(${f.scale})`}>
                <ColoredFish bodyColor={f.bodyColor} finColor={f.finColor} accent={f.accent} />
              </g>
            </g>
          </g>
        ))}

        {/* Rising Bubbles */}
        {BUBBLES.map((b) => (
          <circle key={b.id}
            r={b.size / 2}
            fill="url(#bubbleG)" stroke="#7adcf0" strokeWidth="0.7"
            style={{
              ["--bx" as string]: `${b.x * 14.4}px`,
              ["--drift" as string]: `${b.drift}`,
              animation: `bubbleRise ${b.duration}s ${b.delay}s linear infinite`,
            } as React.CSSProperties}
          />
        ))}

        {/* Seafloor Base */}
        <path d="M0,810 Q200,780 400,805 Q620,832 840,796 Q1060,760 1260,800 Q1380,820 1440,808 L1440,900 L0,900 Z"
          fill="#020c18" opacity="0.96" />
        <path d="M0,848 Q240,832 480,845 Q720,858 960,836 Q1200,816 1440,840 L1440,900 L0,900 Z"
          fill="#010810" />

        {/* Lavender glow on seafloor */}
        <rect x="0" y="760" width="1440" height="140" fill="url(#lavGlow)"
          style={{ animation: `glowPulse 7s ease-in-out infinite` }} />

        {/* Swaying Lavender Bottom Plants */}
        {LAVENDER_PLANTS.map((sx, i) => {
          const h = 250 + (i % 5) * 12; // lavender range
          const baseY = 800 + (i % 3) * 10;
          const stemH = 55 + (i % 4) * 20;
          const swayDur = 2.4 + (i % 5) * 0.3;
          const swayDelay = i * 0.22;
          const c1 = `hsl(${h}, 65%, 72%)`;
          const c2 = `hsl(${h + 10}, 55%, 58%)`;
          const c3 = `hsl(${h - 5}, 70%, 85%)`;
          return (
            <g key={i}
              style={{
                transformOrigin: `${sx}px ${baseY}px`,
                animation: `lavSway ${swayDur}s ${swayDelay}s ease-in-out infinite`,
              }}
              filter="url(#softGlow)"
            >
              <path
                d={`M${sx},${baseY} C${sx - 18},${baseY - stemH * 0.3} ${sx + 14},${baseY - stemH * 0.6} ${sx - 6},${baseY - stemH}`}
                stroke="#2aaa58" strokeWidth="3.2" fill="none" strokeLinecap="round"
              />
              <path
                d={`M${sx + 3},${baseY} C${sx + 22},${baseY - stemH * 0.25} ${sx - 10},${baseY - stemH * 0.55} ${sx + 14},${baseY - stemH * 0.88}`}
                stroke="#1d8c44" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.8"
              />
              <path
                d={`M${sx - 2},${baseY - stemH * 0.35} C${sx - 28},${baseY - stemH * 0.42} ${sx - 22},${baseY - stemH * 0.65} ${sx - 16},${baseY - stemH * 0.75}`}
                stroke="#38c468" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65"
              />
              <ellipse
                cx={sx - 10} cy={baseY - stemH * 0.5}
                rx="8" ry="4"
                fill="#2aaa58" opacity="0.45"
                transform={`rotate(-35, ${sx - 10}, ${baseY - stemH * 0.5})`}
              />
              <ellipse
                cx={sx + 12} cy={baseY - stemH * 0.68}
                rx="7" ry="3.5"
                fill="#1d8c44" opacity="0.4"
                transform={`rotate(40, ${sx + 12}, ${baseY - stemH * 0.68})`}
              />
              <circle cx={sx - 6} cy={baseY - stemH} r={6 + (i % 3)} fill={c1} opacity="0.88" />
              {[0, 52, 104, 156, 208, 260, 312].map((deg, di) => (
                <line
                  key={di}
                  x1={sx - 6} y1={baseY - stemH}
                  x2={sx - 6 + Math.cos((deg * Math.PI) / 180) * (9 + (i % 3))}
                  y2={baseY - stemH + Math.sin((deg * Math.PI) / 180) * (9 + (i % 3))}
                  stroke={di % 2 === 0 ? c3 : c2}
                  strokeWidth="1.5" strokeLinecap="round" opacity="0.75"
                />
              ))}
              <circle cx={sx - 6} cy={baseY - stemH} r={3} fill={c3} opacity="0.9" />
              <circle cx={sx + 14} cy={baseY - stemH * 0.88} r={3.5} fill={c2} opacity="0.8" />
              <circle cx={sx + 14} cy={baseY - stemH * 0.88} r={1.5} fill={c3} opacity="0.9" />
            </g>
          );
        })}

        {/* Seafloor Rocks */}
        {[140, 360, 620, 870, 1090, 1340].map((rx, i) => (
          <ellipse key={i} cx={rx} cy={856 + (i % 2) * 8}
            rx={28 + (i % 3) * 10} ry={10 + (i % 3) * 3}
            fill="#010c18" opacity="0.88" />
        ))}

        {/* Swimming Divers (Swimmers) */}
        {SWIMMERS.map((sw) => (
          <g key={sw.id}
            style={{
              animation: `${sw.flip ? "fishR" : "fishL"} ${sw.duration}s ${sw.delay}s linear infinite`,
            }}
          >
            <g transform={`translate(0, ${sw.y * 9})`} opacity={sw.opacity}>
              <g
                transform={`scale(${sw.scale})`}
                style={{ animation: `swimmerBob 1.8s ${sw.strokeDelay}s ease-in-out infinite` }}
              >
                {sw.flip
                  ? <g transform="scale(-1,1)"><SwimmerComponent suitColor={sw.suitColor} strokeDelay={sw.strokeDelay} /></g>
                  : <SwimmerComponent suitColor={sw.suitColor} strokeDelay={sw.strokeDelay} />
                }
              </g>
            </g>
          </g>
        ))}

        {/* Moving Submarine */}
        <g style={{ transform: `translate(${subX}px, 378px)` }}>
          <g filter="url(#glow)" style={{ animation: "subBob 4.5s ease-in-out infinite" }}>
            <polygon points="-110,-20 -110,20 -340,60 -340,-60" fill="#d0f4ff" opacity="0.055" />
            <polygon points="-110,-9 -110,9 -270,30 -270,-30" fill="#d0f4ff" opacity="0.1" />
            <g style={{ transformOrigin: "110px 0px", animation: "propSpin 0.7s linear infinite" }}>
              <ellipse cx="110" cy="-20" rx="5" ry="20" fill="#1a4f68" transform="rotate(-20, 110, 0)" />
              <ellipse cx="110" cy="20" rx="5" ry="20" fill="#1a4f68" transform="rotate(20, 110, 0)" />
              <ellipse cx="128" cy="4" rx="5" ry="20" fill="#1a4f68" transform="rotate(90, 110, 0)" />
              <circle cx="110" cy="0" r="7.5" fill="#256b8a" stroke="#3aa8c8" strokeWidth="2" />
            </g>
            <SubmarineShape />
            <circle cx="-108" cy="0" r="9" fill="#f8e840" opacity="0.95" filter="url(#lightGlow)" />
          </g>
        </g>

        {/* Surface Shimmer */}
        <path d="M0,0 Q200,20 440,8 Q680,-4 920,14 Q1160,32 1440,10 L1440,0 Z"
          fill="#22c0e0" opacity="0.1"
          style={{ animation: "shimmer 6s ease-in-out infinite" }} />
      </svg>

      {/* Depth Readout Overlay */}
      <div className="fixed bottom-7 right-8 text-right select-none pointer-events-none"
        style={{ zIndex: 10, color: "#3a9fc0", opacity: 0.45, fontFamily: "monospace", letterSpacing: "0.14em" }}>
        <div style={{ fontSize: "10px", textTransform: "uppercase", marginBottom: "4px" }}>Depth</div>
        <div style={{ fontSize: "2rem", fontWeight: 300 }}>342 m</div>
      </div>

      {/* Mouse Click Bubbles Container */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 40 }}>
        {clickBubbles.map(b => (
          <div
            key={b.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left:       b.x - 8,
              top:        b.y - 8,
              width:      16,
              height:     16,
              background: "rgba(0, 225, 255, 0.55)",
              border:     "1px solid rgba(255,255,255,0.5)",
              animation:  "bubble-pop 0.92s ease-out forwards",
            }}
          />
        ))}
      </div>
    </>
  );
}
