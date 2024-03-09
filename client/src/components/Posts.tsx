import { Link } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import useData, { useUpdatePostData } from "../hooks/useData";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { formatDistanceToNow } from "date-fns";
// import { io, Socket } from "socket.io-client";

const Posts = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  // const [selectedName, setSelectedName] = useState("");

  const [updatedName, setUpdatedName] = useState("");

  const [postId, setPostId] = useState("");

  const handleEditClick = (name: string, postId: string) => {
    // console.log(`Edit button clicked for post_id: ${postId}`);
    // setSelectedName(name);
    setUpdatedName(name);
    setPostId(postId); // Set postId in state
    setAlertVisibility(true);
  };

  // const { isLoading, data, isError, error } = useData({
  //   onSuccess: () => {
  //     // console.log("Custom Success", data);
  //   },
  //   onError: () => {
  //     // console.log("Custom Error", error);
  //   },
  // });

  const { isLoading, data, isError, error } = useData({
    onSuccess: () => {
      // console.log("Custom Success", data);
    },
    onError: () => {
      // console.error("Custom Error", error);
    },
  });

  // useEffect(() => {
  //   // Set up an interval to refetch data every second
  //   const interval = setInterval(() => {
  //     refetch();
  //   }, 1000); // 1 second in milliseconds

  //   // Clean up the interval on component unmount
  //   return () => clearInterval(interval);
  // }, [refetch]);

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
          data.map((item) => (
            <div
              key={item.post_id}
              className="bg-red-200 border-2 border-blue-400  rounded-lg mb-3 flex flex-col"
            >
              <div className="flex flex-row justify-between p-2">
                <div className="flex flex-row gap-2">
                  <Image src="../images/KayeIcon.png" />
                  <div className="flex flex-col">
                    <span className="font-bold">John Steven Penecitos</span>
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <Button
                  color="red"
                  onClick={() => handleEditClick(item.name, item.post_id)}
                >
                  Edit
                </Button>
              </div>
              <div className="p-2">
                <Link to={`/app/about/${item.post_id}`}>{item.name}</Link>
              </div>

              <div className="flex gap-2 p-2">
                <button>
                  <FontAwesomeIcon
                    className="hover:bg-gray-400 mt-1 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
                    icon={faHeart}
                  />
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Posts;
