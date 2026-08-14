import { db } from '@/db';
import { topics, sources } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ShieldAlert, ArrowLeft, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: topicId } = await params;
  
  // Fetch topic
  const topicQuery = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1);
  if (topicQuery.length === 0) {
    notFound();
  }
  const topic = topicQuery[0];

  // Fetch sources
  const sourceRows = await db.select().from(sources).where(eq(sources.topicId, topicId));
  
  const proSources = sourceRows.filter(s => s.stance === 'pro');
  const conSources = sourceRows.filter(s => s.stance === 'con');

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Research
        </Link>

        <header className="mb-12 flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <ShieldAlert className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{topic.title}</h1>
            <p className="text-zinc-500 mt-2">Curated Debate Board</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* PRO COLUMN */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">Supporting Arguments</h2>
              <span className="ml-auto text-sm text-zinc-500">{proSources.length} sources</span>
            </div>
            
            <div className="space-y-4">
              {proSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
              {proSources.length === 0 && (
                <p className="text-zinc-500 text-center py-8 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
                  No supporting arguments found.
                </p>
              )}
            </div>
          </section>

          {/* CON COLUMN */}
          <section>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                <ThumbsDown className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">Opposing Arguments</h2>
              <span className="ml-auto text-sm text-zinc-500">{conSources.length} sources</span>
            </div>
            
            <div className="space-y-4">
              {conSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
              {conSources.length === 0 && (
                <p className="text-zinc-500 text-center py-8 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
                  No opposing arguments found.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SourceCard({ source }: { source: any }) {
  return (
    <div className="bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md p-5 rounded-2xl border border-white/10 transition-colors group">
      <h3 className="font-semibold text-lg mb-2 leading-tight group-hover:text-indigo-300 transition-colors">
        {source.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-4">
        {source.snippet}
      </p>
      <a 
        href={source.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center text-xs font-medium text-indigo-400 hover:text-indigo-300"
      >
        Read Full Source <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    </div>
  );
}
