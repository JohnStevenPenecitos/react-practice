import { useParams } from "react-router-dom";
import { CommentItem, useCommentDetails } from "../hooks/usePostDetails";
import { formatDistanceToNow } from "date-fns";
import Image from "./Image";

const Comments = () => {
  const { postId } = useParams<{ postId?: string }>();

  const { data, isError, error, isLoading } = useCommentDetails(postId || "", {
    onSuccess: (fetchedData) => {
      if (fetchedData && fetchedData.commentsData) {
        console.log("Custom Success Comments", fetchedData.commentsData);
      }
    },
    onError: (customError) => {
      console.log("Custom Error", customError.message);
    },
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-300 h-8 mb-2 rounded"></div>;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  return (
    <>
      {/* <div>
        {Array.isArray(data?.commentsData) ? (
          data.commentsData.map((item: CommentItem) => (
            <div key={`comment_${item._id}`}>
              {item.commentBy && typeof item.commentBy === "object" ? (
                <>
                  <div className="flex gap-2 mb-3">
                    {item.commentBy.profilePhoto && (
                      <Image src={item.commentBy.profilePhoto} />
                    )}
                    <div>
                      <div className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg">
                        <div className="flex flex-row gap-2 items-center">
                          {(item.commentBy.firstName ||
                            item.commentBy.lastName) && (
                            <span className="font-bold">
                              {`${item.commentBy.firstName} ${item.commentBy.lastName}`}
                            </span>
                          )}
                        </div>
                        {item.content}
                      </div>
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <span className="text-sm">
                  Invalid commentBy data: {JSON.stringify(item.commentBy)}
                </span>
              )}
            </div>
          ))
        ) : (
          <span className="text-sm">No comments data available.</span>
        )}
      </div> */}
      <div>
        {Array.isArray(data?.commentsData) && data.commentsData.length > 0 ? (
          data.commentsData.map((item: CommentItem) => (
            <div key={`comment_${item._id}`}>
              {item.commentBy && typeof item.commentBy === "object" ? (
                <>
                  <div className="flex gap-2 mb-3">
                    {item.commentBy.profilePhoto && (
                      <Image src={item.commentBy.profilePhoto} />
                    )}
                    <div>
                      <div className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg">
                        <div className="flex flex-row gap-2 items-center">
                          {(item.commentBy.firstName ||
                            item.commentBy.lastName) && (
                            <span className="font-bold">
                              {`${item.commentBy.firstName} ${item.commentBy.lastName}`}
                            </span>
                          )}
                        </div>
                        {item.content}
                      </div>
                      <span className="text-sm">
                        {(() => {
                          const timeDifference = formatDistanceToNow(
                            new Date(item.createdAt),
                            {
                              addSuffix: false,
                              includeSeconds: true,
                            }
                          );

                          let formattedTime = timeDifference;

                          if (timeDifference.includes("about")) {
                            formattedTime = formattedTime.replace(/about/i, "");
                          }

                          if (timeDifference.includes("less than 5 second")) {
                            formattedTime = formattedTime.replace(
                              /less than 5 second/i,
                              "less than 5 seconds"
                            );
                          }

                          if (timeDifference.includes("less than 10 second")) {
                            formattedTime = formattedTime.replace(
                              /less than 10 second/i,
                              "less than 10 seconds"
                            );
                          }

                          if (timeDifference.includes("less than 20 second")) {
                            formattedTime = formattedTime.replace(
                              /less than 20 second/i,
                              "less than 20 seconds"
                            );
                          }

                          if (timeDifference.includes("minute")) {
                            formattedTime = formattedTime.replace(
                              /(\d) minute/,
                              "$1m"
                            );
                          }

                          if (timeDifference.includes("hour")) {
                            formattedTime = formattedTime.replace(
                              /(\d) hour/,
                              "$1h"
                            );
                          }

                          if (timeDifference.includes("day")) {
                            formattedTime = formattedTime.replace(
                              /(\d) day/,
                              "$1d"
                            );
                          }

                          return formattedTime.replace(/s$/, "");
                        })()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <span className="text-sm">
                  Invalid commentBy data: {JSON.stringify(item.commentBy)}
                </span>
              )}
            </div>
          ))
        ) : (
          <span className="text-sm flex justify-center">No comments available.</span>
        )}
      </div>
    </>
  );
};

export default Comments;
