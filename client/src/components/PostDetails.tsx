import { useParams } from "react-router-dom";
import usePostDetails from "../hooks/usePostDetails";

const PostDetails = () => {
  const { postId } = useParams<{ postId?: string }>();

  const { isLoading, data, isError, error, isFetching, refetch } =
    usePostDetails(postId || "", {
      onSuccess: () => {
        console.log("Custom Success", data);
      },
      onError: () => {
        console.log("Custom Error", error);
      },
    });

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  return (
    <>
      <div>
        {Array.isArray(data) ? (
          data.map((item) => (
            <div
              key={item?.post_id}
              className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg mb-3"
            >
              {item?.name}
            </div>
          ))
        ) : (
          <div>
            <div
              key={data?.post_id}
              className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg mb-3"
            >
              {data?.name}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostDetails;
