import * as dotenv from "dotenv";
dotenv.config();

import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";

import fs from "node:fs/promises";
import { parse } from "csv-parse/sync";

const data = await fs.readFile(
  "tmp/twitter/yuiseki_/twilog/yuiseki_-230611.csv",
  "utf-8"
);
const records = parse(data);
const docs = [];
for (const record of records) {
  const tweetId = record[0];
  // date
  const tweetedAtDate = "20" + record[1].split(" ")[0];
  const tweetedAtYear = tweetedAtDate.slice(0, 4);
  const tweetedAtMonth = tweetedAtDate.slice(4, 6);
  const tweetedAtDay = tweetedAtDate.slice(6, 8);
  // time
  const tweetedAtTime = record[1].split(" ")[1];
  const tweetedAtHour = tweetedAtTime.slice(0, 2);
  const tweetedAtMinutes = tweetedAtTime.slice(2, 4);
  const tweetedAtSeconds = tweetedAtTime.slice(4, 6);
  const dateTimeStr = `${tweetedAtYear}-${tweetedAtMonth}-${tweetedAtDay}T${tweetedAtHour}:${tweetedAtMinutes}:${tweetedAtSeconds}.000Z`;
  const tweetedAt = new Date(dateTimeStr);
  console.log(tweetedAt.toString());
  const tweetText = record[2];
  console.log(tweetText);
  const doc = new Document({
    pageContent: tweetText,
    metadata: {
      id: tweetId,
      screenName: "yuiseki_",
      tweetedAt: tweetedAt.getTime(),
    },
  });
  docs.push(doc);
}

console.log(docs.length);

const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

const directory = "tmp/twitter/yuiseki_/vectorstores";
await vectorStore.save(directory);
