import { jsonFetcher } from "@/utils/jsonFetcher";
import useSWR from "swr";

export const ConversationVisualizationView: React.FC<{
  conversationId: string;
}> = ({ conversationId }) => {
  const { data: users, error: userError } = useSWR(
    "/api/public/users",
    jsonFetcher
  );
  const {
    data: publicComments,
    error: publicCommentError,
    mutate: mutatePublicComments,
  } = useSWR(
    `/api/public/conversations/${conversationId}/comments`,
    jsonFetcher
  );

  return (
    <div>
      {publicComments &&
        publicComments.results.map((comment: any, commentIdx: number) => {
          return (
            <div key={`visualization-${commentIdx}`}>
              [
              {comment.votes
                .map((vote: any, voteIdx: number) => {
                  return vote.value;
                })
                .join(",")}
              ]
            </div>
          );
        })}
    </div>
  );
};
