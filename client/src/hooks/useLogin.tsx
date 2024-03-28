// import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../authentication/Auth";
import * as yup from "yup";
import axios from "axios";
import { useMutation } from "react-query";

const useLogin = () => {
  // const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const loginSchema = yup.object().shape({
    userName: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const login = async (formData: { userName: string; password: string }) => {
    // setLoading(true);
    try {
      await loginSchema.validate(formData, { abortEarly: false });

      const response = await axios.post("/api/user/login-user", formData);

      if (response.status === 200) {
        // Successful login
        const data = response.data;
        toast.success("Login successful");
        localStorage.setItem("chat-user", JSON.stringify(data));
        setAuthUser(data);
        return data;
      } else {

        throw new Error("Failed to login");
      }
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        error.errors.forEach((validationError) => {
          toast.error(validationError);
        });
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error(error.response.data.error || "Invalid credentials");
      } else {
        toast.error(error.message || "Failed to login");
      }
    } finally {
      // setLoading(false);
    }
  };

  return useMutation(login);
};

export default useLogin;

// function handleInputErrors(username, password) {
// 	if (!username || !password) {
// 		toast.error("Please fill in all fields");
// 		return false;
// 	}

// 	return true;
// }
