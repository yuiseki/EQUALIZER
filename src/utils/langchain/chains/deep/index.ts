import { LLMChain } from "langchain/chains";
import { EQUALIZER_DEEP_PROMPT } from "./prompt";
import { BaseLanguageModel } from "langchain/dist/base_language";

export const loadTridentDeepChain = ({
  llm,
}: {
  llm: BaseLanguageModel;
}): LLMChain => {
  const chain = new LLMChain({
    llm: llm,
    prompt: EQUALIZER_DEEP_PROMPT,
  });
  return chain;
};
