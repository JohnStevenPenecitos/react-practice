import { useParams } from "react-router-dom";
import { CommentItem, useCommentDetails } from "../hooks/usePostDetails";

const Comments = () => {
  const { postId } = useParams<{ postId?: string }>();

  const { data, isError, error, isLoading, isFetching } = useCommentDetails(
    postId || "",
    {
      onSuccess: (fetchedData) => {
        if (fetchedData && fetchedData.commentsData) {
          console.log("Custom Success Comments", fetchedData.commentsData);
        }
      },
      onError: (customError) => {
        console.log("Custom Error", customError.message);
      },
    }
  );

  if (isLoading || isFetching) {
    return <div className="animate-pulse bg-gray-300 h-8 mb-2 rounded"></div>;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  return (
    <>
      <div>
        <div>
          {data?.commentsData?.map((comment: CommentItem) => (
            <div
              key={`comment_${comment.post_id}_${comment._id}`}
              className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg mb-3"
            >
              {comment.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Comments;
