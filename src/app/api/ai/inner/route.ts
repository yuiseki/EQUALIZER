import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { runEqualizerInnerChain } from "@/utils/langchain/chains/inner";

type StoredMessage = { type: string; data: { content: string } };

export async function POST(request: Request) {
  const body = (await request.json()) as { pastMessages?: string };
  const pastMessagesJsonString = body.pastMessages;

  let chatHistory: Array<string | null> = [];
  let chatHistoryLines = "";
  if (pastMessagesJsonString && pastMessagesJsonString !== "undefined") {
    const pastMessages: { messages: StoredMessage[] } = JSON.parse(
      pastMessagesJsonString
    );
    chatHistory = pastMessages.messages
      .map((message) => {
        if (message.data.content) {
          if (message.type === "human") {
            return `Human: ${message.data.content}`;
          } else {
            return null;
          }
        } else {
          return null;
        }
      })
      .filter((v) => v);
    chatHistoryLines = chatHistory.join("\n").replace("\n\n", "\n");
  }

  console.log("----- ----- -----");
  console.log("----- inner -----");
  console.log("----- ----- -----");
  console.log(chatHistoryLines);

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    configuration: { fetch: globalThis.fetch },
  });
  const result = await runEqualizerInnerChain({
    llm: model,
    chat_history: chatHistoryLines,
  });
  console.log(result.text);
  console.log("");

  return NextResponse.json({
    inner: result.text,
  });
}
