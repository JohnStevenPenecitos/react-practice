import { Link, useParams } from "react-router-dom";
import usePostDetails, {
  Comment,
  useAddDataComment,
} from "../hooks/usePostDetails";
import { Field, Form, Formik, FormikHelpers } from "formik";
import Comments from "./Comments";
import { useAuthContext } from "../authentication/Auth";
import Image from "./Image";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

import { faComment } from "@fortawesome/free-regular-svg-icons";
import TitlePage from "./TitlePage";
import axios from "axios";
import { useQueryClient } from "react-query";
import { socket } from "../hooks/useData";

const PostDetails = () => {
  const { postId } = useParams<{ postId?: string }>();

  const post_id = postId;

  // console.log(post_id);

  const { authUser } = useAuthContext();

  const userAuthId = authUser?._id;

  const userAuthIdPost = authUser?._id?.toString();

  const queryClient = useQueryClient();

  const handleLikeClick = async (postId: string) => {
    try {
      if (authUser?._id !== undefined) {
        const response = await axios.put(`/api/user/addlike/${postId}`, {
          userId: userAuthId,
        });
        console.log(response.data);

        // queryClient.invalidateQueries("posts");

        socket.emit("newLike1", response.data);

        socket.on("broadcastLike1", () => {
          // queryClient.invalidateQueries("comments");
          queryClient.invalidateQueries("posts");
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding like:", error);
    }
  };

  const handleRemoveLikeClick = async (postId: string) => {
    try {
      if (authUser?._id !== undefined) {
        const response = await axios.put(`/api/user/removelike/${postId}`, {
          userId: userAuthId,
        });
        console.log(response.data);
        queryClient.invalidateQueries("posts");

        socket.emit("removeLike1", response.data);

        socket.on("broadcastRemoveLike1", () => {
          queryClient.invalidateQueries("comments");
          queryClient.invalidateQueries("posts");
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding like:", error);
    }
  };

  const { isLoading, data, isError, error } = usePostDetails(postId || "", {
    onSuccess: (fetchedData) => {
      if (fetchedData && fetchedData.postData) {
        console.log("Custom Success", fetchedData.postData);
        console.log("data:", data);
      }
    },
    onError: (customError) => {
      console.log("Custom Error", customError.message);
    },
  });

  // const { mutate: addComment } = useAddDataComment();
  const { mutate: addComment } = useAddDataComment({
    userId: authUser ? authUser._id : null,
  });

  const handleSubmitComment = async (
    values: { content: string; post_id: string },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{ content: string; post_id: string }>
  ) => {
    try {
      // Pass values object directly
      addComment(values);

      resetForm();

      // Handle success, e.g., show a success message
      console.log("Comment submitted successfully!", values.content);
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
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
      <div className="p-2">
        <div className="mx-auto max-w-3xl  rounded-lg overflow-hidden relative z-10">
          <div className="bg-gray-700 justify-center flex items-center h-10 text-white relative z-10">
            {data && data.postData ? (
              data.postData.userData && data.postData.userData.postedBy ? (
                <>
                  <div className="flex gap-2">
                    <div className="font-bold">
                      {`${data.postData.userData.postedBy.firstName}'s Post`}
                    </div>
                  </div>
                  <TitlePage
                    title={`${data.postData.userData.postedBy.firstName}'s Post`}
                  />
                </>
              ) : (
                <p>No user data available</p>
              )
            ) : (
              <p>No data available</p>
            )}

            <div className=" w-full absolute flex justify-start items-start -z-10 mt-1">
              <Link to={`/app/about/`} className="p-2">
                <FontAwesomeIcon
                  className="rounded-full p-2 text-sm bg-gray-500 text-white"
                  icon={faArrowLeft}
                />
              </Link>
            </div>
          </div>
          <div className="p-2  max-h-[70vh]  overflow-auto bg-amber-200">
            <div>
              {data && data.postData ? (
                <div>
                  {data.postData.userData &&
                    data.postData.userData.postedBy && (
                      <div className="flex gap-2">
                        {data.postData.userData.postedBy.profilePhoto && (
                          <Image
                            src={data.postData.userData.postedBy.profilePhoto}
                          />
                        )}

                        <div className="flex flex-col">
                          <div className="font-bold">
                            {`${data.postData.userData.postedBy.firstName} ${data.postData.userData.postedBy.lastName}`}
                          </div>

                          <span className="text-sm">
                            {formatDistanceToNow(
                              new Date(data.postData.userData.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                  {data.postData.userData && (
                    <div className="p-2">{data.postData.userData.name}</div>
                  )}

                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      {data.postData.userData.likes.length > 0 && (
                        <>
                          <FontAwesomeIcon
                            className={`mt-1 rounded-full p-2 text-sm bg-gray-200 ${
                              data.postData.userData.likes &&
                              userAuthIdPost &&
                              data.postData.userData.likes.includes(
                                userAuthIdPost
                              )
                                ? "text-blue-500"
                                : ""
                            }`}
                            icon={faHeartSolid}
                          />

                          <h1 className="flex justify-center items-center">
                            {data.postData.userData.likes &&
                            data.postData.userData.likes.length > 0
                              ? data.postData.userData.likes.length
                              : 0}
                          </h1>
                        </>
                      )}
                    </div>

                    <div className="flex justify-center items-center">
                      {/* <h1>
                        {data.postData.commentsData &&
                          data.postData.commentsData.length > 0 && (
                            <>
                              <div className="flex gap-1 justify-center items-center p-2 hover:underline">
                                <h1>{data.postData.commentsData.length}</h1>
                                <span>
                                  {data.postData.commentsData.length === 1
                                    ? "comment"
                                    : "comments"}
                                </span>
                              </div>
                            </>
                          )}
                      </h1> */}
                      <h1>
                        {data.postData.commentsData &&
                          data.postData.commentsData &&
                          data.postData.commentsData.length > 0 && (
                            <>
                              <div className="flex gap-1 justify-center items-center  hover:underline">
                                <h1>{data.postData.commentsData.length}</h1>
                                <span>
                                  {data.postData.commentsData.length === 1
                                    ? "comment"
                                    : "comments"}
                                </span>
                              </div>
                            </>
                          )}
                      </h1>
                      {/* <span className="h-[4px] w-[4px] rounded-full bg-gray-900 m-2 flex justify-center items-center"></span>
                      <h1>
                        {data.postData.commentsData &&
                          data.postData.commentsData.length > 0 && (
                            <>
                              <div className="flex gap-1 justify-center items-center hover:underline">
                                <h1>
                                  {data.postData.commentsData.reduce(
                                    (totalReplies: number, comment: Comment) =>
                                      totalReplies + comment.comments.length,
                                    0
                                  )}
                                </h1>
                                <span>
                                  {data.postData.commentsData.reduce(
                                    (totalReplies: number, comment: Comment) =>
                                      totalReplies + comment.comments.length,
                                    0
                                  ) === 1
                                    ? "reply"
                                    : "replies"}
                                </span>
                              </div>
                            </>
                          )}
                      </h1> */}
                      {data.postData.commentsData &&
                        data.postData.commentsData.length > 0 && (
                          <>
                            {data.postData.commentsData.reduce(
                              (totalReplies: number, comment: Comment) =>
                                totalReplies + comment.comments.length,
                              0
                            ) > 0 && (
                              <>
                                <span className="h-[4px] w-[4px] rounded-full bg-gray-900 m-2 flex justify-center items-center"></span>
                                <div className="flex gap-1 justify-center items-center hover:underline">
                                  <h1>
                                    {data.postData.commentsData.reduce(
                                      (
                                        totalReplies: number,
                                        comment: Comment
                                      ) =>
                                        totalReplies + comment.comments.length,
                                      0
                                    )}
                                  </h1>
                                  <span>
                                    {data.postData.commentsData.reduce(
                                      (
                                        totalReplies: number,
                                        comment: Comment
                                      ) =>
                                        totalReplies + comment.comments.length,
                                      0
                                    ) === 1
                                      ? "reply"
                                      : "replies"}
                                  </span>
                                </div>
                              </>
                            )}
                          </>
                        )}
                    </div>
                  </div>

                  <div className="my-2 border-y-[1px] border-gray-500">
                    <div className="flex justify-center items-center p-1">
                      {data.postData.userData.likes &&
                      userAuthIdPost &&
                      data.postData.userData.likes.includes(userAuthIdPost) ? (
                        <button
                          className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                          onClick={() =>
                            handleRemoveLikeClick(data.postData.userData._id)
                          }
                        >
                          <div className="flex gap-2 p-1">
                            <FontAwesomeIcon
                              className={`rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center ${
                                data.postData.userData.likes &&
                                userAuthIdPost &&
                                data.postData.userData.likes.includes(
                                  userAuthIdPost
                                )
                                  ? "text-blue-500"
                                  : ""
                              }`}
                              icon={
                                data.postData.userData.likes &&
                                userAuthIdPost &&
                                data.postData.userData.likes.includes(
                                  userAuthIdPost
                                )
                                  ? faHeartSolid
                                  : faHeartRegular
                              }
                            />
                            <span className="flex justify-center items-center">
                              Liked
                            </span>
                          </div>
                        </button>
                      ) : (
                        <button
                          className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                          onClick={() =>
                            handleLikeClick(data.postData.userData._id)
                          }
                        >
                          <div className="flex gap-2 p-1">
                            <FontAwesomeIcon
                              className={`rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center ${
                                data.postData.userData.likes &&
                                userAuthIdPost &&
                                data.postData.userData.likes.includes(
                                  userAuthIdPost
                                )
                                  ? "text-blue-500"
                                  : ""
                              }`}
                              icon={
                                data.postData.userData.likes &&
                                userAuthIdPost &&
                                data.postData.userData.likes.includes(
                                  userAuthIdPost
                                )
                                  ? faHeartSolid
                                  : faHeartRegular
                              }
                            />
                            <span className="flex justify-center items-center">
                              Like
                            </span>
                          </div>
                        </button>
                      )}

                      <button className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center">
                        <div className="flex gap-2 p-1">
                          <FontAwesomeIcon
                            className="rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center"
                            icon={faComment}
                          />

                          <span className="flex justify-center items-center">
                            Comments
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No data available</p>
              )}
            </div>

            <Comments />
          </div>
          <div className="bg-gray-700 p-2">
            <Formik
              initialValues={{ content: "", post_id: post_id || "" }}
              onSubmit={handleSubmitComment}
            >
              <Form>
                <div className="flex gap-2">
                  {authUser ? (
                    <>
                      <div className="flex-nowrap">
                        {authUser.profilePhoto && (
                          <Image src={authUser.profilePhoto} />
                        )}
                      </div>
                    </>
                  ) : (
                    <p>Welcome, Guest!</p>
                  )}
                  <Field
                    type="text"
                    id="content"
                    name="content"
                    placeholder="Write your comment..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 rounded-full w-[90%]"
                  />
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
