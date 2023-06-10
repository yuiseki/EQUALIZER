import Link from "next/link";
import styles from "./styles.module.css";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { jsonFetcher } from "@/utils/jsonFetcher";
export const ConversationView: React.FC<{ conversationId: string }> = ({
  conversationId,
}) => {
  const { data: conversationData } = useSWR(
    `/api/public/conversations/${conversationId}`,
    jsonFetcher
  );
  const [conversation, setConversation] = useState<
    { id: string; topic: string; description: string } | undefined
  >();
  useEffect(() => {
    if (conversationData && conversationData.results.length > 0) {
      setConversation(conversationData.results[0]);
    }
  }, [conversationData]);

  if (!conversationData || !conversation) {
    return;
  }
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
        <p>{conversation.description}</p>
      </Link>
    </div>
  );
};
