import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { generateText } from "ai";

type Body = { system?: string; prompt?: string };

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { system, prompt } = (await request.json()) as Body;
        if (!prompt || typeof prompt !== "string") {
          return new Response(JSON.stringify({ error: "Prompt is required" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response(
            JSON.stringify({ error: "AI service not configured" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
        try {
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");
          const { text } = await generateText({
            model,
            system: system ?? "You are a professional workplace productivity assistant.",
            prompt,
          });
          return new Response(JSON.stringify({ text }), {
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "AI request failed";
          const status = /429/.test(message) ? 429 : /402/.test(message) ? 402 : 500;
          return new Response(JSON.stringify({ error: message }), {
            status,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
