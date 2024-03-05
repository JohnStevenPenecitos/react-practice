import Image from "./Image";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useAddDataPost } from "../hooks/useData";
import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

function AddPost() {
  const [alertVisible, setAlertVisibility] = useState(false);

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
      setAlertVisibility(false);
    }
  };

  
  return (
    <>
      <div className=" p-2">
        <div className=" bg-gray-500 w-full flex  overflow-hidden p-2 rounded-xl gap-2">
          <Image src="../images/KayeIcon.png" />
          <button
            className="rounded-full bg-gray-200 w-full text-left pl-4"
            onClick={() => setAlertVisibility(true)}
          >
            What's on your mind?
          </button>
        </div>
      </div>

      {alertVisible && (
        <Modal title="add" onClose={() => setAlertVisibility(false)}>
            <Formik initialValues={{ name: "" }} onSubmit={handleSubmit}>
              <Form className="h-32 border-2 border-red-200 flex flex-col  justify-center p-2">
                <Field
                  type="textarea"
                  id="name"
                  name="name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <div className="flex justify-end p-2">
                  <Button color="red">Post!</Button>
                </div>
              </Form>
            </Formik>
        </Modal>
      )}
    </>
  );
}

export default AddPost;
