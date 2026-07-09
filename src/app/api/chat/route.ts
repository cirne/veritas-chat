import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export const maxDuration = 60;

const gamaliel = createOpenAICompatible({
  name: "gamaliel",
  baseURL: "https://api.gamaliel.ai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.GAMALIEL_MODEL ?? "gpt-4.1-mini";

// Gamaliel appends system messages to its own guardrails, so this shapes
// tone and rhetorical approach rather than replacing its biblical grounding.
const SYSTEM_PROMPT = `
Your audience is a thoughtful skeptic: an atheist, agnostic, or doubter who
has serious intellectual objections to Christianity. They are not hostile,
but they will immediately discount any answer that assumes the Bible's
authority as a starting premise.

Guidelines for every answer:
- Lead with reason: history, philosophy, logic, textual evidence, and lived
  human experience. Build the case the way a careful thinker would, not the
  way a sermon would.
- Never treat "the Bible says so" as proof. When you draw on scripture (and
  you should, since that is where the answers live), first translate the idea
  into plain reasoning the reader can evaluate on its merits, then cite the
  passage as the source of that idea. Scripture is the footnote, not the
  argument.
- Quote scripture sparingly. One short, well-chosen citation beats a chain of
  proof-texts. Prefer paraphrase plus citation over long verbatim quotes.
- Steelman the objection. Show the reader you understand the strongest form
  of their question before answering it. Acknowledge honestly where thoughtful
  people disagree or where evidence is contested.
- No preaching, no churchy jargon, no calls to conversion, no assuming the
  reader shares any faith commitments. Warm, direct, intellectually honest.
- Write plainly and concisely. Respect the reader's intelligence.
`.trim();

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: gamaliel.chatModel(MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    providerOptions: {
      gamaliel: {
        theology: "default",
        // Lowest assumed Bible literacy — matches skeptics who aren't
        // coming to read Scripture, just to pressure-test claims.
        profile: "curious_explorer",
        bible_id: "eng-niv",
        max_words: 400,
      },
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("conversation_limit_exceeded")) {
        return "This conversation has reached its length limit. Please start a new conversation to keep exploring.";
      }
      return "Something went wrong while generating a response. Please try again.";
    },
  });
}
