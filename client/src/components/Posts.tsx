import { Link } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";
import { useEffect, useState } from "react";
import useData, { useUpdatePostData } from "../hooks/useData";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useAuthContext } from "./Auth";
import { io } from "socket.io-client";
import { useQueryClient } from "react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import noMorePostImage from "/images/jelly-character-cant-find-the-right-page.png";

const Posts = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  // const [selectedName, setSelectedName] = useState("");

  const [updatedName, setUpdatedName] = useState("");

  const [postId, setPostId] = useState("");

  const [showLikedBy, setShowLikedBy] = useState(false);

  const { authUser } = useAuthContext();

  const userAuthId = authUser?._id;

  const userAuthIdPost = authUser?._id?.toString();

  const socket = io("http://localhost:3000");

  const [likedUsers, setLikedUsers] = useState<any[]>([]);

  // console.log(userAuthIdPost);
  const queryClient = useQueryClient();

  const handleAddLikeClick = async (postId: string) => {
    try {
      if (authUser?._id !== undefined) {
        const response = await axios.put(`/api/user/addlike/${postId}`, {
          userId: userAuthId,
        });
        console.log(response.data);
        queryClient.invalidateQueries("posts");

        socket.emit("newLike", response.data);

        socket.on("broadcastLike", () => {
          queryClient.invalidateQueries("comments");
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

        socket.emit("removeLike", response.data);

        socket.on("broadcastRemoveLike", () => {
          queryClient.invalidateQueries("comments");
          queryClient.invalidateQueries("posts");
        });
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding like:", error);
    }
  };

  // const handleLikeClick = async (
  //   postId: string,
  //   userAuthId: string | undefined
  // ) => {
  //   try {
  //     if (userAuthId) {
  //       const response = await axios.put(`/api/user/addlike/${postId}`, {
  //         userId: userAuthId,
  //       });
  //       console.log(response.data);
  //     }
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error adding like:", error);
  //   }
  // };

  // const handleEditClick = (name: string, postId: string) => {
  //   setUpdatedName(name);
  //   setPostId(postId); // Set postId in state
  //   setAlertVisibility(true);
  // };

  const handleLikedUser = async (postId: string) => {
    try {
      const response = await axios.get(`/api/user/likes/${postId}`);
      const data = response.data;

      console.log(postId);
      console.log("fasfdsa", data);
      setShowLikedBy(true);
      setLikedUsers(data.likes);
    } catch (error) {
      console.error("Error fetching liked users:", error);
    }
  };

  // const { isLoading, data, isError, error } = useData({
  //   onSuccess: () => {
  //     console.log("Custom Success", data);
  //   },
  //   onError: () => {
  //     // console.error("Custom Error", error);
  //   },
  // });

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useData();

  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (data) {
      const total = data.pages.reduce((acc, curr) => acc + curr.length, 0);
      setTotalItems(total);
    }
  }, [data]);

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  const page = hasNextPage;

  console.log(page);

  // const handleFetchNextPage = () => {
  //   if (hasNextPage) {
  //     fetchNextPage();
  //   }
  // };

  console.log("Data Pages:", data && data.pages);

  const { mutate: updatePost } = useUpdatePostData();

  const handleSubmit = async (
    values: { name: string; postId: string },
    formikHelpers: FormikHelpers<{ name: string; postId: string }>
  ) => {
    try {
      updatePost(values);

      formikHelpers.resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      formikHelpers.setSubmitting(false);
      setAlertVisibility(false);
    }
  };

  // const { mutate: addlikePost } = useAddLikeMutation();

  // const handleLikeClick = async (postId: string) => {
  //   try {
  //     // Call the addLike function passing the postId
  //     await addlikePost(postId);
  //     // Handle success if needed
  //     console.log("Like added successfully");
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error handling like:", error);
  //   }
  // };

  if (isLoading) {
    return (
      <div className=" mx-auto p-5">
        <div className="animate-pulse bg-gray-300  mb-3 rounded-lg p-3">
          <div className="flex  gap-2">
            <div className=" justify-center items-center flex">
              <div className=" bg-gray-400 animate-pulse h-14 w-14 rounded-full "></div>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <div className=" bg-gray-400 animate-pulse h-4 w-48 rounded-full"></div>
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-400 animate-pulse h-5 w-48 rounded-full my-5"></div>
          <div className="flex  gap-2 justify-between my-2">
            <div className=" bg-gray-400 animate-pulse h-4 w-16 rounded-full"></div>
            <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
          </div>
          <div className=" border-t-[1px] border-gray-500 pt-2">
            <div className="flex justify-evenly p-2">
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="animate-pulse bg-gray-300  mb-3 rounded-lg p-3">
          <div className="flex  gap-2">
            <div className=" justify-center items-center flex">
              <div className=" bg-gray-400 animate-pulse h-14 w-14 rounded-full "></div>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <div className=" bg-gray-400 animate-pulse h-4 w-48 rounded-full"></div>
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-400 animate-pulse h-5 w-48 rounded-full my-5"></div>
          <div className="flex  gap-2 justify-between my-2">
            <div className=" bg-gray-400 animate-pulse h-4 w-16 rounded-full"></div>
            <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
          </div>
          <div className=" border-t-[1px] border-gray-500 pt-2">
            <div className="flex justify-evenly p-2">
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="animate-pulse bg-gray-300  mb-3 rounded-lg p-3">
          <div className="flex  gap-2">
            <div className=" justify-center items-center flex">
              <div className=" bg-gray-400 animate-pulse h-14 w-14 rounded-full "></div>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <div className=" bg-gray-400 animate-pulse h-4 w-48 rounded-full"></div>
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
            </div>
          </div>
          <div className="bg-gray-400 animate-pulse h-5 w-48 rounded-full my-5"></div>
          <div className="flex  gap-2 justify-between my-2">
            <div className=" bg-gray-400 animate-pulse h-4 w-16 rounded-full"></div>
            <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
          </div>
          <div className=" border-t-[1px] border-gray-500 pt-2">
            <div className="flex justify-evenly p-2">
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
              <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="max-w-sm mx-auto p-5">{error?.message}</div>;
  }

  return (
    <>
      <div id="scrollableDiv" className="max-h-[87.7vh] overflow-auto">
        <div className="max-w-sm mx-auto">
          {alertVisible && (
            <Modal title="update" onClose={() => setAlertVisibility(false)}>
              <Formik
                initialValues={{ name: updatedName, postId: postId }}
                onSubmit={handleSubmit}
              >
                <Form className="border-2 border-red-200 flex flex-col justify-center p-2">
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                  <div className="flex justify-end p-2">
                    <Button color="blue">Update</Button>
                  </div>
                </Form>
              </Formik>
            </Modal>
          )}
        </div>
        {totalItems > 0 ? (
          <InfiniteScroll
            dataLength={totalItems}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className=" mx-auto p-2 w-full">
                <div className="animate-pulse bg-gray-300  mb-3 rounded-lg p-3">
                  <div className="flex  gap-2">
                    <div className=" justify-center items-center flex">
                      <div className=" bg-gray-400 animate-pulse h-14 w-14 rounded-full "></div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <div className=" bg-gray-400 animate-pulse h-4 w-48 rounded-full"></div>
                      <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-gray-400 animate-pulse h-5 w-48 rounded-full my-5"></div>
                  <div className="flex  gap-2 justify-between my-2">
                    <div className=" bg-gray-400 animate-pulse h-4 w-16 rounded-full"></div>
                    <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
                  </div>
                  <div className=" border-t-[1px] border-gray-500 pt-2">
                    <div className="flex justify-evenly p-2">
                      <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
                      <div className=" bg-gray-400 animate-pulse h-4 w-24 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            }
            scrollableTarget="scrollableDiv"
            height={"76vh"}
          >
            <div className="w-full p-2 ">
              {data && data.pages && data.pages.length > 0 ? (
                data.pages.map((page, pageIndex) => (
                  <div key={pageIndex}>
                    {page.map((item, index) => (
                      <div
                        key={index}
                        className="bg-red-200 border-2 border-blue-400 rounded-lg mb-3 flex flex-col"
                      >
                        <div className="flex flex-row justify-between p-2">
                          <div className="flex flex-row gap-2">
                            {item.postedBy &&
                            typeof item.postedBy === "object" ? (
                              <>
                                {item.postedBy.profilePhoto && (
                                  <Image src={item.postedBy.profilePhoto} />
                                )}
                                <div className="flex flex-col">
                                  <div className="flex  items-center font-bold">
                                    {item.postedBy.firstName &&
                                      `${item.postedBy.firstName} ${item.postedBy.lastName}`}
                                  </div>
                                  <span className="text-sm">
                                    {formatDistanceToNow(
                                      new Date(item.createdAt),
                                      {
                                        addSuffix: true,
                                      }
                                    )}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-sm">
                                Invalid postedBy data:{" "}
                                {JSON.stringify(item.postedBy)}
                              </span>
                            )}
                          </div>

                          <FontAwesomeIcon
                            className="rounded-full p-2 text-2xl  flex justify-center items-center hover:bg-gray-200 cursor-pointer"
                            icon={faEllipsis}
                          />
                        </div>
                        <div className="p-2">
                          <Link to={`/app/about/${item._id}`}>{item.name}</Link>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex gap-2 p-2">
                            {item.likes && item.likes.length > 0 && (
                              <>
                                <div>
                                  <FontAwesomeIcon
                                    className={`rounded-full p-2 text-xs bg-gray-200 flex justify-center items-center ${
                                      item.likes.some((like) => like._id)
                                        ? "text-blue-500"
                                        : ""
                                    }`}
                                    icon={
                                      item.likes.some((like) => like._id)
                                        ? faHeartSolid
                                        : faHeartRegular
                                    }
                                  />
                                </div>
                                <h1
                                  className="flex justify-center items-center hover:underline cursor-pointer"
                                  onClick={() => handleLikedUser(item._id)}
                                >
                                  {item.likes.length}
                                </h1>
                              </>
                            )}
                          </div>

                          <Link to={`/app/about/${item._id}`}>
                            {item.comments && item.comments.length > 0 && (
                              <div className="flex gap-1 justify-center items-center p-2 hover:underline">
                                <h1>{item.comments.length}</h1>
                                <span>
                                  {item.comments.length === 1
                                    ? "comment"
                                    : "comments"}
                                </span>
                              </div>
                            )}
                          </Link>
                        </div>
                        <div className=" border-t-[1px] border-gray-500">
                          <div className="flex justify-center items-center p-1">
                            {item.likes &&
                            userAuthIdPost &&
                            item.likes.some(
                              (like: { _id: string }) =>
                                like._id === userAuthIdPost
                            ) ? (
                              <button
                                className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                                onClick={() => handleRemoveLikeClick(item._id)}
                              >
                                <div className="flex gap-2 p-1">
                                  <FontAwesomeIcon
                                    className={`rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center ${
                                      item.likes &&
                                      userAuthIdPost &&
                                      item.likes.some(
                                        (like: { _id: string }) =>
                                          like._id === userAuthIdPost
                                      )
                                        ? "text-blue-500"
                                        : ""
                                    }`}
                                    icon={
                                      item.likes &&
                                      userAuthIdPost &&
                                      item.likes.some(
                                        (like: { _id: string }) =>
                                          like._id === userAuthIdPost
                                      )
                                        ? faHeartSolid
                                        : faHeartRegular
                                    }
                                  />
                                  <span className="flex justify-center items-center text-blue-500">
                                    Liked
                                  </span>
                                </div>
                              </button>
                            ) : (
                              <button
                                className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                                onClick={() => handleAddLikeClick(item._id)}
                              >
                                <div className="flex gap-2 p-1">
                                  <FontAwesomeIcon
                                    className={`rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center ${
                                      item.likes &&
                                      userAuthIdPost &&
                                      item.likes.some(
                                        (like: { _id: string }) =>
                                          like._id === userAuthIdPost
                                      )
                                        ? "text-blue-500"
                                        : ""
                                    }`}
                                    icon={
                                      item.likes &&
                                      userAuthIdPost &&
                                      item.likes.some(
                                        (like: { _id: string }) =>
                                          like._id === userAuthIdPost
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
                            <Link
                              to={`/app/about/${item._id}`}
                              className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                            >
                              <div className="flex gap-2 p-1">
                                <FontAwesomeIcon
                                  className="rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center"
                                  icon={faComment}
                                />
                                <span className="flex justify-center items-center">
                                  Comments
                                </span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div>No more posts available</div>
              )}
              {!hasNextPage && totalItems > 0 && (
                <div className=" bg-red-200 text-center rounded-lg flex justify-center items-center flex-col p-5">
                  <img src={noMorePostImage} className="h-40 -mt-10" alt="" />
                  <span className="font-bold">No more posts available</span>
                </div>
              )}
            </div>
          </InfiniteScroll>
        ) : (
          <div>No posts available</div>
        )}
        {showLikedBy && (
          <Modal title="default" onClose={() => setShowLikedBy(false)}>
            <div className="max-h-[50vh] overflow-auto flex flex-col justify-start items-start">
              <h1 className="p-2">Liked by:</h1>
              <div className="flex flex-col gap-2 p-2">
                {likedUsers.map((like, index) => (
                  <div key={index} className="flex flex-row gap-2 items-center">
                    {like.profilePhoto && <Image src={like.profilePhoto} />}
                    <span className="font-bold">{`${like.firstName} ${like.lastName}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};
{
  /* <div>
                    <FontAwesomeIcon
                      className={`rounded-full p-2 text-xs bg-gray-200 flex justify-center items-center ${
                        item.likes &&
                        userAuthIdPost &&
                        item.likes.includes(userAuthIdPost)
                          ? "text-blue-500"
                          : ""
                      }`}
                      icon={
                        item.likes &&
                        userAuthIdPost &&
                        item.likes.includes(userAuthIdPost)
                          ? faHeartSolid
                          : faHeartRegular
                      }
                    />
                  </div>
                  <h1 className="flex justify-center items-center">
                    {item.likes.length > 0 ? item.likes.length : null}{" "}
                  </h1>
                </div> */
}
{
  /* <div className="w-full p-2">
        {data &&
          data.map((item, index) => (
            <div
              key={index}
              className="bg-red-200 border-2 border-blue-400 rounded-lg mb-3 flex flex-col"
            >
              <div className="flex flex-row justify-between p-2">
                <div className="flex flex-row gap-2">
                  {item.postedBy && typeof item.postedBy === "object" ? (
                    <>
                      {item.postedBy.profilePhoto && (
                        <Image src={item.postedBy.profilePhoto} />
                      )}
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                          {item.postedBy.firstName && (
                            <span className="font-bold">
                              {item.postedBy.firstName}
                            </span>
                          )}
                          {item.postedBy.lastName && (
                            <span className="font-bold">
                              {item.postedBy.lastName}
                            </span>
                          )}
                        </div>
                        <span className="text-sm">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm">
                      Invalid postedBy data: {JSON.stringify(item.postedBy)}
                    </span>
                  )}
                </div>

                <FontAwesomeIcon
                  className="rounded-full p-2 text-2xl  flex justify-center items-center hover:bg-gray-200 cursor-pointer"
                  icon={faEllipsis}
                />
              </div>
              <div className="p-2">
                <Link to={`/app/about/${item._id}`}>{item.name}</Link>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2 p-2">
                  {item.likes && item.likes.length > 0 && (
                    <>
                      <div>
                        <FontAwesomeIcon
                          className={`rounded-full p-2 text-xs bg-gray-200 flex justify-center items-center ${
                            item.likes.some((like) => like._id)
                              ? "text-blue-500"
                              : ""
                          }`}
                          icon={
                            item.likes.some((like) => like._id)
                              ? faHeartSolid
                              : faHeartRegular
                          }
                        />
                      </div>
                      <h1
                        className="flex justify-center items-center hover:underline cursor-pointer"
                        onClick={() => handleLikedUser(item._id)}
                      >
                        {item.likes.length}
                      </h1>
                    </>
                  )}
                </div>

                <Link to={`/app/about/${item._id}`}>
                  {item.comments && item.comments.length > 0 && (
                    <div className="flex gap-1 justify-center items-center p-2 hover:underline">
                      <h1>{item.comments.length}</h1>
                      <span>
                        {item.comments.length === 1 ? "comment" : "comments"}
                      </span>
                    </div>
                  )}
                </Link>
              </div>
              <div className=" border-t-[1px] border-gray-500">
                <div className="flex justify-center items-center p-1">
                  {item.likes &&
                  userAuthIdPost &&
                  item.likes.some(
                    (like: { _id: string }) => like._id === userAuthIdPost
                  ) ? (
                    <button
                      className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                      onClick={() => handleRemoveLikeClick(item._id)}
                    >
                      <div className="flex gap-2 p-1">
                        <FontAwesomeIcon
                          className={`rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center ${
                            item.likes &&
                            userAuthIdPost &&
                            item.likes.some(
                              (like: { _id: string }) =>
                                like._id === userAuthIdPost
                            )
                              ? "text-blue-500"
                              : ""
                          }`}
                          icon={
                            item.likes &&
                            userAuthIdPost &&
                            item.likes.some(
                              (like: { _id: string }) =>
                                like._id === userAuthIdPost
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
                      onClick={() => handleAddLikeClick(item._id)}
                    >
                      <div className="flex gap-2 p-1">
                        <FontAwesomeIcon
                          className={`rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center ${
                            item.likes &&
                            userAuthIdPost &&
                            item.likes.some(
                              (like: { _id: string }) =>
                                like._id === userAuthIdPost
                            )
                              ? "text-blue-500"
                              : ""
                          }`}
                          icon={
                            item.likes &&
                            userAuthIdPost &&
                            item.likes.some(
                              (like: { _id: string }) =>
                                like._id === userAuthIdPost
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
                  <Link
                    to={`/app/about/${item._id}`}
                    className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                  >
                    <div className="flex gap-2 p-1">
                      <FontAwesomeIcon
                        className="rounded-full p-2 text-sm bg-gray-200 flex justify-center items-center"
                        icon={faComment}
                      />
                      <span className="flex justify-center items-center">
                        Comments
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div> */
}

export default Posts;
