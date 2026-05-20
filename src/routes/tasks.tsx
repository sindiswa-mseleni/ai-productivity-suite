import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AiOutput } from "@/components/AiOutput";
import { useGenerate } from "@/lib/use-generate";
import { ListChecks, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — Workmate AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [horizon, setHorizon] = useState("This week");
  const { output, loading, generate } = useGenerate();

  const submit = () => {
    if (!goal.trim()) return;
    const prompt = `Create a prioritized task plan.

Goal: ${goal}
Time horizon: ${horizon}
Deadline: ${deadline || "(none specified)"}
Additional context: ${context || "(none)"}

Return markdown with:
## Plan Overview
A short paragraph.

## Milestones
Numbered list.

## Tasks
A markdown table: Priority | Task | Owner | Estimate | Due

## Risks & Mitigations
Bullet list.`;
    generate(
      "You are a senior project manager who turns goals into clear, actionable plans.",
      prompt,
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Turn any goal into a clear, prioritized plan with milestones and tasks."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <div>
            <Label>Goal</Label>
            <Input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Launch Q3 marketing campaign"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Time horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Today", "This week", "This month", "This quarter"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline (optional)</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Context</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[180px]"
              placeholder="Team, constraints, current progress, anything the AI should know."
            />
          </div>
          <Button
            onClick={submit}
            disabled={loading || !goal.trim()}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Planning..." : "Generate Plan"}
          </Button>
        </div>
        <AiOutput value={output} loading={loading} emptyHint="Your task plan will appear here." />
      </div>
    </div>
  );
}
