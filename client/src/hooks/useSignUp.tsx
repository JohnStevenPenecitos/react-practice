import { useMutation } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useAuthContext } from "../authentication/Auth";

// interface FormValues {
//   firstName: string;
//   lastName: string;
//   userName: string;
//   age: string;
//   password: string;
//   confirmpassword: string;
// }
const useSignUp = () => {
  const signUpSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    userName: yup.string().required("Username is required"),
    age: yup.string().required("Age is required"),
    password: yup.string().required("Password is required"),
    confirmpassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const { setAuthUser } = useAuthContext();

  const signUp = async (formData: {
    firstName: string;
    lastName: string;
    userName: string;
    age: string;
    password: string;
    confirmpassword: string;
  }) => {
    try {
      await signUpSchema.validate(formData, { abortEarly: false });

      const response = await axios.post("/api/user/signup", formData);

      if (response.status === 201) {
        toast.success(response.data.message);

        const user = response.data.user;

        localStorage.setItem("chat-user", JSON.stringify(user));
        setAuthUser(user);

        return user;
      } else {
        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.error("Failed to create an account");
        }

        throw new Error("Failed to create an account");
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof yup.ValidationError) {
        error.errors.forEach((validationError) => {
          toast.error(validationError);
        });
      } else {
        console.error("Error while creating an account:", error);

        toast.error("Failed to create an account");

        throw error;
      }
    }
  };

  return useMutation(signUp);
};

export default useSignUp;

// function handleInputErrors({
//   firstName,
//   lastName,
//   password,
//   userName,
//   confirmpassword,
// }: FormValues) {
//   if (!firstName || !lastName || !userName || !password || !confirmpassword) {
//     toast.error("Please fill in all fields.");
//     return false;
//   }

//   if (password !== confirmpassword) {
//     toast.error("Passwords do not match.");
//     return false;
//   }

//   if (password.length < 6) {
//     toast.error("Password must be at least 6 characters.");
//     return false;
//   }

//   return true;
// }
