import { BaseLanguageModel } from "langchain/dist/base_language";
import { EQUALIZER_SURFACE_PROMPT } from "./prompt";
import { ConversationChain, LLMChain } from "langchain/chains";
import { BaseMemory, BufferMemory } from "langchain/memory";

export const loadTridentSurfaceChain = ({
  llm,
  memory,
}: {
  llm: BaseLanguageModel;
  memory?: BaseMemory;
}): LLMChain => {
  if (memory === undefined) {
    memory = new BufferMemory();
  }
  const chain = new ConversationChain({
    llm: llm,
    prompt: EQUALIZER_SURFACE_PROMPT,
    memory: memory,
  });
  return chain;
};
