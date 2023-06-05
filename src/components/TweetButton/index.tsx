/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

export const TweetButton: React.FC<{ text: string }> = ({ text }) => {
  const [url, setUrl] = useState(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}&text=${text}`
  );

  return (
    <>
      {url && (
        <a
          href={url}
          target="_blank"
          className="twitter-share-button"
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "white",
            color: "black",
            padding: "8px",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <img
            loading="lazy"
            height="24"
            width="24"
            id="provider-logo"
            src="https://authjs.dev/img/providers/twitter.svg"
            alt="Twitter logo"
          />
          <span
            style={{
              padding: "0px 3px",
            }}
          >
            Tweet
          </span>
        </a>
      )}
    </>
  );
};
