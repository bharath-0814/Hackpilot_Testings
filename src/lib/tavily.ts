export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilyResponse {
  results: TavilySearchResult[];
  answer?: string;
}

export async function searchTavily(query: string, includeAnswer = false): Promise<TavilyResponse> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("Missing TAVILY_API_KEY");

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: query,
      search_depth: "basic",
      include_answer: includeAnswer,
      include_images: false,
      include_raw_content: false,
      max_results: 6,
    }),
  });

  if (!res.ok) {
    throw new Error(`Tavily API error: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    results: data.results,
    answer: data.answer,
  };
}
