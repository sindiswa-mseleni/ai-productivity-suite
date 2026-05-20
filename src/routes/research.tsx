import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AiOutput } from "@/components/AiOutput";
import { useGenerate } from "@/lib/use-generate";
import { Search, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Workmate AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Executive team");
  const [depth, setDepth] = useState("Briefing");
  const { output, loading, generate } = useGenerate();

  const submit = () => {
    if (!topic.trim()) return;
    const prompt = `Produce a ${depth.toLowerCase()} on the following topic for ${audience}.

Topic: ${topic}

Return markdown with:
## Executive Summary
3-4 sentences.

## Key Insights
Bullet list of 5-8 insights.

## Considerations / Trade-offs
Bullet list.

## Suggested Next Steps
Numbered list.

Be balanced, cite reasoning, and note where the user should verify facts.`;
    generate(
      "You are a senior research analyst. Provide structured, balanced briefings. Note when claims require verification.",
      prompt,
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Get a structured briefing on any topic, tailored to your audience."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <div>
            <Label>Topic / question</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Pros and cons of adopting a 4-day work week"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Executive team", "Engineering team", "Marketing team", "General staff", "Clients"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Quick overview", "Briefing", "Deep dive"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={submit}
            disabled={loading || !topic.trim()}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Researching..." : "Run Research"}
          </Button>
          <p className="text-xs text-muted-foreground">
            AI may produce outdated or inaccurate facts. Verify critical claims independently.
          </p>
        </div>
        <AiOutput value={output} loading={loading} emptyHint="Your research briefing will appear here." />
      </div>
    </div>
  );
}
