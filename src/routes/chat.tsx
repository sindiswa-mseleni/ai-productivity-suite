import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — Workmate AI" }] }),
  component: ChatPage,
});

function ChatPage() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status } = useChat({
    transport: transport.current,
    onError: (e) => toast.error(e.message || "Chat failed"),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <PageHeader
        icon={MessageSquare}
        title="AI Chatbot"
        description="Conversational AI assistant for any workplace question."
      />
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm">
                Ask anything — drafting, planning, brainstorming, troubleshooting.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    {isUser ? (
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                        {text}
                      </div>
                    ) : (
                      <div className="max-w-[85%]">
                        <div className="prose-output text-sm text-foreground">
                          <ReactMarkdown>{text || "…"}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border-t bg-background/50 p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Message Workmate AI..."
              className="min-h-[52px] max-h-40 resize-none"
              autoFocus
            />
            <Button
              onClick={submit}
              disabled={isLoading || !input.trim()}
              className="h-[52px] bg-gradient-primary text-primary-foreground hover:opacity-95"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            AI may produce inaccurate information. Verify important details.
          </p>
        </div>
      </div>
    </div>
  );
}
