"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "./Markdown";

const STARTERS = [
  "If God is good, why is there so much suffering?",
  "Weren't the Gospels written decades after Jesus died?",
  "How is Christianity different from any other myth?",
  "Can a rational person believe in miracles?",
  "Doesn't science make God unnecessary?",
  "Why would a loving God send people to hell?",
];

export default function Chat() {
  const { messages, sendMessage, status, error, clearError, setMessages, stop } =
    useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    clearError();
    sendMessage({ text: trimmed });
    setInput("");
    inputRef.current?.focus();
  }

  function newConversation() {
    stop();
    clearError();
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto px-4">
      <header className="py-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Veritas</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Honest answers to hard questions about Jesus, Christianity, and the
          Bible
        </p>
      </header>

      <main className="flex-1 flex flex-col gap-6 pb-40">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-6 mt-10">
            <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md">
              Bring your hardest question. You&apos;ll get a reasoned answer,
              not a sermon.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 w-full">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  onClick={() => submit(q)}
                  className="text-left text-sm px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "self-end max-w-[85%] rounded-2xl rounded-br-sm bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 px-4 py-2.5"
                : "self-start w-full"
            }
          >
            {message.parts.map((part, i) =>
              part.type === "text" ? (
                message.role === "user" ? (
                  <p key={i} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                ) : (
                  <Markdown key={i}>{part.text}</Markdown>
                )
              ) : null,
            )}
          </div>
        ))}

        {status === "submitted" && (
          <div className="self-start flex gap-1.5 px-1 py-2">
            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
          </div>
        )}

        {error && (
          <div className="self-start text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
            {error.message ||
              "Something went wrong. Please try again."}
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-10 pb-6">
        <form
          className="max-w-3xl mx-auto px-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <div className="flex items-end gap-2 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-[var(--background)] shadow-lg px-3 py-3 focus-within:border-neutral-500 transition-colors">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={newConversation}
                title="Start a new conversation"
                className="shrink-0 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 rounded-full px-3 h-9 transition-colors cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                >
                  <path d="M8 3.5v9M3.5 8h9" />
                </svg>
                <span className="hidden sm:inline">New chat</span>
              </button>
            )}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder={
                messages.length > 0
                  ? "Ask a follow-up, or start a new chat…"
                  : "Ask a hard question…"
              }
              className="flex-1 resize-none bg-transparent outline-none placeholder:text-neutral-400 max-h-40 py-1.5"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="shrink-0 rounded-full w-9 h-9 flex items-center justify-center bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 disabled:opacity-30 transition-opacity cursor-pointer disabled:cursor-default"
              aria-label="Send"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-2">
            Answers draw on scripture, history, and reason. Think critically.
          </p>
        </form>
      </div>
    </div>
  );
}
