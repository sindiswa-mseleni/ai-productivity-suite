import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiOutput } from "@/components/AiOutput";
import { useGenerate } from "@/lib/use-generate";
import { Mail, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [{ title: "Smart Email Generator — Workmate AI" }],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [context, setContext] = useState("");
  const { output, loading, generate } = useGenerate();

  const submit = () => {
    if (!context.trim()) return;
    const prompt = `Draft an email with the following parameters.

Recipient: ${recipient || "(unspecified)"}
Subject: ${subject || "(suggest one)"}
Tone: ${tone}
Length: ${length}

Context / key points:
${context}

Return the email in markdown with:
- A suggested **Subject:** line at the top
- The full email body
- A polite closing

Keep it crisp and ready to send.`;
    generate(
      "You are an expert business writer. Produce clear, well-structured professional emails.",
      prompt,
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Generate polished, professional emails tailored to your tone and audience."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Recipient</Label>
                <Input
                  placeholder="e.g. Hiring manager"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div>
                <Label>Subject (optional)</Label>
                <Input
                  placeholder="Leave blank to let AI suggest"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Professional", "Friendly", "Formal", "Persuasive", "Apologetic", "Direct"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Short", "Medium", "Long"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Context / key points</Label>
              <Textarea
                placeholder="What is the email about? Include any key points, deadlines, or details."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[180px]"
              />
            </div>
            <Button
              onClick={submit}
              disabled={loading || !context.trim()}
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </div>
        </div>
        <AiOutput value={output} loading={loading} emptyHint="Your draft email will appear here." />
      </div>
    </div>
  );
}
