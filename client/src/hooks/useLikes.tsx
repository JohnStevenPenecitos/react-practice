import axios from "axios";
// import toast from "react-hot-toast";
import { useAuthContext } from "../components/Auth";
// import { useMutation, useQueryClient } from "react-query";

// const { authUser } = useAuthContext();

// const userAuthId = authUser?._id;

// const queryClient = useQueryClient();

// const userAuthIdPost = authUser?._id?.toString();

// const addLike = async (postId: string) => {
//   try {
//     if (authUser?._id !== undefined) {
//       const response = await axios.put(`/api/user/addlike/${postId}`, {
//         userId: userAuthId,
//       });

//       // Invalidate the "posts" query in the queryClient
//       queryClient.invalidateQueries("posts");

//       console.log(response.data);

//       // Return the response data or other relevant information
//       return response.data;
//     }
//   } catch (error) {
//     // Handle errors
//     console.error("Error adding like:", error);
//     throw error; // Rethrow the error to propagate it
//   }
// };

// export const useAddLikeMutation = () => {
//   return useMutation(addLike);
// };


//remove like
// const removeLike = async () => {
//   try {
//     const { data } = await axios.put(`/api/removelike/post/${id}`);
//   } catch (error) {
//     //   console.log(error.response.data.error);
//     //   toast.error(error.response.data.error);
//   }
// };

// export default useLikes;
