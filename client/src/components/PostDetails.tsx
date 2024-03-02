import { useParams } from "react-router-dom";
import usePostDetails, { useAddDataComment } from "../hooks/usePostDetails";
import { Field, Form, Formik, FormikHelpers } from "formik";
import Comments from "./Comments";

const PostDetails = () => {
  const { postId } = useParams<{ postId?: string }>();

  const post_id = postId;

  // console.log(post_id);

  // const { isLoading, data, isError, error, isFetching } = usePostDetails(
  //   postId || "",
  //   {
  //     onSuccess: () => {
  //       // console.log("Custom Success", data);
  //     },
  //     onError: () => {
  //       console.log("Custom Error", error);
  //     },
  //   }
  // );

  const { isLoading, data, isError, error } = usePostDetails(
    postId || "",
    {
      onSuccess: (fetchedData) => {
        // Check if data is available to avoid issues during initial loading
        if (fetchedData && fetchedData.postData) {
          console.log("Custom Success", fetchedData.postData);
        }
      },
      onError: (customError) => {
        console.log("Custom Error", customError.message);
      },
    }
  );

  const { mutate: addComment } = useAddDataComment();

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
      <div>
        <div
          key={`post_${data?.postData._id}`}
          className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg mb-3"
        >
          {data?.postData.name}
        </div>
      </div>
      <div className="bg-green-200 p-5">
        <Formik
          initialValues={{ content: "", post_id: post_id || "" }}
          onSubmit={handleSubmitComment}
        >
          <Form>
            <label htmlFor="comment">Comment:</label>
            <Field
              type="text"
              id="content"
              name="content"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
      <Comments />
    </>
  );
};

export default PostDetails;
