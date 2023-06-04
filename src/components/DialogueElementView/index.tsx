/* eslint-disable @next/next/no-img-element */
import { DialogueElement } from "@/types/DialogueElement";
import { AvatarIcon } from "@/components/AvatarIcon";
import styles from "./styles.module.css";
import Link from "next/link";

export const DialogueElementView: React.FC<{
  dialogueElement: DialogueElement;
  dialogueIndex: number;
  isResponding: boolean;
  needLogin: boolean;
}> = ({ dialogueElement, dialogueIndex, isResponding, needLogin }) => {
  return (
    <div
      className={`${styles.dialogueElementView} ${
        dialogueElement.who === "assistant"
          ? styles.dialogueElementViewAssistant
          : styles.dialogueElementViewHuman
      }`}
      key={dialogueIndex}
    >
      <div className="avatarIconWrap">
        <AvatarIcon who={dialogueElement.who} />
      </div>
      <div className="dialogueElementWrap">
        <div
          className="dialogueTextWrap"
          style={{
            paddingLeft: "5px",
            paddingRight: "5px",
            flexGrow: 1,
            maxWidth: "100%",
          }}
        >
          {dialogueElement.text?.split("\n").map((row, rowIdx) => {
            return (
              <div
                className="dialogueTextRow"
                key={`${dialogueIndex}-${rowIdx}`}
                style={{
                  minHeight: "1em",
                  maxWidth: "100%",
                  wordBreak: "break-all",
                }}
              >
                {row}
                {isResponding &&
                  rowIdx === dialogueElement.text.split("\n").length - 1 && (
                    <span className="blinkingCursor" />
                  )}
              </div>
            );
          })}
          {!isResponding &&
            dialogueElement.textEnd?.split("\n").map((row, rowIdx) => {
              return (
                <div
                  key={`${dialogueIndex}-${rowIdx}-end`}
                  style={{
                    minHeight: "1em",
                    marginLeft: row.startsWith(" ") ? "1em" : "0px",
                  }}
                >
                  {row}
                </div>
              );
            })}
          {needLogin && (
            <div
              style={{
                marginTop: "1em",
                fontSize: "1.4rem",
              }}
            >
              <Link href="/api/auth/signin">
                <span
                  style={{
                    textDecoration: "underline",
                  }}
                >
                  議論に参加するために、まずはTwitterアカウントでのログインをお願いします。
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
