export const jsonFetcher = async (url: string) => {
  try {
    const res = await fetch(url);

    return res.headers.get("content-type")?.includes("json")
      ? res.json()
      : async () => {
          const text = await res.text();
          return JSON.parse(text);
        };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
