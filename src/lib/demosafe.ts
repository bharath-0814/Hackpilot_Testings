import { TavilyResponse } from "./tavily";

// Fallback seed data in case of API failure or timeout during demo
export const SEED_DATA: TavilyResponse = {
  answer: "This is a fallback generated explanation because the AI API timed out. In a real scenario, this would be a detailed summary of the topic.",
  results: [
    {
      title: "The Case Against Standardized Testing",
      url: "https://example.com/anti-testing",
      content: "Standardized tests are inherently biased and do not accurately predict long-term college success.",
      score: 1,
    },
    {
      title: "Why We Need Standardized Tests",
      url: "https://example.com/pro-testing",
      content: "Standardized tests provide a common metric to evaluate students from vastly different high schools.",
      score: 1,
    }
  ]
};

export async function withDemoSafe<T>(
  promise: Promise<T>,
  fallback: T,
  timeoutMs: number = 5000
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutHandle = setTimeout(() => {
      console.warn("Demosafe triggered: timeout reached, returning fallback data.");
      resolve(fallback);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    console.error("Demosafe triggered: network error, returning fallback data.", error);
    clearTimeout(timeoutHandle!);
    return fallback;
  }
}
