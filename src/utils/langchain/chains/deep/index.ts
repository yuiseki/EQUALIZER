import { EQUALIZER_DEEP_PROMPT } from "./prompt";

interface InvokableChatModel {
  invoke(input: string): Promise<{ content: unknown }>;
}

export const runEqualizerDeepChain = async ({
  llm,
  text,
}: {
  llm: InvokableChatModel;
  text: string;
}): Promise<{ text: string }> => {
  const prompt = await EQUALIZER_DEEP_PROMPT.format({ text });
  const result = await llm.invoke(prompt);
  return { text: String(result.content) };
};
