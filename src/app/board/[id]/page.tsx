import { db } from '@/db';
import { topics, sources } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ShieldAlert, ArrowLeft, ExternalLink, ThumbsUp, ThumbsDown, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
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
  const allSources = sourceRows;

  // Determine icons and titles based on type
  const isThesis = topic.type === 'thesis';
  const isExplain = topic.type === 'explain';
  const isFactCheck = topic.type === 'fact_check';

  const TopicIcon = isThesis ? ShieldAlert : isExplain ? BookOpen : CheckCircle;
  const subtitle = isThesis ? "Curated Debate Board" : isExplain ? "AI Concept Explanation" : "Fact Check Report";

  return (
    <main className="min-h-screen bg-[#020202] text-zinc-100 p-6 md:p-12 relative overflow-hidden">
      {/* Liquid Glass Background */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 group bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Campus OS
        </Link>

        <header className="mb-12 flex items-center gap-5 bg-white/[0.03] backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-xl">
          <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/20 shrink-0 shadow-inner">
            <TopicIcon className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{topic.title}</h1>
            <p className="text-indigo-300/80 font-medium mt-1">{subtitle}</p>
          </div>
        </header>

        {isExplain && topic.answer && (
          <div className="mb-12 bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-6 text-indigo-400">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-white">Simple Explanation</h2>
            </div>
            <p className="text-lg text-zinc-300 leading-relaxed relative z-10">
              {topic.answer}
            </p>
          </div>
        )}

        {(isThesis || isFactCheck) && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* PRO / VERIFY COLUMN */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white/90">
                  {isThesis ? "Supporting Arguments" : "Verifying Sources"}
                </h2>
                <span className="ml-auto text-sm font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10">{proSources.length} sources</span>
              </div>
              
              <div className="space-y-4">
                {proSources.map((source) => (
                  <SourceCard key={source.id} source={source} />
                ))}
                {proSources.length === 0 && (
                  <EmptyState message="No supporting arguments found." />
                )}
              </div>
            </section>

            {/* CON / DEBUNK COLUMN */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-500/30">
                  <ThumbsDown className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white/90">
                  {isThesis ? "Opposing Arguments" : "Debunking Sources"}
                </h2>
                <span className="ml-auto text-sm font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10">{conSources.length} sources</span>
              </div>
              
              <div className="space-y-4">
                {conSources.map((source) => (
                  <SourceCard key={source.id} source={source} />
                ))}
                {conSources.length === 0 && (
                  <EmptyState message="No opposing arguments found." />
                )}
              </div>
            </section>
          </div>
        )}

        {isExplain && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white/90 mb-6 pl-2 border-l-4 border-indigo-500">
              Further Reading
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {allSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SourceCard({ source }: { source: any }) {
  return (
    <div className="bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 group">
      <h3 className="font-bold text-lg mb-3 leading-snug group-hover:text-indigo-300 transition-colors">
        {source.title}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-5 line-clamp-3">
        {source.snippet}
      </p>
      <a 
        href={source.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-lg transition-colors"
      >
        Read Full Source <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-zinc-500 text-center py-10 bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/5 border-dashed">
      {message}
    </p>
  );
}
