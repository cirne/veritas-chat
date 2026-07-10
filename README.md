# Veritas

**An open-source example app** built on the [Gamaliel API](https://developer.gamaliel.ai) — a chat interface for people with hard questions about Jesus, Christianity, and the Bible.

Veritas is for skeptics: atheists, agnostics, and honest doubters who won't take "because the Bible says so" as an answer. It leads with reason — history, philosophy, logic, and lived experience — and treats scripture as the source of an idea you can evaluate on its merits, not as proof by assertion.

Bring your toughest objection. You'll get a reasoned reply, not a sermon.

## Why this exists

Gamaliel is an OpenAI-compatible biblical chat API. This repo shows one way to shape it for a skeptical audience: a custom system prompt, a low Bible-literacy profile, and a UI that invites pressure-testing rather than devotion.

Fork it. Change the prompt. Point it at a different audience. Use it as a starting point for your own Gamaliel-powered app.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Vercel AI SDK](https://ai-sdk.dev) for streaming chat
- [Gamaliel Public API](https://developer.gamaliel.ai) — OpenAI-compatible, bring-your-own-key

## Setup

```bash
npm install
cp .env.example .env.local   # add your OpenAI API key
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | OpenAI API key, passed through to Gamaliel (BYOK — used per request, not stored) |
| `GAMALIEL_MODEL` | no | Model id (defaults to `gpt-4.1-mini`) |

## How it works

`src/app/api/chat/route.ts` proxies chat to `https://api.gamaliel.ai/v1` via the AI SDK's OpenAI-compatible provider. It adds:

- A system prompt tuned for skeptics — reason first, scripture as footnote, steelman objections, no preaching
- Gamaliel-specific options (`theology`, `profile: curious_explorer`, `bible_id`, `max_words`) via provider options

The UI (`src/components/Chat.tsx`) is a streaming chat with starter questions and markdown rendering. History lives client-side only — no auth, no persistence.

> Gamaliel caps conversations at 20 user messages. Start a new chat to keep going.

## Deploy

Deploys to [Vercel](https://vercel.com) out of the box. Set `OPENAI_API_KEY` in the project environment variables.
