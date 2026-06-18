import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Check, Link2, Zap, Clock, ArrowRight, Sun, Moon } from "lucide-react";

interface ShawtyLink {
  original: string;
  shortCode: string;
  createdAt: number;
  expiresAt: number;
}
const API_BASE_URL = import.meta.env.VITE_API_URL;
const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE;

function formatTimeLeft(ms: number) {
  if (ms <= 0) return { h: "00", m: "00", s: "00", total: 0 };
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
    total: totalSec,
  };
}

// ── Theme definitions ────────────────────────────────────────────────────────
type Theme = "dark" | "light";

const themes = {
  dark: {
    bg: "#0D0221",
    fg: "#F5F0FF",
    fgMuted: "rgba(245,240,255,0.5)",
    card: "linear-gradient(135deg, #1A0A35 0%, #2A1050 100%)",
    cardBorder: "rgba(255,255,255,0.08)",
    inputBg: "#1A0A35",
    inputBorder: "rgba(255,255,255,0.1)",
    inputBorderFocus: "#FF2D78",
    primary: "#FF2D78",
    accent: "#00FFB2",
    accentFg: "#0D0221",
    yellow: "#FFE900",
    yellowFg: "#0D0221",
    navPillBg: "rgba(255,233,0,0.12)",
    navPillColor: "#FFE900",
    navPillBorder: "rgba(255,233,0,0.25)",
    resultBg: "linear-gradient(135deg, #1A0A35 0%, #2A0A4A 100%)",
    resultBorder: "rgba(255,45,120,0.3)",
    resultGlow: "0 0 60px rgba(255,45,120,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
    urlBg: "rgba(0,0,0,0.3)",
    urlBorder: "rgba(0,255,178,0.2)",
    timerLabelColor: "rgba(245,240,255,0.35)",
    progressBg: "rgba(255,255,255,0.1)",
    featureCard: "linear-gradient(135deg, #1A0A35 0%, #200C3F 100%)",
    toggleBg: "rgba(255,255,255,0.08)",
    toggleBorder: "rgba(255,255,255,0.15)",
    toggleColor: "#FFE900",
    footerColor: "rgba(245,240,255,0.2)",
    shapeBorder1: "#FFE900",
    shapeFill1: "#FF2D78",
    shapeFill2: "#00FFB2",
    shapeBorder2: "#3D5CFF",
    glow1: "rgba(255,45,120,0.15)",
    glow2: "rgba(0,255,178,0.08)",
    copyActiveBg: "#00FFB2",
    copyActiveColor: "#0D0221",
    copyIdleBg: "rgba(255,255,255,0.1)",
    copyIdleColor: "#F5F0FF",
    copyIdleBorder: "rgba(255,255,255,0.15)",
    tagBg: "rgba(0,255,178,0.12)",
    tagColor: "#00FFB2",
    tagBorder: "rgba(0,255,178,0.25)",
    expiredColor: "#FF2D78",
    deleteBtnColor: "rgba(255,45,120,0.6)",
  },
  light: {
    bg: "#FFFBEA",
    fg: "#1A0533",
    fgMuted: "rgba(26,5,51,0.5)",
    card: "linear-gradient(135deg, #FFF0FA 0%, #EEE8FF 100%)",
    cardBorder: "rgba(180,0,120,0.12)",
    inputBg: "#FFF0FA",
    inputBorder: "rgba(180,0,120,0.2)",
    inputBorderFocus: "#E8005A",
    primary: "#E8005A",
    accent: "#008060",
    accentFg: "#FFFFFF",
    yellow: "#C47F00",
    yellowFg: "#FFFFFF",
    navPillBg: "rgba(196,127,0,0.12)",
    navPillColor: "#C47F00",
    navPillBorder: "rgba(196,127,0,0.3)",
    resultBg: "linear-gradient(135deg, #FFF0FA 0%, #EEE8FF 100%)",
    resultBorder: "rgba(232,0,90,0.3)",
    resultGlow: "0 0 60px rgba(232,0,90,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
    urlBg: "rgba(255,255,255,0.6)",
    urlBorder: "rgba(0,128,96,0.25)",
    timerLabelColor: "rgba(26,5,51,0.4)",
    progressBg: "rgba(0,0,0,0.08)",
    featureCard: "linear-gradient(135deg, #FFF0FA 0%, #F5EEFF 100%)",
    toggleBg: "rgba(26,5,51,0.06)",
    toggleBorder: "rgba(26,5,51,0.15)",
    toggleColor: "#6D28D9",
    footerColor: "rgba(26,5,51,0.25)",
    shapeBorder1: "#C47F00",
    shapeFill1: "#E8005A",
    shapeFill2: "#008060",
    shapeBorder2: "#4F46E5",
    glow1: "rgba(232,0,90,0.08)",
    glow2: "rgba(0,128,96,0.05)",
    copyActiveBg: "#008060",
    copyActiveColor: "#FFFFFF",
    copyIdleBg: "rgba(26,5,51,0.06)",
    copyIdleColor: "#1A0533",
    copyIdleBorder: "rgba(26,5,51,0.15)",
    tagBg: "rgba(0,128,96,0.1)",
    tagColor: "#006B50",
    tagBorder: "rgba(0,128,96,0.2)",
    expiredColor: "#E8005A",
    deleteBtnColor: "rgba(232,0,90,0.5)",
  },
} as const;

// ── Sub-components ───────────────────────────────────────────────────────────

function CountdownUnit({ value, label, color, fg }: { value: string; label: string; color: string; fg: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-3xl md:text-4xl font-black tabular-nums rounded-xl px-4 py-2 min-w-[72px] text-center"
        style={{ fontFamily: "Unbounded, sans-serif", background: color, color: fg }}
      >
        {value}
      </div>
      <span className="text-xs mt-1 font-medium uppercase tracking-widest" style={{ color: "var(--timer-label)" }}>
        {label}
      </span>
    </div>
  );
}

function CountdownTimer({ expiresAt, th }: { expiresAt: number; th: typeof themes.dark }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = expiresAt - now;
  const { h, m, s, total } = formatTimeLeft(remaining);
  const pct = Math.max(0, Math.min(1, total / (24 * 3600)));

  if (remaining <= 0) {
    return (
      <div className="text-center py-2" style={{ color: th.expiredColor }}>
        <span style={{ fontFamily: "DM Mono, monospace" }} className="font-medium text-sm">
          💀 Link expired
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 justify-center">
        <CountdownUnit value={h} label="hrs" color={th.yellow} fg={th.yellowFg} />
        <div className="text-3xl font-black self-center" style={{ fontFamily: "Unbounded", color: th.primary, marginTop: "-12px" }}>:</div>
        <CountdownUnit value={m} label="min" color={th.accent} fg={th.accentFg} />
        <div className="text-3xl font-black self-center" style={{ fontFamily: "Unbounded", color: th.primary, marginTop: "-12px" }}>:</div>
        <CountdownUnit value={s} label="sec" color={th.primary} fg="#fff" />
      </div>
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: th.progressBg }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg, ${th.primary}, ${th.yellow}, ${th.accent})` }}
        />
      </div>
    </div>
  );
}

function CopyButton({ text, th }: { text: string; th: typeof themes.dark }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95"
      style={{
        background: copied ? th.copyActiveBg : th.copyIdleBg,
        color: copied ? th.copyActiveColor : th.copyIdleColor,
        border: `1px solid ${th.copyIdleBorder}`,
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}


// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [inputUrl, setInputUrl] = useState("");
  const [links, setLinks] = useState<ShawtyLink[]>([]);
  const [isShortening, setIsShortening] = useState(false);
  const [error, setError] = useState("");
  const [latestShortCode, setLatestShortCode] = useState<string | null>(null); // FIX: renamed from latestSlug
  const inputRef = useRef<HTMLInputElement>(null);
  const th = themes[theme];

  // Clean up expired links every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLinks((prev) => prev.filter((l) => Date.now() < l.expiresAt + 5000));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const isValidUrl = (val: string) => {
    try {
      const u = new URL(val.startsWith("http") ? val : `https://${val}`);
      return u.hostname.includes(".");
    } catch { return false; }
  };

  const handleShorten = async () => {
    const raw = inputUrl.trim();
    if (!raw) return;
    if (!isValidUrl(raw)) {
      setError("That doesn't look like a valid URL, bestie.");
      return;
    }

    setError("");
    setIsShortening(true);

    const normalized = raw.startsWith("http") ? raw : `https://${raw}`;

    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalized }),
      });

      // FIX: handle non-2xx responses
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const shortCode = data.short_code; // FIX: store in clearly named variable

      const now = Date.now();

      // FIX: use shortCode to match the ShawtyLink interface field name
      const newLink: ShawtyLink = {
        original: normalized,
        shortCode,                            // FIX: was `slug` — now matches interface
        createdAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000,
      };

      setLinks((prev) => [newLink, ...prev]);
      setLatestShortCode(shortCode);          // FIX: was setLatestSlug(slug)
      setInputUrl("");
    } catch (err) {
      // FIX: surface the error to the user instead of silently hanging
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(`Couldn't shorten that link — ${message}`);
    } finally {
      // FIX: always reset loading state, even on failure
      setIsShortening(false);
    }
  };

  // FIX: find by shortCode instead of slug
  const latestLink = links.find((l) => l.shortCode === latestShortCode);

  return (
    <div className="min-h-screen w-full relative transition-colors duration-500"
      style={{ background: th.bg, fontFamily: "DM Sans, sans-serif", color: th.fg }}>

      {/* Glow blobs */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, top: -150, right: -100, background: `radial-gradient(circle, ${th.glow1} 0%, transparent 70%)` }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 600, height: 600, bottom: -200, left: -200, background: `radial-gradient(circle, ${th.glow2} 0%, transparent 70%)` }} />

      {/* Memphis shapes */}
      <div className="absolute pointer-events-none" style={{ width: 80, height: 80, top: 120, left: "8%", border: `3px solid ${th.shapeBorder1}`, transform: "rotate(24deg)", opacity: 0.4 }} />
      <div className="absolute pointer-events-none rounded-full" style={{ width: 50, height: 50, top: 200, right: "12%", background: th.shapeFill1, opacity: 0.25 }} />
      <div className="absolute pointer-events-none" style={{ width: 30, height: 30, top: 340, left: "18%", background: th.shapeFill2, opacity: 0.3, transform: "rotate(45deg)" }} />
      <div className="absolute pointer-events-none rounded-full" style={{ width: 120, height: 120, top: 80, right: "20%", border: `3px solid ${th.shapeBorder2}`, opacity: 0.2 }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: th.primary }}>
            <Link2 size={18} color="#fff" />
          </div>
          <span className="text-2xl font-black" style={{ fontFamily: "Unbounded, sans-serif", letterSpacing: "-0.03em" }}>
            SHAWTY
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{ background: th.navPillBg, color: th.navPillColor, border: `1px solid ${th.navPillBorder}`, fontFamily: "DM Mono, monospace" }}>
            <Clock size={12} />
            Links live 24hrs only
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{ background: th.toggleBg, border: `1px solid ${th.toggleBorder}`, color: th.toggleColor }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ background: th.tagBg, color: th.tagColor, border: `1px solid ${th.tagBorder}` }}>
          ✦ ephemeral links, zero drama ✦
        </span>

        <h1 className="text-5xl md:text-7xl font-black mb-5 leading-none"
          style={{ fontFamily: "Unbounded, sans-serif", letterSpacing: "-0.04em" }}>
          Short links that{" "}
          <span style={{ background: "linear-gradient(90deg, #FF2D78, #FFE900, #00FFB2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            vanish.
          </span>
        </h1>

        <p className="text-lg mb-10" style={{ color: th.fgMuted, maxWidth: 480, margin: "0 auto 2.5rem" }}>
          Paste a URL, get a shawty link. Share it. Watch it die in 24 hours. No account. No trace. Pure chaos.
        </p>

        {/* Input */}
        <div className="relative">
          <div className="flex items-center rounded-2xl overflow-hidden p-2 gap-2 transition-all duration-200"
            style={{
              background: th.inputBg,
              border: `2px solid ${error ? th.primary : th.inputBorder}`,
              boxShadow: `0 0 40px ${th.glow1}`,
            }}>
            <Link2 size={18} className="ml-3 shrink-0" style={{ color: th.fgMuted }} />
            <input
              ref={inputRef}
              type="url"
              value={inputUrl}
              onChange={(e) => { setInputUrl(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              placeholder="paste your long, ugly URL here..."
              className="flex-1 bg-transparent outline-none text-base min-w-0 py-3"
              style={{ fontFamily: "DM Mono, monospace", color: th.fg }}
            />
            <button
              onClick={handleShorten}
              disabled={isShortening || !inputUrl.trim()}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: isShortening ? `${th.primary}80` : th.primary, color: "#fff", fontFamily: "Unbounded, sans-serif", fontSize: "0.8rem", letterSpacing: "0.02em" }}>
              {isShortening ? <span className="animate-pulse">...</span> : <><span>SHAWT IT</span><ArrowRight size={14} /></>}
            </button>
          </div>
          {error && (
            <p className="text-sm mt-2 text-left pl-2" style={{ color: th.primary, fontFamily: "DM Mono, monospace" }}>
              ⚠ {error}
            </p>
          )}
        </div>
      </main>

      {/* Latest result */}
      {latestLink && (
        <section className="relative z-10 max-w-3xl mx-auto px-6 pb-8">
          <div className="rounded-3xl p-6 md:p-8 space-y-6 transition-all duration-500"
            style={{ background: th.resultBg, border: `2px solid ${th.resultBorder}`, boxShadow: th.resultGlow }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: th.yellow }} />
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: th.yellow, fontFamily: "DM Mono, monospace" }}>
                  Your shawty is ready!
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: `${th.yellow}18`, color: th.yellow, fontFamily: "DM Mono" }}>
                expires in 24 hrs
              </span>
            </div>

            {/* FIX: use latestLink.shortCode everywhere instead of latestLink.slug */}
            <div className="rounded-xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap"
              style={{ background: th.urlBg, border: `1px solid ${th.urlBorder}` }}>
              <span className="text-xl md:text-2xl font-bold" style={{ fontFamily: "DM Mono, monospace", color: th.accent }}>
                {SHORT_URL_BASE}/{latestLink.shortCode}
              </span>
              <CopyButton
              text={`${SHORT_URL_BASE}/${latestLink.shortCode}`} th={th} />
            </div>

            <div>
              <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: th.timerLabelColor, fontFamily: "DM Mono" }}>
                Time until it disappears
              </p>
              <CountdownTimer expiresAt={latestLink.expiresAt} th={th} />
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "💣", title: "Self-destructs", desc: "Every link explodes after exactly 24 hours. Nothing lasts forever, and that's the point.", color: th.primary },
            { icon: "👻", title: "No account", desc: "We don't want your email, your name, or your soul. Just paste and go.", color: th.yellow },
            { icon: "⚡", title: "Instant chaos", desc: "Shortened in milliseconds. Share it before it's gone. Speed is the vibe.", color: th.accent },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-6 space-y-3 transition-all duration-200 hover:-translate-y-1"
              style={{ background: th.featureCard, border: `1px solid ${f.color}22`, boxShadow: `0 4px 24px ${f.color}08` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${f.color}18` }}>
                {f.icon}
              </div>
              <h3 className="font-bold" style={{ fontFamily: "Unbounded, sans-serif", fontSize: "1rem", color: f.color }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: th.fgMuted }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-xs" style={{ color: th.footerColor, fontFamily: "DM Mono, monospace" }}>
        SHAWTY — links die, memories live &nbsp;✦&nbsp; not responsible for your chaos
      </footer>
    </div>
  );
}
