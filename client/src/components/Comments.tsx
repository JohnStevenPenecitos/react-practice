import { useParams } from "react-router-dom";
import { Comment, useCommentDetails } from "../hooks/usePostDetails";
import { formatDistanceToNow } from "date-fns";
import Image from "./Image";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useAuthContext } from "./Auth";
import axios from "axios";
import { useState } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "react-query";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

const Comments = () => {
  const { postId } = useParams<{ postId?: string }>();

  const { authUser } = useAuthContext();

  const userAuthId = authUser?._id;

  const userAuthIdPost = authUser?._id?.toString();

  const socket = io("http://localhost:3000");

  const queryClient = useQueryClient();

  const [isReplying, setIsReplying] = useState<{ [key: string]: boolean }>({});

  const handleReplyClick = (commentId: string) => {
    setIsReplying({ [commentId]: true });
    console.log(commentId);
  };

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

  const handleSubmitReplyComment = async (
    values: { text: string; userId: number | undefined; comment_id: string },
    {
      resetForm,
    }: FormikHelpers<{
      text: string;
      userId: number | undefined;
      comment_id: string;
    }>
  ) => {
    try {
      // Send a PUT request to your backend endpoint
      const response = await axios.put(
        `/api/user/reply-comment/${values.comment_id}`,
        {
          text: values.text,
          userId: values.userId,
        }
      );

      // Handle success
      console.log("Comment reply submitted:", response.data);

      // Reset the form
      resetForm();

      socket.emit("commentReply", response.data);

      socket.on("broadcastReply", () => {
        queryClient.invalidateQueries("comments");
        queryClient.invalidateQueries("posts");
      });

      // You can perform any additional actions after successful submission if needed
    } catch (error) {
      // Handle error
      // console.error("Error submitting comment reply:", error.response.data);
    }
  };

  // const handleRepliesUser = async (commentId: string) => {
  //   try {
  //     const response = await axios.get(
  //       `/api/user/comment-replies/${commentId}`
  //     );
  //     const data = response.data;

  //     console.log(postId);
  //     console.log("fasfdsa", data);
  //   } catch (error) {
  //     console.error("Error fetching liked users:", error);
  //   }
  // };

  const handleLikeClickComment = async (commentId: string) => {
    try {
      if (authUser?._id !== undefined) {
        const response = await axios.put(
          `/api/user/addlike-comment/${commentId}`,
          {
            userId: userAuthId,
          }
        );
        console.log(response.data);

        // queryClient.invalidateQueries("posts");

        console.log(commentId);

        socket.emit("newLikeComment", response.data);

        socket.on("broadcastLikeComment", () => {
          queryClient.invalidateQueries("comments");
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding like:", error);
    }
  };

  const handleRemoveLikeClickComment = async (commentId: string) => {
    try {
      if (authUser?._id !== undefined) {
        const response = await axios.put(
          `/api/user/removelike-comment/${commentId}`,
          {
            userId: userAuthId,
          }
        );
        console.log(response.data);
        // queryClient.invalidateQueries("posts");

        socket.emit("removeLikeComment", response.data);

        socket.on("broadcastRemoveLikeComment", () => {
          queryClient.invalidateQueries("comments");
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding like:", error);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-300 h-8 mb-2 rounded"></div>;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  return (
    <>
      <div className="relative">
        {Array.isArray(data?.commentsData) && data.commentsData.length > 0 ? (
          data.commentsData.map((comment) => (
            <div key={`comment_${comment._id}`} className="relative mb-5 ">
              {isReplying[comment._id] && (
                <div className="absolute bg-gray-400 w-1 left-5 h-full"></div>
              )}
              {comment.commentBy && typeof comment.commentBy === "object" ? (
                <>
                  <div className="flex gap-2 mb-3 relative">
                    {comment.commentBy.profilePhoto && (
                      <Image src={comment.commentBy.profilePhoto} />
                    )}
                    <div>
                      <div className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg">
                        <div className="flex flex-row gap-2 items-center">
                          {(comment.commentBy.firstName ||
                            comment.commentBy.lastName) && (
                            <span className="font-bold">{`${comment.commentBy.firstName} ${comment.commentBy.lastName}`}</span>
                          )}
                        </div>
                        {comment.content}
                      </div>

                      <div className="flex justify-between">
                        <div className="flex gap-2 text-xs ">
                          <span className="flex justify-center items-center">
                            {(() => {
                              const timeDifference = formatDistanceToNow(
                                new Date(comment.createdAt),
                                {
                                  addSuffix: false,
                                  includeSeconds: true,
                                }
                              );
                              let formattedTime = timeDifference;
                              if (timeDifference.includes("about")) {
                                formattedTime = formattedTime.replace(
                                  /about/i,
                                  ""
                                );
                              }
                              if (
                                timeDifference.includes("less than 5 second")
                              ) {
                                formattedTime = formattedTime.replace(
                                  /less than 5 second/i,
                                  "less than 5 seconds"
                                );
                              }
                              if (
                                timeDifference.includes("less than 10 second")
                              ) {
                                formattedTime = formattedTime.replace(
                                  /less than 10 second/i,
                                  "less than 10 seconds"
                                );
                              }
                              if (
                                timeDifference.includes("less than 20 second")
                              ) {
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

                          {comment.commlikes &&
                          userAuthIdPost &&
                          comment.commlikes.includes(userAuthIdPost) ? (
                            <button
                              onClick={() =>
                                handleRemoveLikeClickComment(comment._id)
                              }
                            >
                              <div className=" text-blue-500 font-bold">
                                Liked
                              </div>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleLikeClickComment(comment._id)
                              }
                            >
                              <span>Like</span>
                            </button>
                          )}

                          {comment._id && (
                            <button
                              onClick={() => handleReplyClick(comment._id)}
                            >
                              Reply
                            </button>
                          )}
                        </div>

                        {comment.commlikes && comment.commlikes.length > 0 && (
                          <div className="flex justify-center items-center gap-1">
                            <FontAwesomeIcon
                              className="text-xs text-blue-700 flex justify-center items-center"
                              icon={faHeartSolid}
                            />

                            <span className="flex justify-center items-center text-xs">
                              {comment.commlikes.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex gap-2 ml-14 text-sm">
                    <button onClick={() => handleRepliesUser(comment._id)}>
                      View more replies
                    </button>
                  </div> */}

                  {/* <div className="flex gap-2 ml-14 text-sm">
                    {Array.isArray(comment.comments) &&
                      comment.comments.length > 0 && (
                        <button onClick={() => handleReplyClick(comment._id)}>
                          View more replies
                        </button>
                      )}
                  </div> */}
                  <div className="flex gap-2 ml-14 text-sm font-bold">
                    {!isReplying[comment._id] &&
                      Array.isArray(comment.comments) &&
                      comment.comments.length > 0 && (
                        <button onClick={() => handleReplyClick(comment._id)}>
                          {comment.comments.length === 1
                            ? "View 1 reply"
                            : `View all ${comment.comments.length} replies`}
                        </button>
                      )}
                  </div>
                  {isReplying[comment._id] && (
                    <motion.div
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 1,
                        delayChildren: 0.3,
                        staggerChildren: 0.05,
                      }}
                    >
                      {Array.isArray(comment.comments) &&
                      comment.comments.length > 0 ? (
                        comment.comments.map(
                          (reply: Comment, index: number) => (
                            <motion.div
                              key={`reply_${reply._id}`}
                              className="ml-14 mt-2 flex gap-2 relative z-10"
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.05,
                              }}
                            >
                              <div className="absolute -top-5 -left-1 w-4 h-20 border-b-4 border-r-4 border-gray-400 transform rotate-90 rounded-br-lg -z-10"></div>

                              {reply.replyBy?.profilePhoto && (
                                <Image src={reply.replyBy?.profilePhoto} />
                              )}
                              <div className="flex flex-col">
                                <div className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg">
                                  <div className="font-bold">
                                    {reply.replyBy?.firstName}{" "}
                                    {reply.replyBy?.lastName}
                                  </div>
                                  <div className="">{reply.text}</div>
                                </div>
                                <div className="text-xs text-gray-800">
                                  <span>
                                    {(() => {
                                      const timeDifference =
                                        formatDistanceToNow(
                                          new Date(reply.created),
                                          {
                                            addSuffix: false,
                                            includeSeconds: true,
                                          }
                                        );
                                      let formattedTime = timeDifference;
                                      if (timeDifference.includes("about")) {
                                        formattedTime = formattedTime.replace(
                                          /about/i,
                                          ""
                                        );
                                      }
                                      if (
                                        timeDifference.includes(
                                          "less than 5 second"
                                        )
                                      ) {
                                        formattedTime = formattedTime.replace(
                                          /less than 5 second/i,
                                          "less than 5 seconds"
                                        );
                                      }
                                      if (
                                        timeDifference.includes(
                                          "less than 10 second"
                                        )
                                      ) {
                                        formattedTime = formattedTime.replace(
                                          /less than 10 second/i,
                                          "less than 10 seconds"
                                        );
                                      }
                                      if (
                                        timeDifference.includes(
                                          "less than 20 second"
                                        )
                                      ) {
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
                            </motion.div>
                          )
                        )
                      ) : (
                        <div className="ml-14 text-sm text-gray-800 ">
                          No replies available.
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              ) : (
                <span className="text-sm">
                  Invalid commentBy data: {JSON.stringify(comment.commentBy)}
                </span>
              )}

              {isReplying[comment._id] && (
                <div className=" relative ml-9 mt-2">
                  <div className="absolute top-1 -left-1 w-4 h-10 border-b-4 border-r-4 border-gray-400 transform rotate-90 rounded-br-lg"></div>
                  <Formik
                    initialValues={{
                      text: "",
                      userId: userAuthId,
                      comment_id: comment._id,
                    }}
                    onSubmit={handleSubmitReplyComment}
                  >
                    <Form>
                      <div className="flex gap-[5px] z-10 relative">
                        {authUser ? (
                          <div className="flex-nowrap">
                            {authUser.profilePhoto && (
                              <Image src={authUser.profilePhoto} />
                            )}
                          </div>
                        ) : (
                          <p>Welcome, Guest!</p>
                        )}

                        <Field
                          type="text"
                          id="text"
                          name="text"
                          placeholder="Write your reply"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-full w-[90%]"
                        />
                      </div>
                    </Form>
                  </Formik>
                </div>
              )}
            </div>
          ))
        ) : (
          <span className="text-sm flex justify-center">
            No comments available.
          </span>
        )}
      </div>
    </>
  );
};

export default Comments;
