import React, { useState, useEffect } from "react";
import { Sparkles, Link2, Copy, Check, Clock } from "lucide-react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Your API connection, updated to handle arrays
  async function handleShorten(e) {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      const data = await response.json();
      
      // Create a new link object matching the UI needs
      const newLink = {
        id: Date.now(),
        longUrl: url,
        shortCode: data.short_code,
        shortUrl: `http://127.0.0.1:8000/${data.short_code}`,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        timeLeft: "24:00:00",
      };

      setLinks([newLink, ...links]);
      setUrl("");
    } catch (error) {
      console.error("Failed to shorten URL:", error);
      alert("Backend connection failed. Is your server running on port 8000?");
    } finally {
      setIsLoading(false);
    }
  }

  // 2. Updated Copy Handler
  async function handleCopy(fullUrl, id) {
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  }

  // 3. Countdown Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setLinks((prevLinks) =>
        prevLinks
          .map((link) => {
            const difference = link.expiresAt - Date.now();
            if (difference <= 0) return null; // Drop expired links

            const hours = Math.floor(difference / (1000 * 60 * 60)).toString().padStart(2, "0");
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
            const seconds = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, "0");

            return { ...link, timeLeft: `${hours}:${minutes}:${seconds}` };
          })
          .filter(Boolean)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white font-sans antialiased selection:bg-yellow-300 selection:text-black overflow-hidden relative">
      
      {/* Background Confetti/Shapes Simulation */}
      <div className="absolute top-20 left-10 w-4 h-12 bg-pink-500 rounded-full rotate-45 blur-[2px] opacity-70"></div>
      <div className="absolute top-40 right-20 w-3 h-16 bg-cyan-400 rounded-full rotate-[30deg] blur-[2px] opacity-70"></div>
      <div className="absolute bottom-20 left-20 w-6 h-2 bg-yellow-300 rounded-full -rotate-12 blur-[2px] opacity-70"></div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2 cursor-pointer group">
          <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 drop-shadow-md">
            SHAWTY.*
          </span>
          <div className="bg-fuchsia-500 p-2 rounded-xl rotate-[-6deg] group-hover:rotate-[6deg] transition-transform duration-300 shadow-[2px_2px_0px_0px_rgba(253,224,71,1)]">
            <Link2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm font-medium backdrop-blur-sm">
          <span>Links self-destruct in 24h</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-10 pb-24 max-w-3xl text-center relative z-10">
        
        {/* Eyebrow / Hook */}
        <div className="inline-flex items-center space-x-2 bg-yellow-300 text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-[3px_3px_0px_0px_rgba(236,72,153,1)]">
          <span>Make 'Em Short, Watch 'Em Fade</span>
          <Sparkles className="w-3.5 h-3.5 fill-black" />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          The Link Shortener with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 italic pr-2">
            COMMITMENT ISSUES.
          </span>
        </h1>

        <p className="text-base md:text-lg text-purple-200/80 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Drop a massive link. Get a gorgeous Shawty link. It vanishes from the face of the earth in exactly 24 hours. No logs, no bloating.
        </p>

        {/* Form */}
        <form onSubmit={handleShorten} className="w-full mb-12">
          <div className="relative flex flex-col md:flex-row gap-0 p-2 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-[0_0_30px_rgba(236,72,153,0.15)] focus-within:border-pink-400/50 transition-all">
            <input
              type="url"
              required
              value={url}
              name="original_url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long, ugly URL here..."
              className="flex-1 bg-transparent px-6 py-4 text-white placeholder-purple-300/50 font-medium focus:outline-none text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold px-8 py-4 m-1 rounded-3xl shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(253,224,71,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(253,224,71,1)] transition-all flex items-center justify-center whitespace-nowrap text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Shortening..." : "Shorten It!"}
            </button>
          </div>
        </form>

        {/* Links Display */}
        <div className="space-y-4 text-left">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all backdrop-blur-md shadow-lg"
            >
              <div className="flex-1 min-w-0">
                <a 
                  href={link.shortUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-yellow-300 font-bold text-xl mb-1 hover:underline decoration-pink-500 decoration-2 underline-offset-4 break-all"
                >
                  shawty.it/{link.shortCode}
                </a>
                <p className="text-sm text-purple-300/60 truncate pr-4">
                  {link.longUrl}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Timer Pill */}
                <div className="flex items-center space-x-1.5 bg-pink-500/20 border border-pink-500/50 text-pink-200 px-3 py-2 rounded-xl text-sm font-mono font-bold tracking-widest shadow-[inset_0_0_10px_rgba(236,72,153,0.2)]">
                  <Clock className="w-4 h-4" />
                  <span>{link.timeLeft}</span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(link.shortUrl, link.id)}
                  className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center gap-1 min-w-[60px] border ${
                    copiedId === link.id
                      ? "bg-green-500/20 border-green-500/50 text-green-400"
                      : "bg-white/5 border-white/10 text-purple-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {copiedId === link.id ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;