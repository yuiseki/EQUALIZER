import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import * as dotenv from "dotenv";
import { PromptTemplate } from "langchain/prompts";
import { BaseLanguageModel } from "langchain/dist/base_language";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
dotenv.config();

const directory = "tmp/twitter/yuiseki_/vectorstores";
const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings());

const questions = [
  "ChatGPTのようなAIアシスタントの、ユーザーの趣味嗜好に合わせたパーソナライゼーションはどこまでやるべきだと思うか？",
  "通勤時間はサービス残業であると思うか？",
];

for await (const question of questions) {
  console.log("");
  console.log("----- ----- ----- -----");
  console.log("Q:", question);
  console.log("");
  const docs = await vectorStore.similaritySearch(question, 4);
  console.log("Tweets:\n", docs.map((d) => d.pageContent).join("\n"));
  console.log("");
  const GENERATE_COMMENTS_PROMPT = /*#__PURE__*/ new PromptTemplate({
    template:
      "Use the following pieces of context to generate list of opinions for the question at the end.\n\n{context}\n\nQuestion: {question}\nOpinions:",
    inputVariables: ["context", "question"],
  });
  const loadGenerateCommentsChain = ({
    llm,
  }: {
    llm: BaseLanguageModel;
  }): LLMChain => {
    const chain = new LLMChain({
      llm: llm,
      prompt: GENERATE_COMMENTS_PROMPT,
    });
    return chain;
  };
  const llm = new OpenAI({ temperature: 0, maxTokens: 2000 });
  const chain = loadGenerateCommentsChain({ llm });
  const result = await chain.call({
    context: docs.map((d) => d.pageContent).join("\n"),
    question: question,
  });
  console.log("Opinions:", result.text);
  console.log("----- ----- ----- -----");
}
