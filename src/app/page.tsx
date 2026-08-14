"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldAlert, Sparkles } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicTitle: topic })
      });
      
      const data = await res.json();
      if (data.topicId) {
        router.push(`/board/${data.topicId}`);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[128px]" />
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white/[0.02] backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <ShieldAlert className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
            Thesis Defender
          </h1>
          <p className="text-zinc-400 text-center mb-10 text-lg leading-relaxed">
            Type your thesis. We deep-search the web for the strongest opposing and supporting arguments to build your debate board.
          </p>

          <form onSubmit={handleResearch} className="relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-500" />
            </div>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Standardized testing should be banned"
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-36 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !topic}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Researching..." : (
                <>Defend <Sparkles className="w-4 h-4"/></>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
