import Link from "next/link";
import styles from "./styles.module.css";
export const ConversationView: React.FC<{ conversation: any }> = ({
  conversation,
}) => {
  return (
    <div className={styles.conversationView}>
      <Link href={`/conversations/${conversation.id}`}>
        <h2
          style={{
            textDecoration: "underline",
          }}
        >
          {conversation.topic}
        </h2>
      </Link>
    </div>
  );
};
