import { useState } from "react";
import { toast } from "sonner";

export function useGenerate() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (system: string, prompt: string) => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ system, prompt }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        if (res.status === 429) toast.error("Rate limit hit. Please wait a moment.");
        else if (res.status === 402) toast.error("AI credits exhausted. Add credits in Settings.");
        else toast.error(data.error || "AI request failed");
        return;
      }
      setOutput(data.text || "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return { output, loading, generate, setOutput };
}
