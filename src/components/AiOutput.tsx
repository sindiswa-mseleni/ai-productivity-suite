import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Pencil, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string;
  loading?: boolean;
  emptyHint?: string;
};

export function AiOutput({ value, loading, emptyHint }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const copy = async () => {
    await navigator.clipboard.writeText(editing ? draft : value);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-3 w-3/4 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Generating with AI…</p>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 p-10 text-center text-sm text-muted-foreground">
        {emptyHint ?? "AI output will appear here."}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">AI Output</span>
        <div className="flex items-center gap-1">
          {editing ? (
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              <Check className="mr-1 h-3.5 w-3.5" /> Done
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setDraft(value)} disabled={!editing}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
          </Button>
          <Button size="sm" variant="ghost" onClick={copy}>
            <Copy className="mr-1 h-3.5 w-3.5" /> Copy
          </Button>
        </div>
      </div>
      <div className="p-5">
        {editing ? (
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[280px] font-mono text-sm"
          />
        ) : (
          <div className="prose-output text-sm text-foreground">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
