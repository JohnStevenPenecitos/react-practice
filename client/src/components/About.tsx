// import { useState } from "react";
import TitlePage from "./TitlePage";
import useData, { useAddDataPost } from "../hooks/useData";
import { Link } from "react-router-dom";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

const About: React.FC = () => {
  // const [name, setName] = useState<string>("");
  const [alertVisible, setAlertVisibility] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [updatedName, setUpdatedName] = useState("");

  const handleEditClick = (name: string) => {
    setSelectedName(name);
    setUpdatedName(name);
    setAlertVisibility(true);
  };

  const handleUpdateName = () => {
    // Add logic to update the name, e.g., make an API call
    // For now, let's just update the state
    setSelectedName(updatedName);
    setAlertVisibility(false);
  };
  const { isLoading, data, isError, error, isFetching } = useData({
    onSuccess: () => {
      // console.log("Custom Success", data);
    },
    onError: () => {
      // console.log("Custom Error", error);
    },
  });

  const { mutate: addPost } = useAddDataPost();

  const handleSubmit = async (
    values: { name: string },
    { setSubmitting, resetForm }: FormikHelpers<{ name: string }>
  ) => {
    try {
      // Pass values object directly
      addPost(values);

      resetForm();

      // Handle success, e.g., show a success message
      console.log("Form submitted successfully!", values.name);
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }
  return (
    <>
      <TitlePage title="About Page" />
      {/* <Outlet /> */}
      <div className="max-w-sm mx-auto">
        <Formik initialValues={{ name: "" }} onSubmit={handleSubmit}>
          <Form>
            {/* Your form fields go here */}
            <label htmlFor="name">Name:</label>
            <Field
              type="text"
              id="name"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            {/* Submit button */}
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </Form>
        </Formik>

        {/* {alertVisible && (
          <Modal onClose={() => setAlertVisibility(false)}>
            <h1>{selectedName}</h1>
          </Modal>
        )} */}

        {alertVisible && (
          <Modal title="update" onClose={() => setAlertVisibility(false)}>
            <h1>{selectedName}</h1>
            <div className="bg-gray-200 flex items-center justify-center h-12">
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>

            <div className="flex justify-end p-2">
              <Button color="blue" onClick={handleUpdateName}>
                Update
              </Button>
            </div>
          </Modal>
        )}

        <div className="p-5">
          {data &&
            data.map((item) => (
              <div
                key={item.post_id}
                className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg mb-3 flex justify-between"
              >
                <Link to={`/app/about/${item.post_id}`}>{item.name}</Link>{" "}
                <Button color="red" onClick={() => handleEditClick(item.name)}>
                  Edit
                </Button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default About;
