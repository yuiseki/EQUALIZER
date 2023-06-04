/* eslint-disable @next/next/no-img-element */
import React, { RefObject, useCallback, useRef } from "react";
import styles from "./styles.module.css";

export const TextInput = ({
  disabled = false,
  placeholder = "...",
  inputText,
  setInputText,
  onSubmit,
  textareaRef,
}: {
  disabled?: boolean;
  placeholder?: string;
  inputText: string;
  setInputText: (inputText: string) => void;
  onSubmit: () => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}) => {
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> =
    useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          console.log(
            "onKeyDown ctrl + Enter",
            event.currentTarget.value,
            event.currentTarget.value.length
          );
          if (0 < event.currentTarget.value.length) {
            onSubmit();
          }
        }
      },
      [onSubmit]
    );

  return (
    <div className={styles.textInput}>
      <textarea
        className={styles.textInputTextarea}
        ref={textareaRef}
        value={inputText}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.style.height = "0px";
              textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
            }
          }, 100);
          setInputText(e.currentTarget.value);
        }}
        rows={inputText ? inputText.split("\n").length : 1}
        maxLength={400}
      />
      <button
        className={styles.textInputButton}
        onClick={onSubmit}
        disabled={disabled || inputText.length === 0}
        style={{
          display: "block",
          padding: "4px",
          height: "34px",
          width: "34px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="none"
          strokeWidth="2"
        >
          <path
            d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
    </div>
  );
};
