import { useState, useEffect, useRef, useCallback } from "react";

const paintings = [
  { id: 1, title: "Moonlit Pines", year: "2025", medium: "Oil on canvas", size: '36" × 48"', description: "A silver moon bathes a stand of ancient pines in luminous silence.", color: "#1a1f3d" },
  { id: 2, title: "Starfall Over the Lake", year: "2025", medium: "Oil on linen", size: '40" × 30"', description: "Thousands of stars dissolve into the still surface of a mountain lake.", color: "#0f1a2e" },
  { id: 3, title: "The Violet Hour", year: "2024", medium: "Oil on canvas", size: '48" × 36"', description: "Twilight deepens across a meadow where fireflies begin their quiet chorus.", color: "#2a1f3d" },
  { id: 4, title: "Orion's Clearing", year: "2024", medium: "Acrylic on panel", size: '30" × 40"', description: "A forest clearing opens to reveal the winter constellation in crystalline detail.", color: "#121e33" },
  { id: 5, title: "River of Dusk", year: "2024", medium: "Oil on canvas", size: '60" × 36"', description: "A winding river reflects the last embers of daylight beneath a rising crescent.", color: "#1f1a30" },
  { id: 6, title: "Northern Silence", year: "2023", medium: "Oil on linen", size: '48" × 60"', description: "The aurora whispers green and violet above a snow-covered boreal expanse.", color: "#0a1e2a" },
];

/* ─── Animated Canvas Star Field ─── */
const StarCanvas = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const shootingRef = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    starsRef.current = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight * 0.75,
      r: Math.random() * 1.6 + 0.3,
      baseOpacity: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
    }));

    const spawnShooting = () => {
      shootingRef.current.push({
        x: Math.random() * canvas.offsetWidth * 0.6 + canvas.offsetWidth * 0.2,
        y: Math.random() * canvas.offsetHeight * 0.3,
        vx: (Math.random() * 3 + 2) * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.random() * 2 + 1.5,
        life: 1,
        length: Math.random() * 60 + 40,
      });
    };

    let time = 0;
    const animate = () => {
      time++;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const s of starsRef.current) {
        const twinkle = Math.sin(time * s.speed + s.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 228, 217, ${s.baseOpacity * twinkle})`;
        ctx.fill();
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 210, 240, ${s.baseOpacity * twinkle * 0.08})`;
          ctx.fill();
        }
      }

      if (time % 180 === 0 || (time % 90 === 0 && Math.random() > 0.6)) spawnShooting();
      for (let i = shootingRef.current.length - 1; i >= 0; i--) {
        const ss = shootingRef.current[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.015;
        if (ss.life <= 0) { shootingRef.current.splice(i, 1); continue; }
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * ss.length * 0.3, ss.y - ss.vy * ss.length * 0.3);
        grad.addColorStop(0, `rgba(232, 228, 217, ${ss.life * 0.9})`);
        grad.addColorStop(1, `rgba(232, 228, 217, 0)`);
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * ss.length * 0.3, ss.y - ss.vy * ss.length * 0.3);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.life * 0.6})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
};

/* ─── Floating Fireflies ─── */
const Fireflies = () => {
  const flies = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    top: 50 + Math.random() * 40,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 8 + 6,
    glowDelay: Math.random() * 4,
    glowDur: Math.random() * 3 + 2,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {flies.map((f) => (
        <div key={f.id} style={{
          position: "absolute", left: `${f.left}%`, top: `${f.top}%`,
          width: f.size, height: f.size, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,210,160,0.9), rgba(200,190,140,0))",
          boxShadow: `0 0 ${f.size * 3}px ${f.size}px rgba(220,210,140,0.3)`,
          animation: `fireflyDrift${f.id % 3} ${f.duration}s ease-in-out infinite, fireflyGlow ${f.glowDur}s ${f.glowDelay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
};

/* ─── Parallax Moon ─── */
const ParallaxMoon = ({ scrollY, mouseX }) => {
  const moonY = -scrollY * 0.15;
  const moonX = (mouseX - 0.5) * -20;
  return (
    <div style={{
      position: "absolute", top: "12%", right: "18%",
      transform: `translate(${moonX}px, ${moonY}px)`,
      transition: "transform 0.3s ease-out", zIndex: 2,
    }}>
      <div style={{
        width: 220, height: 220, borderRadius: "50%", position: "absolute", top: -55, left: -55,
        background: "radial-gradient(circle, rgba(200,210,240,0.12) 0%, rgba(200,210,240,0.04) 40%, transparent 70%)",
      }} />
      <div style={{
        width: 140, height: 140, borderRadius: "50%", position: "absolute", top: -15, left: -15,
        background: "radial-gradient(circle, rgba(220,225,240,0.08) 0%, transparent 60%)",
      }} />
      <svg width="110" height="110" viewBox="0 0 110 110">
        <defs>
          <radialGradient id="moonGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#f0ece3" /><stop offset="60%" stopColor="#ddd8cc" /><stop offset="100%" stopColor="#c4bfb0" />
          </radialGradient>
          <filter id="moonGlow"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="55" cy="55" r="42" fill="url(#moonGrad)" filter="url(#moonGlow)" opacity="0.92" />
        <circle cx="40" cy="42" r="6" fill="rgba(180,175,160,0.2)" />
        <circle cx="62" cy="58" r="4" fill="rgba(180,175,160,0.15)" />
        <circle cx="50" cy="68" r="3" fill="rgba(180,175,160,0.12)" />
        <circle cx="68" cy="38" r="5" fill="rgba(180,175,160,0.1)" />
      </svg>
    </div>
  );
};

/* ─── Utilities ─── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isVisible];
};

const FadeIn = ({ children, delay = 0, direction = "up", style = {} }) => {
  const [ref, isVisible] = useInView(0.1);
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0, transform: isVisible ? "none" : transforms[direction],
      transition: `opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
export default function Portfolio() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [mouseX, setMouseX] = useState(0.5);
  const [winH, setWinH] = useState(800);

  useEffect(() => {
    setWinH(window.innerHeight);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e) => setMouseX(e.clientX / window.innerWidth);
    const handleResize = () => setWinH(window.innerHeight);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("mousemove", handleMouse); window.removeEventListener("resize", handleResize); };
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const navDark = scrollY > winH * 0.7;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f5f2ed", color: "#1a1f3d", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes fireflyDrift0 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -20px); }
          50% { transform: translate(-10px, -8px); }
          75% { transform: translate(20px, 12px); }
        }
        @keyframes fireflyDrift1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-20px, 15px); }
          66% { transform: translate(12px, -18px); }
        }
        @keyframes fireflyDrift2 {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(10px, 18px); }
          50% { transform: translate(-18px, -5px); }
          80% { transform: translate(8px, -15px); }
        }
        @keyframes fireflyGlow {
          0%, 100% { opacity: 0; }
          15% { opacity: 0.9; }
          50% { opacity: 0.6; }
          85% { opacity: 0.95; }
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 2.5px;
          text-transform: uppercase; text-decoration: none; cursor: pointer;
          padding: 4px 0; position: relative; background: none; border: none; transition: all 0.3s;
        }
        .nav-link-light { color: rgba(245,242,237,0.7); }
        .nav-link-light:hover { color: #f5f2ed; }
        .nav-link-dark { color: #1a1f3d; }
        .nav-link-dark::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px;
          background: #1a1f3d; transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link-dark:hover::after { width: 100%; }
        .nav-link-dark:hover { opacity: 0.7; }

        .gallery-card { cursor: pointer; position: relative; overflow: hidden; border-radius: 2px; }
        .gallery-card::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,31,61,0.6) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.5s;
        }
        .gallery-card:hover::after { opacity: 1; }
        .gallery-card:hover .card-title { opacity: 1; transform: translateY(0); }
        .gallery-card:hover .card-img { transform: scale(1.04); }
        .card-img { transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .card-title {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; z-index: 2;
          opacity: 0; transform: translateY(8px); transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(26,31,61,0.85); backdrop-filter: blur(20px);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          animation: fadeInUp 0.4s ease; cursor: pointer;
        }
        .modal-content {
          background: #f5f2ed; max-width: 720px; width: 90%; border-radius: 3px;
          overflow: hidden; cursor: default; animation: slideDown 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cta-btn {
          font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
          padding: 16px 40px; border: 1px solid #1a1f3d; background: transparent; color: #1a1f3d;
          cursor: pointer; transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); border-radius: 0;
        }
        .cta-btn:hover { background: #1a1f3d; color: #f5f2ed; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f5f2ed; }
        ::-webkit-scrollbar-thumb { background: #c4bfb6; border-radius: 2px; }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navDark ? "rgba(245,242,237,0.92)" : "transparent",
        backdropFilter: navDark ? "blur(20px)" : "none",
        borderBottom: navDark ? "1px solid rgba(26,31,61,0.06)" : "1px solid transparent",
        transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, letterSpacing: 1.5,
          color: navDark ? "#1a1f3d" : "#f5f2ed", transition: "color 0.6s",
        }}>Elara Voss</div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["works", "about", "contact"].map((s) => (
            <button key={s} className={`nav-link ${navDark ? "nav-link-dark" : "nav-link-light"}`} onClick={() => scrollTo(s)}>{s}</button>
          ))}
        </div>
      </nav>

      {/* ═══ HERO — FULL CINEMATIC NIGHT SCENE ═══ */}
      <section style={{
        height: "110vh", position: "relative", overflow: "hidden",
        background: "linear-gradient(180deg, #070a18 0%, #0d1229 30%, #141a3a 55%, #1f2548 75%, #2a2f55 100%)",
      }}>
        <StarCanvas />
        <ParallaxMoon scrollY={scrollY} mouseX={mouseX} />

        {/* SVG landscape silhouette */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
          transform: `translateY(${scrollY * 0.08}px)`,
        }}>
          <svg viewBox="0 0 1440 420" style={{ width: "100%", display: "block" }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(200,210,240,0.06)" /><stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M0,280 Q120,180 240,230 Q360,160 480,210 Q600,140 720,200 Q840,130 960,190 Q1080,120 1200,180 Q1320,140 1440,170 L1440,420 L0,420Z" fill="rgba(15,18,40,0.5)" />
            <path d="M0,310 Q100,240 200,280 Q350,200 500,260 Q650,190 800,250 Q950,185 1100,240 Q1250,200 1440,230 L1440,420 L0,420Z" fill="rgba(12,15,35,0.7)" />
            {Array.from({ length: 80 }, (_, i) => {
              const x = i * 18 + Math.sin(i * 1.3) * 10;
              const baseY = 320 + Math.sin(i * 0.4) * 20 + Math.cos(i * 0.7) * 10;
              const h = 30 + Math.random() * 55 + Math.sin(i * 0.6) * 15;
              const w = 6 + Math.random() * 5;
              return <polygon key={i} points={`${x},${baseY} ${x + w / 2},${baseY - h} ${x + w},${baseY}`} fill={`rgba(8,10,25,${0.75 + Math.random() * 0.2})`} />;
            })}
            <path d="M0,360 Q200,330 400,345 Q600,320 800,340 Q1000,325 1200,345 Q1350,335 1440,350 L1440,420 L0,420Z" fill="rgba(6,8,20,0.9)" />
            <rect y="380" width="1440" height="40" fill="#070a18" />
            <ellipse cx="400" cy="330" rx="300" ry="25" fill="url(#mist)" />
            <ellipse cx="1000" cy="340" rx="250" ry="20" fill="url(#mist)" />
          </svg>
        </div>

        <Fireflies />

        {/* Moon reflection */}
        <div style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", width: 300, height: 40, zIndex: 2, pointerEvents: "none" }}>
          <div style={{ width: 60, height: 8, borderRadius: "50%", margin: "0 auto", background: "radial-gradient(ellipse, rgba(220,225,240,0.12), transparent)", animation: "breathe 4s infinite" }} />
          <div style={{ width: 40, height: 5, borderRadius: "50%", margin: "4px auto 0", background: "radial-gradient(ellipse, rgba(220,225,240,0.07), transparent)", animation: "breathe 4s 0.5s infinite" }} />
        </div>

        {/* Hero Text */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          paddingBottom: "12vh",
          transform: `translateY(${scrollY * 0.25}px)`,
          opacity: Math.max(0, 1 - scrollY / 500),
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 5, textTransform: "uppercase",
            color: "rgba(200,210,240,0.5)", opacity: 0, animation: "fadeInUp 1s 0.3s forwards",
          }}>Painter of nocturnal landscapes</div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(52px, 9vw, 110px)",
            fontWeight: 300, lineHeight: 1.0, marginTop: 24, color: "#f0ece3", textAlign: "center",
            opacity: 0, animation: "fadeInUp 1.2s 0.6s forwards",
            textShadow: "0 0 80px rgba(200,210,240,0.15)",
          }}>
            Where Night<br />
            <em style={{ fontWeight: 300, fontStyle: "italic", color: "rgba(200,210,240,0.75)" }}>Meets Nature</em>
          </h1>

          <div style={{
            width: 80, height: 1, margin: "40px auto",
            background: "linear-gradient(90deg, transparent, rgba(200,210,240,0.4), transparent)",
            opacity: 0, animation: "heroLine 1.2s 1.2s forwards", transformOrigin: "center",
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.9,
            color: "rgba(200,210,240,0.45)", maxWidth: 460, textAlign: "center",
            fontWeight: 300, opacity: 0, animation: "fadeInUp 1s 1.5s forwards",
          }}>
            Quiet paintings that hold the stillness between dusk and dawn — the deep blues, silver light, and vast silences of the natural world after dark.
          </p>

          <button className="cta-btn" style={{
            marginTop: 40, borderColor: "rgba(200,210,240,0.25)", color: "rgba(240,236,227,0.8)",
            opacity: 0, animation: "fadeInUp 1s 1.8s forwards",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(240,236,227,0.1)"; e.target.style.borderColor = "rgba(200,210,240,0.5)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(200,210,240,0.25)"; }}
            onClick={() => scrollTo("works")}
          >View the Collection</button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: 0, animation: "fadeInUp 1s 2.4s forwards",
        }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(200,210,240,0.3)" }}>Scroll</div>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(200,210,240,0.3), transparent)", animation: "breathe 2s infinite" }} />
        </div>

        {/* Bottom gradient dissolve */}
        <div style={{
          position: "absolute", bottom: -1, left: 0, right: 0, height: 180, zIndex: 6,
          background: "linear-gradient(to bottom, transparent 0%, #f5f2ed 100%)",
        }} />
      </section>

      {/* ═══ FEATURED ═══ */}
      <section style={{ padding: "40px 48px 120px" }}>
        <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 1200, margin: "0 auto", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: `linear-gradient(135deg, ${paintings[0].color}, ${paintings[0].color}dd)`, aspectRatio: "4/3", position: "relative" }}>
              <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
                <defs>
                  <radialGradient id="fmoon" cx="65%" cy="30%"><stop offset="0%" stopColor="#e8e4d9" /><stop offset="100%" stopColor="#c8c0af" /></radialGradient>
                  <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0e24" /><stop offset="100%" stopColor="#1a1f3d" /></linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#fsky)" />
                <circle cx="260" cy="85" r="28" fill="url(#fmoon)" opacity="0.9" />
                {[180,200,155,230,250,275,300,140,120,320,340,165].map((x, i) => (
                  <polygon key={i} points={`${x-8},${160+i%3*10} ${x},${120+i%5*12} ${x+8},${160+i%3*10}`} fill={`rgba(10,14,30,${0.8+i%3*0.07})`} />
                ))}
                <rect y="170" width="400" height="130" fill="rgba(6,8,16,0.5)" />
                <ellipse cx="260" cy="240" rx="12" ry="3" fill="rgba(232,228,217,0.15)" />
                {[{x:50,y:40},{x:100,y:60},{x:340,y:50},{x:310,y:30},{x:80,y:100},{x:360,y:90}].map((s,i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={1} fill="#e8e4d9" opacity={0.3+i*0.05} />
                ))}
              </svg>
            </div>
            <div style={{ background: "#eae7e0", padding: "60px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#a09da8", marginBottom: 20 }}>Featured Work</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, lineHeight: 1.2, color: "#1a1f3d" }}>{paintings[0].title}</h2>
              <p style={{ fontSize: 13, color: "#6b6880", marginTop: 16, lineHeight: 1.8, fontWeight: 300 }}>{paintings[0].description}</p>
              <div style={{ marginTop: 24, fontSize: 12, color: "#a09da8", letterSpacing: 0.5 }}>{paintings[0].medium} · {paintings[0].size} · {paintings[0].year}</div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ WORKS ═══ */}
      <section id="works" style={{ padding: "40px 48px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: "#1a1f3d" }}>Selected Works</h2>
            <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#a09da8" }}>2023 – 2025</span>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {paintings.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1}>
              <div className="gallery-card" onClick={() => setSelectedWork(p)} style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/3" }}>
                <div className="card-img" style={{ width: "100%", height: "100%", position: "relative" }}>
                  <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid slice">
                    <defs><linearGradient id={`g${p.id}`} x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stopColor={p.color} /><stop offset="100%" stopColor={`${p.color}cc`} /></linearGradient></defs>
                    <rect width="400" height="300" fill={`url(#g${p.id})`} />
                    <circle cx={120+i*40} cy={60+i*8} r={14+i*3} fill="#e8e4d9" opacity={0.15+i*0.05} />
                    {Array.from({ length: 6+i*2 }, (_, j) => (
                      <polygon key={j} points={`${j*45+20},200 ${j*45+40},${130+j*8+i*5} ${j*45+60},200`} fill={`rgba(5,8,18,${0.3+j*0.04})`} />
                    ))}
                    <rect y="200" width="400" height="100" fill="rgba(5,8,18,0.25)" />
                    {Array.from({ length: 5 }, (_, j) => (<circle key={j} cx={30+j*80} cy={20+j*15} r={0.8} fill="#e8e4d9" opacity={0.25} />))}
                  </svg>
                </div>
                <div className="card-title">
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#f5f2ed" }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(245,242,237,0.6)", marginTop: 4, letterSpacing: 1 }}>{p.medium} · {p.year}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" style={{ padding: "80px 48px 120px", background: "#eae7e0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center" }}>
          <FadeIn direction="right">
            <div>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#a09da8", marginBottom: 20 }}>About the Artist</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, lineHeight: 1.2, color: "#1a1f3d" }}>Elara Voss</h2>
              <div style={{ width: 40, height: 1, background: "#1a1f3d", opacity: 0.2, margin: "28px 0" }} />
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#6b6880", fontWeight: 300, marginBottom: 20 }}>Born in the Pacific Northwest, Elara has spent two decades painting the nocturnal world — the spaces between twilight and dawn where nature reveals a quieter, more luminous self.</p>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#6b6880", fontWeight: 300, marginBottom: 20 }}>Her work has been shown at the Portland Museum of Art, the Cascade Gallery, and in private collections across North America, Europe, and Japan.</p>
              <p style={{ fontSize: 14, lineHeight: 1.9, color: "#6b6880", fontWeight: 300 }}>Each painting begins outdoors, often in complete darkness, sketching by feel and returning to the studio to translate the emotional imprint of the night into oil and pigment.</p>
            </div>
          </FadeIn>
          <FadeIn direction="left" delay={0.2}>
            <div style={{ position: "relative" }}>
              <div style={{ background: "linear-gradient(160deg, #1a1f3d, #2a1f3d)", borderRadius: 2, aspectRatio: "3/4", position: "relative", overflow: "hidden" }}>
                <svg viewBox="0 0 300 400" style={{ width: "100%", height: "100%" }}>
                  <defs><linearGradient id="portrait-bg" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#1a1f3d" /><stop offset="100%" stopColor="#2a1f3d" /></linearGradient></defs>
                  <rect width="300" height="400" fill="url(#portrait-bg)" />
                  <ellipse cx="150" cy="140" rx="35" ry="42" fill="rgba(245,242,237,0.08)" />
                  <rect x="115" y="180" width="70" height="120" rx="20" fill="rgba(245,242,237,0.06)" />
                  <line x1="200" y1="160" x2="230" y2="300" stroke="rgba(245,242,237,0.1)" strokeWidth="2" />
                  <line x1="240" y1="160" x2="210" y2="300" stroke="rgba(245,242,237,0.1)" strokeWidth="2" />
                  <rect x="195" y="155" width="50" height="35" rx="1" fill="rgba(245,242,237,0.05)" stroke="rgba(245,242,237,0.1)" strokeWidth="0.5" />
                  {[{x:40,y:50},{x:260,y:30},{x:20,y:200},{x:270,y:150},{x:80,y:20},{x:250,y:370}].map((s,i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={1.2} fill="#e8e4d9" opacity={0.2+i*0.03} />
                  ))}
                </svg>
                <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: "italic", color: "rgba(245,242,237,0.5)", lineHeight: 1.6 }}>
                  "I paint what the night feels like when you stop trying to see."
                </div>
              </div>
              <div style={{ position: "absolute", top: -12, right: -12, width: "100%", height: "100%", border: "1px solid rgba(26,31,61,0.08)", borderRadius: 2, zIndex: -1 }} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ RECOGNITION ═══ */}
      <section style={{ padding: "80px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn><div style={{ textAlign: "center", marginBottom: 48 }}><div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#a09da8" }}>Recognition</div></div></FadeIn>
        <div style={{ display: "flex", justifyContent: "center", gap: 80, flexWrap: "wrap" }}>
          {["Portland Museum of Art", "Cascade Gallery", "Luna Biennale", "Night Visions Collective"].map((name, i) => (
            <FadeIn key={i} delay={i * 0.1}><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: "#1a1f3d", opacity: 0.4, whiteSpace: "nowrap" }}>{name}</div></FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ padding: "80px 48px 120px", background: "#1a1f3d", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, width: Math.random()*2+0.5, height: Math.random()*2+0.5, borderRadius: "50%", background: "#e8e4d9", opacity: Math.random()*0.2+0.05 }} />
          ))}
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(245,242,237,0.4)", marginBottom: 20 }}>Get in Touch</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: "#f5f2ed", lineHeight: 1.2 }}>Commissions &<br /><em style={{ fontStyle: "italic" }}>Inquiries</em></h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(245,242,237,0.5)", fontWeight: 300, marginTop: 20, marginBottom: 40 }}>Available for commissioned works, exhibitions, and private viewings. Every painting begins with a conversation about the night that moves you.</p>
            <button className="cta-btn" style={{ borderColor: "rgba(245,242,237,0.3)", color: "#f5f2ed" }}
              onMouseEnter={e => { e.target.style.background = "#f5f2ed"; e.target.style.color = "#1a1f3d"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#f5f2ed"; }}
            >Write to Elara</button>
            <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 40 }}>
              {["Instagram", "Studio Visits", "Newsletter"].map((link) => (
                <span key={link} style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(245,242,237,0.3)", cursor: "pointer" }}>{link}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(26,31,61,0.06)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 300, color: "#a09da8" }}>Elara Voss</div>
        <div style={{ fontSize: 11, color: "#c4bfb6", letterSpacing: 1 }}>© 2026 · All works and images</div>
      </footer>

      {/* ═══ MODAL ═══ */}
      {selectedWork && (
        <div className="modal-overlay" onClick={() => setSelectedWork(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ position: "relative" }}>
              <svg viewBox="0 0 720 400" style={{ width: "100%", display: "block" }}>
                <defs><linearGradient id="modal-sky" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stopColor={selectedWork.color} /><stop offset="100%" stopColor={`${selectedWork.color}dd`} /></linearGradient></defs>
                <rect width="720" height="400" fill="url(#modal-sky)" />
                <circle cx={500} cy={100} r={35} fill="#e8e4d9" opacity={0.15} />
                {Array.from({ length: 15 }, (_, j) => (<polygon key={j} points={`${j*50+10},280 ${j*50+35},${180+j*6} ${j*50+60},280`} fill={`rgba(5,8,18,${0.25+j*0.03})`} />))}
                <rect y="280" width="720" height="120" fill="rgba(5,8,18,0.2)" />
                {Array.from({ length: 12 }, (_, j) => (<circle key={j} cx={30+j*60} cy={25+j*12} r={1} fill="#e8e4d9" opacity={0.2} />))}
              </svg>
              <button onClick={() => setSelectedWork(null)} style={{
                position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%",
                background: "rgba(245,242,237,0.9)", border: "none", cursor: "pointer", fontSize: 18, color: "#1a1f3d",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>
            </div>
            <div style={{ padding: "40px 48px 48px" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: "#1a1f3d" }}>{selectedWork.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#6b6880", fontWeight: 300, marginTop: 12 }}>{selectedWork.description}</p>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(26,31,61,0.08)", display: "flex", gap: 32 }}>
                {[["Medium", selectedWork.medium], ["Size", selectedWork.size], ["Year", selectedWork.year]].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#a09da8", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: "#1a1f3d", fontWeight: 300 }}>{val}</div>
                  </div>
                ))}
              </div>
              <button className="cta-btn" style={{ marginTop: 32 }}>Inquire About This Work</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
