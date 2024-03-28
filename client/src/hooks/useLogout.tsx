import { useState } from "react";
import { useAuthContext } from "../authentication/Auth";
import axios from "axios";
import toast from "react-hot-toast";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/user/logout", {});
      //   if (response.status === 201) {
      //   }

      const data = response.data;
      toast.success(response.data.message);

      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (error) {
      // Handle errors, e.g., toast.error(error.message);
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
