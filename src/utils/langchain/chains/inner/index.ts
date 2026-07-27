import { EQUALIZER_INNER_PROMPT } from "./prompt";

interface InvokableChatModel {
  invoke(input: string): Promise<{ content: unknown }>;
}

export const runEqualizerInnerChain = async ({
  llm,
  chat_history,
}: {
  llm: InvokableChatModel;
  chat_history: string;
}): Promise<{ text: string }> => {
  const prompt = await EQUALIZER_INNER_PROMPT.format({ chat_history });
  const result = await llm.invoke(prompt);
  return { text: String(result.content) };
};
