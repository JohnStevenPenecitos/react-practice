import { useState } from "react";
import { useAuthContext } from "../components/Auth";
import axios from "axios";
import toast from "react-hot-toast";

// const useLogout = () => {
//   const [loading, setLoading] = useState(false);
//   const { setAuthUser } = useAuthContext();

//   const logout = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/user/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await res.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       localStorage.removeItem("chat-user");
//       setAuthUser(null);
//     } catch (error) {
//     //   toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, logout };
// };
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
