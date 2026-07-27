import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { runEqualizerDeepChain } from "@/utils/langchain/chains/deep";

export async function POST(request: Request) {
  const body = (await request.json()) as { query?: string };
  const query = body.query ?? "";

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    configuration: { fetch: globalThis.fetch },
  });
  const result = await runEqualizerDeepChain({ llm: model, text: query });

  console.log("----- ----- -----");
  console.log("----- deep -----");
  console.log("----- ----- -----");
  console.log("Human:", query);
  console.log("AI:", result.text);
  console.log("");

  return NextResponse.json({
    query: query,
    deep: result.text,
  });
}
