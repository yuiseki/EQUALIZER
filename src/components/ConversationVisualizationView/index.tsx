import { jsonFetcher } from "@/utils/jsonFetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { PCA } from "ml-pca";
import { kmeans } from "ml-kmeans";
import { UserIcon } from "../UserIcon";

export const ConversationVisualizationView: React.FC<{
  conversationId: string;
}> = ({ conversationId }) => {
  const {
    data: publicComments,
    error: publicCommentsError,
    mutate: mutatePublicComments,
  } = useSWR<{
    results: Array<{
      id: string;
      conversationId: string;
      text: string;
      votes: Array<{
        id: string;
        userId: string;
        commentId: string;
        value: number;
      }>;
    }>;
    users: Array<{
      userId: string;
      votes: Array<{
        commentId: string;
        value: number;
      }>;
    }>;
    votes: Array<Array<number>>;
  }>(`/api/public/conversations/${conversationId}/comments`, jsonFetcher);

  const [numberOfClusters, setNumberOfClusters] = useState(4);
  const [clusters, setClusters] = useState<
    Array<
      Array<{
        userId: string;
      }>
    >
  >();

  useEffect(() => {
    if (!publicComments) {
      return;
    }
    const kms = kmeans(
      publicComments.users.map((u) => u.votes.map((v) => v.value)),
      numberOfClusters,
      {}
    );
    const newClusters: Array<
      Array<{
        userId: string;
      }>
    > = Array.from({ length: numberOfClusters }, () => []);
    publicComments.users.map((user) => {
      const distances = kms.centroids.map((centroid, centroidIdx) => {
        const distance = kms.distance(
          centroid,
          user.votes.map((v) => v.value)
        );
        return distance;
      });
      const cluster = distances.indexOf(Math.min(...distances));
      newClusters[cluster].push({ userId: user.userId });
    });
    setClusters(newClusters);
  }, [numberOfClusters, publicComments]);

  return (
    <div>
      <h3
        style={{
          width: "100%",
          textAlign: "center",
        }}
      >
        考えのグループ
      </h3>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {clusters &&
          clusters.map((cluster, clusterIdx) => {
            return (
              <div
                key={`cluster-${clusterIdx}`}
                style={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid gray",
                }}
              >
                {cluster.map((user) => {
                  return (
                    <div key={`cluster-${clusterIdx}-${user.userId}`}>
                      <UserIcon userId={user.userId} />
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};
