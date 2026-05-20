import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiOutput } from "@/components/AiOutput";
import { useGenerate } from "@/lib/use-generate";
import { FileText, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — Workmate AI" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const { output, loading, generate } = useGenerate();

  const submit = () => {
    if (!notes.trim()) return;
    const prompt = `Summarize the following meeting notes / transcript. Return markdown with these sections:

## Summary
A 2-4 sentence overview.

## Key Decisions
Bullet list.

## Action Items
A markdown table with columns: Owner | Task | Due.

## Open Questions
Bullet list.

Meeting content:
"""
${notes}
"""`;
    generate(
      "You are an expert meeting analyst. Produce concise, structured summaries.",
      prompt,
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste a transcript or rough notes — get a structured summary with action items."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <div>
            <Label>Meeting notes or transcript</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[340px]"
              placeholder="Paste your meeting transcript, Zoom captions, or rough notes here..."
            />
          </div>
          <Button
            onClick={submit}
            disabled={loading || !notes.trim()}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Summarizing..." : "Summarize Meeting"}
          </Button>
        </div>
        <AiOutput value={output} loading={loading} emptyHint="Your meeting summary will appear here." />
      </div>
    </div>
  );
}
