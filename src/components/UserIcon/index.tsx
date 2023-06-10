/* eslint-disable @next/next/no-img-element */
import { jsonFetcher } from "@/utils/jsonFetcher";
import useSWR from "swr";

export const UserIcon: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    data: publicUser,
    error: publicUserError,
    mutate: mutatePublicUser,
  } = useSWR<{
    results: Array<{
      id: string;
      image: string;
      name: string;
    }>;
  }>(`/api/public/users/${userId}`, jsonFetcher);
  return (
    <div
      style={{
        width: "30px",
        height: "30px",
      }}
    >
      {publicUser && (
        <img
          width={30}
          height={30}
          src={publicUser.results[0].image}
          alt={publicUser.results[0].name}
        />
      )}
    </div>
  );
};
