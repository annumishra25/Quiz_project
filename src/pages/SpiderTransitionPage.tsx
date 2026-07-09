import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const webLines = [
  { x1: "50%", y1: "50%", x2: "0%", y2: "0%", d: 0 },
  { x1: "50%", y1: "50%", x2: "25%", y2: "0%", d: 0.05 },
  { x1: "50%", y1: "50%", x2: "50%", y2: "0%", d: 0.1 },
  { x1: "50%", y1: "50%", x2: "75%", y2: "0%", d: 0.15 },
  { x1: "50%", y1: "50%", x2: "100%", y2: "0%", d: 0.2 },
  { x1: "50%", y1: "50%", x2: "100%", y2: "25%", d: 0.25 },
  { x1: "50%", y1: "50%", x2: "100%", y2: "50%", d: 0.3 },
  { x1: "50%", y1: "50%", x2: "100%", y2: "75%", d: 0.35 },
  { x1: "50%", y1: "50%", x2: "100%", y2: "100%", d: 0.4 },
  { x1: "50%", y1: "50%", x2: "75%", y2: "100%", d: 0.45 },
  { x1: "50%", y1: "50%", x2: "50%", y2: "100%", d: 0.5 },
  { x1: "50%", y1: "50%", x2: "25%", y2: "100%", d: 0.55 },
  { x1: "50%", y1: "50%", x2: "0%", y2: "100%", d: 0.6 },
  { x1: "50%", y1: "50%", x2: "0%", y2: "75%", d: 0.65 },
  { x1: "50%", y1: "50%", x2: "0%", y2: "50%", d: 0.7 },
  { x1: "50%", y1: "50%", x2: "0%", y2: "25%", d: 0.75 },
];

function SpiderWeb({ visible }: { visible: boolean }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
    >
      {webLines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(220,30,30,0.25)"
          strokeWidth="1"
          style={{
            strokeDasharray: '900',
            strokeDashoffset: visible ? 0 : 900,
            transition: `stroke-dashoffset 1.2s ease ${l.d + 0.3}s`,
          }}
        />
      ))}
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((r, i) => (
        <ellipse
          key={i}
          cx="50%"
          cy="50%"
          rx={`${r * 50}%`}
          ry={`${r * 50}%`}
          fill="none"
          stroke="rgba(220,30,30,0.18)"
          strokeWidth="1"
          style={{
            strokeDasharray: '2000',
            strokeDashoffset: visible ? 0 : 2000,
            transition: `stroke-dashoffset 1.4s ease ${i * 0.12 + 0.5}s`,
          }}
        />
      ))}
    </svg>
  );
}

export function SpiderTransitionPage() {
  const [phase, setPhase] = useState<"black" | "reveal" | "text" | "done">("black");
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 100);
    const t2 = setTimeout(() => setPhase("text"), 500);
    const t3 = setTimeout(() => setPhase("done"), 2000);
    const t4 = setTimeout(() => {
      navigate('/quiz');
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [navigate]);

  const isDone = phase === "done";

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex items-center justify-center select-none"
      style={{
        background: "#000",
        fontFamily: "'Bebas Neue', sans-serif",
      }}
    >
      <style>{`
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
      `}</style>

      {/* Red vignette background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, #1a0000 0%, #0d0000 40%, #000 100%)",
          opacity: phase === "black" ? 0 : 1,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* Red sweep panel — cinematic wipe */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(135deg, #c00 0%, #800 60%, #300 100%)",
          clipPath:
            phase === "black"
              ? "polygon(0 0, 0 0, 0 100%, 0 100%)"
              : phase === "reveal"
              ? "polygon(0 0, 110% 0, 110% 100%, 0 100%)"
              : "polygon(110% 0, 110% 0, 110% 100%, 110% 100%)",
          transition:
            phase === "reveal"
              ? "clip-path 0.7s cubic-bezier(0.77,0,0.18,1)"
              : "clip-path 0.35s cubic-bezier(0.77,0,0.18,1) 0.05s",
        }}
      />

      {/* Web SVG */}
      <SpiderWeb visible={phase === "text" || phase === "done"} />

      {/* Particle sparks */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            background: i % 4 === 0 ? "#fff" : "#e00",
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            opacity: phase === "text" || phase === "done" ? 0.7 : 0,
            transform:
              phase === "text" || phase === "done"
                ? "scale(1)"
                : "scale(0)",
            transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
            boxShadow: "0 0 6px 2px rgba(220,0,0,0.6)",
          }}
        />
      ))}

      {/* Main text block */}
      <div className="relative z-20 text-center px-6">
        {/* "WELCOME TO" */}
        <div
          style={{
            fontSize: "clamp(1.4rem, 5vw, 3rem)",
            letterSpacing: "0.35em",
            color: "#fff",
            opacity: phase === "text" || phase === "done" ? 1 : 0,
            transform:
              phase === "text" || phase === "done"
                ? "translateY(0)"
                : "translateY(-30px)",
            transition: "opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s",
            textShadow: "0 0 20px rgba(200,0,0,0.8)",
          }}
        >
          WELCOME TO
        </div>

        {/* "SPIDER WORLD" big */}
        <div
          style={{
            fontSize: "clamp(4rem, 18vw, 14rem)",
            lineHeight: 0.9,
            color: "#e00",
            textShadow: "0 0 60px rgba(255,0,0,0.5), 2px 2px 0 #600, -2px -2px 0 #900",
            opacity: phase === "text" || phase === "done" ? 1 : 0,
            transform:
              phase === "text" || phase === "done"
                ? "scaleX(1) translateY(0)"
                : "scaleX(0.6) translateY(20px)",
            transition: "opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
          }}
        >
          SPIDER
        </div>

        <div
          style={{
            fontSize: "clamp(4rem, 18vw, 14rem)",
            lineHeight: 0.9,
            color: "#fff",
            textShadow: "2px 2px 0 #700, 0 0 40px rgba(200,20,20,0.6)",
            opacity: phase === "text" || phase === "done" ? 1 : 0,
            transform:
              phase === "text" || phase === "done"
                ? "scaleX(1) translateY(0)"
                : "scaleX(0.6) translateY(20px)",
            transition: "opacity 0.4s ease 0.2s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s",
          }}
        >
          WORLD
        </div>

        {/* Divider line */}
        <div
          className="mx-auto mt-4 mb-4"
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent, #e00, transparent)",
            width: phase === "text" || phase === "done" ? "60%" : "0%",
            transition: "width 0.4s ease 0.3s",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(0.7rem, 2vw, 1.1rem)",
            letterSpacing: "0.5em",
            color: "rgba(255,255,255,0.6)",
            textTransform: "uppercase",
            opacity: phase === "text" || phase === "done" ? 1 : 0,
            transition: "opacity 0.4s ease 0.45s",
          }}
        >
          With great power comes great responsibility
        </div>
      </div>

      {/* Cinematic black bars */}
      <div
        className="absolute top-0 left-0 right-0 z-30"
        style={{
          height: isDone ? 0 : "8vh",
          background: "#000",
          transition: "height 0.3s ease 0.6s",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{
          height: isDone ? 0 : "8vh",
          background: "#000",
          transition: "height 0.3s ease 0.6s",
        }}
      />

      {/* Final fade-out overlay */}
      <div
        className="absolute inset-0 z-40 bg-black pointer-events-none"
        style={{
          opacity: isDone ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      />
    </div>
  );
}
