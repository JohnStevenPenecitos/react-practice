import axios from "axios";
import toast from "react-hot-toast";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "react-query";
import { io } from "socket.io-client";

interface dataItem {
  _id: string;
  name: string;
  post_id: string;
  createdAt: string;
}

interface MyError {
  message: string;
}

// const socket = io("http://localhost:3000");

const socket = io("https://react-practice-zeta-rust.vercel.app");


const fetchData = async () => {
  // return axios.get("/api/user/dataget").then((response) => response.data);

  return axios
    .get("https://react-practice-zeta-rust.vercel.app/api/user/dataget")
    .then((response) => response.data);
};

// const useData = (
//   options?: UseQueryOptions<dataItem[], MyError>,
//   OnSuccess?: (data: dataItem[]) => void,
//   OnError?: (error: MyError) => void
// ) => {
//   const onSuccess = (data: dataItem[]) => {
//     if (OnSuccess) {
//       OnSuccess(data);
//     }
//   };

//   const onError = (error: MyError) => {
//     if (OnError) {
//       OnError(error);
//     }
//   };

//   return useQuery<dataItem[], MyError>("posts", fetchData, {
//     onSuccess,
//     onError,
//     ...options,
//   });
// };

const useData = (
  // socket: Socket,
  options?: UseQueryOptions<dataItem[], MyError>,
  OnSuccess?: (data: dataItem[]) => void,
  OnError?: (error: MyError) => void
) => {
  const queryClient = useQueryClient();

  const onSuccess = (data: dataItem[]) => {
    if (OnSuccess) {
      OnSuccess(data);
    }
  };

  const onError = (error: MyError) => {
    if (OnError) {
      OnError(error);
    }
  };

  const invalidateQueryOnSocketEvent = () => {
    queryClient.invalidateQueries("posts");
  };

  // Listen for the "dataChanged" event and invalidate the query
  socket.on("dataChanged", invalidateQueryOnSocketEvent);

  const queryOptions: UseQueryOptions<dataItem[], MyError> = {
    onSuccess,
    onError,
    ...options,
  };

  return useQuery<dataItem[], MyError>("posts", fetchData, queryOptions);
};

// export const useAddDataPost = () => {
//   const queryClient = useQueryClient();

//   const addPostData = async ({ name }: { name: string }) => {
//     return await axios.post("/api/user/datainsert", { name });
//   };
//   socket.emit("newPost", { name });

//   return useMutation(addPostData, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("posts");
//     },
//   });
// };

export const useAddDataPost = () => {
  const queryClient = useQueryClient();

  const addPostData = async ({ name }: { name: string }) => {
    try {
      // const response = await axios.post("/api/user/datainsert", { name });

      const response = await axios.post(
        "https://react-practice-zeta-rust.vercel.app/api/user/datainsert",
        { name }
      );

      console.log("Response from server:", response.data);

      socket.emit("newPost", response.data);

      queryClient.invalidateQueries("posts");

      return response.data;
    } catch (error) {
      console.error("Error while adding post:", error);
      throw error;
    }
  };

  socket.on("broadcastNewPost", () => {
    queryClient.invalidateQueries("posts");
  });

  return useMutation(addPostData);
};

// queryClient.invalidateQueries("posts");

// export const useAddDataPost = () => {
//   const queryClient = useQueryClient();

//   const addPostData = async ({ name }: { name: string }) => {
//     const response = await axios.post("/api/user/datainsert", { name });

//     // If the mutation is successful, emit the post data to the Socket.IO server
//     if (response.status === 200) {
//       socket.emit("newPost", { name });
//     }

//     return response;
//   };

//   return useMutation(addPostData, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("posts");
//     },
//   });
// };

// export const useUpdatePostData = () => {
//   const queryClient = useQueryClient();

//   const updatePostData = async ({
//     name,
//     postId,
//   }: {
//     name: string;
//     postId: string;
//   }) => {
//     return await axios.put(`/api/user/dataupdate/${postId}`, { name });
//   };

//   return useMutation(updatePostData, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("posts");
//     },
//   });
// };

export const useUpdatePostData = () => {
  const queryClient = useQueryClient();

  const updatePostData = async ({
    name,
    postId,
  }: {
    name: string;
    postId: string;
  }) => {
    try {
      // const response = await axios.put(`/api/user/dataupdate/${postId}`, {
      //   name,
      // });

      const response = await axios.put(
        `https://react-practice-zeta-rust.vercel.app/api/user/dataupdate/${postId}`,
        {
          name,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update post data");
      }

      socket.emit("newPost", response.data);

      // Invalidate the "posts" query
      queryClient.invalidateQueries("posts");

      return response; // Return the entire AxiosResponse
    } catch (error) {
      console.error("Error updating post data:", error);
      toast.error("Failed to update post data");
      throw error;
    }
  };

  socket.on("broadcastNewPost", () => {
    queryClient.invalidateQueries("posts");
  });

  return useMutation(updatePostData);
};

export default useData;
