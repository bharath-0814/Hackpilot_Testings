"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldAlert, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

type ToolType = 'thesis' | 'explain' | 'fact_check';

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>('thesis');
  const router = useRouter();

  const tools = [
    { id: 'thesis', name: 'Thesis Defender', icon: ShieldAlert, desc: 'Find pro & con arguments' },
    { id: 'explain', name: 'Concept Explainer', icon: BookOpen, desc: 'Simplify dense topics' },
    { id: 'fact_check', name: 'Fact Checker', icon: CheckCircle, desc: 'Verify wild claims' },
  ];

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicTitle: topic, type: activeTool })
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
    <main className="min-h-screen bg-[#020202] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Liquid Glass Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-rose-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000" />
      
      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white/60 drop-shadow-sm">
            Campus OS
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            The ultimate AI suite for your college life. Break echo chambers, simplify dense concepts, and fact-check claims in seconds.
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden">
          {/* Subtle inner glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none" />

          {/* Tool Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as ToolType)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-500/20 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-3 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                  <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>{tool.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{tool.desc}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleResearch} className="relative z-10">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-indigo-300/50" />
            </div>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                activeTool === 'thesis' ? "e.g. Standardized testing should be banned" :
                activeTool === 'explain' ? "e.g. How does Quantum Entanglement work?" :
                "e.g. Drinking coffee stunts your growth"
              }
              className="w-full bg-black/30 border border-white/20 rounded-2xl py-6 pl-16 pr-40 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600 text-white shadow-inner"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !topic}
              className="absolute right-3 top-3 bottom-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl px-8 font-semibold transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              {loading ? "Thinking..." : (
                <>Execute <Sparkles className="w-5 h-5"/></>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
