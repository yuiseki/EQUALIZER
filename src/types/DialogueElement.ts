export type DialogueElement = {
  who: string;
  text: string;
  textEnd?: string;
  emojiList: Array<{ name: string; count: number }>;
};
