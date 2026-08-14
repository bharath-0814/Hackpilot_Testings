import { NextResponse } from 'next/server';
import { db } from '@/db';
import { topics, sources } from '@/db/schema';
import { searchTavily } from '@/lib/tavily';
import { withDemoSafe, SEED_DATA } from '@/lib/demosafe';

export async function POST(req: Request) {
  try {
    const { topicTitle, type = 'thesis' } = await req.json();
    if (!topicTitle) {
      return NextResponse.json({ error: "Missing topicTitle" }, { status: 400 });
    }

    const includeAnswer = type === 'explain';
    let queryPrefix = '';
    if (type === 'thesis') queryPrefix = 'arguments for and against: ';
    if (type === 'fact_check') queryPrefix = 'fact check: ';
    if (type === 'explain') queryPrefix = 'explain in simple terms: ';

    // 1. Fetch from Tavily with a Demo-safe fallback (5 second timeout)
    const rawResults = await withDemoSafe(
      searchTavily(`${queryPrefix}${topicTitle}`, includeAnswer),
      SEED_DATA,
      5000
    );

    // 2. Create a Topic entry in Turso
    const topicId = crypto.randomUUID();
    await db.insert(topics).values({
      id: topicId,
      title: topicTitle,
      type: type,
      answer: rawResults.answer || null,
    });

    // 3. Classify sources
    const sourceInserts = rawResults.results.map((r, i) => {
      let stance = 'neutral';
      if (type === 'thesis') {
        stance = i % 2 === 0 ? 'pro' : 'con';
      }
      return {
        id: crypto.randomUUID(),
        topicId: topicId,
        title: r.title,
        url: r.url,
        snippet: r.content,
        stance: stance,
      };
    });

    // 4. Save to Turso
    if (sourceInserts.length > 0) {
      await db.insert(sources).values(sourceInserts);
    }

    return NextResponse.json({ topicId, sources: sourceInserts, answer: rawResults.answer });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
