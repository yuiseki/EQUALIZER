import * as dotenv from "dotenv";
dotenv.config();

import fs from "node:fs/promises";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { Document } from "langchain/document";

import { LLMChain } from "langchain/chains";
import { BaseLanguageModel } from "langchain/dist/base_language";
import { PromptTemplate } from "langchain/prompts";

export const loadCustomSummarizationChain = ({
  llm,
}: {
  llm: BaseLanguageModel;
}): LLMChain => {
  const promptTemplateString = `以下のInput textの内容を、日本語で簡潔に要約しなさい。意見が賛成なのか反対なのかという側面に慎重に注意して要約しなさい。

Input text:
{input_text}

Output:`;

  const promptTemplate = PromptTemplate.fromTemplate(promptTemplateString);
  const chain = new LLMChain({
    llm: llm,
    prompt: promptTemplate,
  });
  return chain;
};

const commentsJsonFile = await fs.readFile(
  "./tests/polis/comments.json",
  "utf-8"
);
const comments = JSON.parse(commentsJsonFile);
const votesJsonFile = await fs.readFile("./tests/polis/votes.json", "utf-8");
const votes = JSON.parse(votesJsonFile);

const commentsWithVotes = [];
for await (const comment of comments) {
  const vote = votes.filter((vote: any) => vote.tid === comment.tid);
  if (!vote || vote.length === 0) {
    continue;
  }
  commentsWithVotes.push({
    txt: comment.txt,
    tid: comment.tid,
    created: comment.created,
    tweet_id: comment.tweet_id,
    quote_src_url: comment.quote_src_url,
    is_seed: comment.is_seed,
    is_meta: comment.is_meta,
    lang: comment.lang,
    vote: vote[0].vote,
    weight_x_32767: vote[0].weight_x_32767,
    modified: vote[0].modified,
  });
}

const opinionSeedLines = [];
for await (const commentWithVote of commentsWithVotes) {
  let opinionSeed;
  if (commentWithVote.vote === 0) {
    opinionSeed = `私は、「${commentWithVote.txt}」という考えには特に意見はありません。`;
  }
  if (commentWithVote.vote === -1) {
    opinionSeed = `私は、「${commentWithVote.txt}」という考えには賛成です。`;
  }
  if (commentWithVote.vote === 1) {
    opinionSeed = `私は、「${commentWithVote.txt}」という考えには反対です。`;
  }
  if (opinionSeed) {
    opinionSeedLines.push(opinionSeed);
  }
}

console.log(opinionSeedLines.join("\n"));

//const doc = new Document({ pageContent: opinionSeedLines.join("\n") });

const model = new OpenAI({ temperature: 0, maxTokens: 1000 });
const chain = loadCustomSummarizationChain({ llm: model });

const agreeRes = await chain.call({
  input_text: opinionSeedLines
    .filter((line) => line.includes("賛成"))
    .join("\n"),
});
console.log("");
console.log("Summarization of agree:", agreeRes.text);

const opposeRes = await chain.call({
  input_text: opinionSeedLines
    .filter((line) => line.includes("反対"))
    .join("\n"),
});
console.log("");
console.log("Summarization of oppose:", opposeRes.text);
