# Veritas

A chat app for skeptics with hard questions about Jesus, Christianity, and the Bible.

Veritas is not a Bible reader. It's built for people who don't accept scripture as an authority — atheists, agnostics, and doubters — so answers lead with reason, history, and philosophy. Scripture grounds every answer, but it's presented as the source of an idea the reader can evaluate on its merits, not as proof by assertion.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Vercel AI SDK](https://ai-sdk.dev) (`ai` + `@ai-sdk/react`) for streaming chat
- [Gamaliel Public API](https://developer.gamaliel.ai) — an OpenAI-compatible biblical chat API (BYOK), customized via a system prompt for a skeptical audience

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in your key
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | OpenAI API key, passed through to Gamaliel (BYOK — used per request, not stored) |
| `GAMALIEL_MODEL` | no | Model id (defaults to `gpt-4.1-mini`) |

## How it works

`src/app/api/chat/route.ts` proxies chat to `https://api.gamaliel.ai/v1` using the AI SDK's OpenAI-compatible provider. It adds:

- A system prompt tuned for skeptics (reason first, scripture as footnote, steelman objections, no preaching)
- Gamaliel-specific params (`theology`, `profile`, `max_words`) via provider options

The UI (`src/components/Chat.tsx`) is a streaming chat with starter questions and markdown rendering. Conversation history lives client-side only — Gamaliel is stateless and no auth or persistence exists in v0.

Note: Gamaliel limits conversations to 20 user messages; start a new chat to continue past that.

## Deploy

Deploys to [Vercel](https://vercel.com) out of the box. Set `OPENAI_API_KEY` in the Vercel project's environment variables.
