import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { loadEqualizerSurfaceChain } from "@/utils/langchain/chains/surface";

export async function POST(request: Request) {
  const res = await request.json();
  const query = res.query;
  const pastMessagesJsonString = res.pastMessages;

  let chatHistory = undefined;
  if (pastMessagesJsonString && pastMessagesJsonString !== "undefined") {
    const pastMessages: {
      messages: Array<{ type: string; data: { content: string } }>;
    } = JSON.parse(pastMessagesJsonString);

    const chatHistoryMessages = pastMessages.messages.map((message) => {
      if (message.data.content) {
        if (message.type === "human") {
          return new HumanChatMessage(message.data.content);
        } else {
          return new AIChatMessage(message.data.content);
        }
      } else {
        return new HumanChatMessage("");
      }
    });
    chatHistory = new ChatMessageHistory(chatHistoryMessages);
  }
  const memory = new BufferMemory({
    chatHistory,
  });

  const model = new OpenAI({ temperature: 0, maxTokens: 2000 });
  const surfaceChain = loadEqualizerSurfaceChain({ llm: model, memory });
  const surfaceResult = await surfaceChain.call({ input: query });

  console.log("----- ----- -----");
  console.log("----- surface -----");
  console.log("----- ----- -----");
  console.log("Human:", query);
  console.log("AI:", surfaceResult.response);
  console.log("");

  return NextResponse.json({
    query: query,
    surface: surfaceResult.response,
    history: memory.chatHistory,
  });
}
