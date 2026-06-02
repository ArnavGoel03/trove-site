import type { MetadataRoute } from "next";

// Explicitly welcome AI answer-engine crawlers in addition to the usual
// search bots. Naming each agent (rather than relying on the wildcard) is
// what some of these crawlers check for before they will index or cite a
// site. Everything is allowed; there is nothing on this marketing site we
// need to hide from an LLM. /llms.txt and /llms-full.txt are advertised in
// the body of the homepage and sitemap; robots links the sitemap so the
// crawl entry point is unambiguous.

const AI_AGENTS = [
  "GPTBot", // OpenAI training crawler
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing on behalf of a user
  "ClaudeBot", // Anthropic crawler
  "Claude-Web", // Anthropic browsing
  "anthropic-ai", // Anthropic
  "PerplexityBot", // Perplexity crawler
  "Perplexity-User", // Perplexity browsing
  "Google-Extended", // Google Gemini / AI Overviews training opt-in
  "GoogleOther", // Google non-search fetchers
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot",
  "Bytespider", // TikTok / Doubao
  "CCBot", // Common Crawl (feeds many models)
  "cohere-ai",
  "Diffbot",
  "DuckAssistBot",
  "meta-externalagent", // Meta AI
  "FacebookBot",
  "YouBot",
  "Timpibot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://gettrove.vercel.app/sitemap.xml",
    host: "https://gettrove.vercel.app",
  };
}
