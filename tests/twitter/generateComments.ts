import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import * as dotenv from "dotenv";
import { PromptTemplate } from "langchain/prompts";
import { BaseLanguageModel } from "langchain/dist/base_language";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
dotenv.config();

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

const directory = "tmp/twitter/yuiseki_/vectorstores";
const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings());

const questions = [
  //"通勤時間はサービス残業であると思うか？",
  //"ChatGPTのようなAIアシスタントの、ユーザーの趣味嗜好に合わせたパーソナライゼーションはどこまでやるべきだと思うか？",
  //"AI アシスタントは公人の視点に関する質問にどのように答えるべきでしょうか? たとえば、彼らは中立であるべきですか？彼らは答えることを拒否すべきでしょうか？何らかの情報源を提供すべきでしょうか？",
  //"AI アシスタントが医療/財務/法律に関するアドバイスを提供できる場合、どのような条件下で許可されるべきですか?",
  //"AI アシスタントが個人に精神的あるいは心理的なサポートを提供する必要があるのは、どのような場合ですか?",
  //"画像から人々の性別、人種、感情、アイデンティティ/名前を特定するために、共同視覚言語モデルを許可すべきでしょうか? なぜ、あるいはなぜそうではないのでしょうか？",
  "AI モデルの作成者は、どのカテゴリーのコンテンツを制限または拒否することに重点を置くべきだと思いますか? これらの制限を決定するにはどのような基準を使用する必要がありますか?",
];

for await (const question of questions) {
  console.log("");
  console.log("----- ----- ----- -----");
  console.log("Q:", question);
  console.log("");
  const docs = await vectorStore.similaritySearch(question, 4);
  console.log("Tweets:\n", docs.map((d) => d.pageContent).join("\n"));
  console.log("");
  const llm = new OpenAI({ temperature: 0, maxTokens: 2000 });
  const chain = loadGenerateCommentsChain({ llm });
  const result = await chain.call({
    context: docs.map((d) => d.pageContent).join("\n"),
    question: question,
  });
  console.log("Opinions:", result.text);
  console.log("----- ----- ----- -----");
}
