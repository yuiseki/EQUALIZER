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

  const [numberOfClusters, setNumberOfClusters] = useState(3);
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
    const votedValues = publicComments.users.map((u) =>
      u.votes.map((v) => v.value)
    );
    if (!votedValues || votedValues.length === 0) {
      return;
    }
    if (publicComments.users.length < numberOfClusters) {
      return;
    }
    // initializationを固定値にしないとデタラメになる
    const kms = kmeans(votedValues, numberOfClusters, {
      initialization: Array.from({ length: numberOfClusters }).map((u) =>
        publicComments.results.map(() => 0)
      ),
      maxIterations: 10,
    });
    const newClusters: Array<
      Array<{
        userId: string;
      }>
    > = Array.from({ length: numberOfClusters }, () => []);
    publicComments.users.map((user) => {
      const votes = user.votes.map((v) => v.value);
      const distances = kms.centroids.map((centroid) => {
        const distance = kms.distance(centroid, votes);
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
