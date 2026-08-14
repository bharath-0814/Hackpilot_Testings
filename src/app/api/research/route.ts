import { NextResponse } from 'next/server';
import { db } from '@/db';
import { topics, sources } from '@/db/schema';
import { searchTavily } from '@/lib/tavily';
import { withDemoSafe, SEED_DATA } from '@/lib/demosafe';

export async function POST(req: Request) {
  try {
    const { topicTitle } = await req.json();
    if (!topicTitle) {
      return NextResponse.json({ error: "Missing topicTitle" }, { status: 400 });
    }

    // 1. Create a Topic entry in Turso
    const topicId = crypto.randomUUID();
    await db.insert(topics).values({
      id: topicId,
      title: topicTitle,
    });

    // 2. Fetch from Tavily with a Demo-safe fallback (5 second timeout)
    const rawResults = await withDemoSafe(
      searchTavily(`arguments for and against: ${topicTitle}`),
      SEED_DATA.map(d => ({ title: d.title, url: d.url, content: d.content, score: 1 })),
      5000
    );

    // 3. Very naive classification for the sake of a fast hackathon demo
    const sourceInserts = rawResults.map((r, i) => ({
      id: crypto.randomUUID(),
      topicId: topicId,
      title: r.title,
      url: r.url,
      snippet: r.content,
      // Just alternate stances or guess based on keywords if we want to be fancy.
      // We'll alternate for now to guarantee 50/50 split on the board.
      stance: i % 2 === 0 ? 'pro' : 'con',
    }));

    // 4. Save to Turso
    if (sourceInserts.length > 0) {
      await db.insert(sources).values(sourceInserts);
    }

    return NextResponse.json({ topicId, sources: sourceInserts });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
