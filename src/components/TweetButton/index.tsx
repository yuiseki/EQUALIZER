/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

export const TweetButton: React.FC<{ text: string; url?: string }> = ({
  text,
  url,
}) => {
  const [tweetUrl, setTweetUrl] = useState(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url ? url : window.location.href
    )}&text=${text}`
  );

  return (
    <>
      {url && (
        <a
          href={tweetUrl}
          target="_blank"
          className="twitter-share-button"
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "white",
            color: "black",
            padding: "4px 8px",
            borderRadius: "15px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <img
            loading="lazy"
            height="20"
            width="20"
            id="provider-logo"
            src="https://authjs.dev/img/providers/twitter.svg"
            alt="Twitter logo"
          />
          <span
            style={{
              padding: "0px 3px",
              lineHeight: "1rem",
              textAlign: "center",
            }}
          >
            Tweet
          </span>
        </a>
      )}
    </>
  );
};
