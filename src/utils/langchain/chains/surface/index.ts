import { EQUALIZER_SURFACE_PROMPT } from "./prompt";

// A minimal structural type for the one method we use. Typing this against
// @langchain/core's full `BaseChatModel<CallOptions>` generic class makes
// TypeScript try to check ChatOpenAI's large call-options type against it and
// blow the type-instantiation depth limit.
interface InvokableChatModel {
  invoke(input: string): Promise<{ content: unknown }>;
}

export const runEqualizerSurfaceChain = async ({
  llm,
  input,
  history,
}: {
  llm: InvokableChatModel;
  input: string;
  history: string;
}): Promise<{ response: string }> => {
  const prompt = await EQUALIZER_SURFACE_PROMPT.format({ history, input });
  const result = await llm.invoke(prompt);
  return { response: String(result.content) };
};
