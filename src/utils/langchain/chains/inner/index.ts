import { LLMChain } from "langchain/chains";
import { BaseLanguageModel } from "langchain/dist/base_language";
import { EQUALIZER_INNER_PROMPT } from "./prompt";

export const loadEqualizerInnerChain = ({
  llm,
}: {
  llm: BaseLanguageModel;
}): LLMChain => {
  const chain = new LLMChain({
    llm: llm,
    prompt: EQUALIZER_INNER_PROMPT,
  });
  return chain;
};
