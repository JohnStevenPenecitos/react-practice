// import { useState } from "react";
import TitlePage from "./TitlePage";
import { useAddDataPost } from "../hooks/useData";
import { Field, Form, Formik, FormikHelpers } from "formik";
import Posts from "./Posts";

const About: React.FC = () => {
  // const [name, setName] = useState<string>("");

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
      </div>
      <Posts />
    </>
  );
};

export default About;
