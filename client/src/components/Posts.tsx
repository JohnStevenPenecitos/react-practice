import { Link, Outlet } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import useData, { useUpdatePostData } from "../hooks/useData";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
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
// import { io } from "socket.io-client";
// import { useQueryClient } from "react-query";
// import { useAddLikeMutation } from "../hooks/useLikes";
// import { useQueryClient } from "react-query";
// import { useAuthContext } from "./Auth";
// import { io, Socket } from "socket.io-client";
// import { io } from "socket.io-client";

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

  const handleLikeClick = async (postId: string) => {
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

  const handleEditClick = (name: string, postId: string) => {
    setUpdatedName(name);
    setPostId(postId); // Set postId in state
    setAlertVisibility(true);
  };

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

  const { isLoading, data, isError, error } = useData({
    onSuccess: () => {
      console.log("Custom Success", data);
    },
    onError: () => {
      // console.error("Custom Error", error);
    },
  });

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
      <div className="max-w-sm mx-auto p-5">
        <div className="animate-pulse bg-gray-300 h-12 mb-2 rounded"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="max-w-sm mx-auto p-5">{error?.message}</div>;
  }

  return (
    <>
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

      <div className="w-full p-2">
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
                <Button
                  color="red"
                  onClick={() => handleEditClick(item.name, item.post_id)}
                >
                  Edit
                </Button>
              </div>
              <div className="p-2">
                <Link to={`/app/about/${item._id}`}>{item.name}</Link>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2 p-2">
                  {/* {item.likes && (
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
                        onClick={() => handleLikedUser(item._id)} // Pass the postId to the function
                      >
                        {item.likes.length}
                      </h1>
                    </>
                  )} */}
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
                        onClick={() => handleLikedUser(item._id)} // Pass the postId to the function
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
                  <button
                    className="hover:bg-gray-100 rounded-lg w-full flex justify-center items-center"
                    onClick={() => handleLikeClick(item._id)}
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
                        {item.likes &&
                        userAuthIdPost &&
                        item.likes.some(
                          (like: { _id: string }) => like._id === userAuthIdPost
                        )
                          ? "Liked"
                          : "Like"}
                      </span>
                    </div>
                  </button>
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

export default Posts;
