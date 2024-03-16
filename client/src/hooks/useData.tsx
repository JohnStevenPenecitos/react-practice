import axios from "axios";
import toast from "react-hot-toast";
import {
  // useQuery,
  // UseQueryOptions,
  useQueryClient,
  useMutation,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  InfiniteData,
} from "react-query";
import { io } from "socket.io-client";

export interface dataItem {
  _id: string;
  name: string;
  post_id: string;
  createdAt: string;
  likes?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
  }[];
  comments: string;
  postedBy?: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
  profilePhoto?: string;
}

interface MyError {
  message: string;
}
interface UseAddDataPostOptions {
  userId: number | null;
}

const socket = io("http://localhost:3000");

// const socket = io("https://react-practice-zeta-rust.vercel.app");

// const fetchData = async () => {
//   try {
//     const response = await axios.get("/api/user/dataget");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

const fetchData = async ({ pageParam = 1 }) => {
  try {
    const response = await axios.get(
      `/api/user/dataget?page=${pageParam}&limit=5`
    );
    return response.data;
  } catch (error) {
    // handle error
    throw error;
  }
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

//   const queryOptions: UseQueryOptions<dataItem[], MyError> = {
//     onSuccess,
//     onError,
//     ...options,
//   };

//   return useQuery<dataItem[], MyError>("posts", fetchData, queryOptions);
// };

// const fetchData = async ({ pageParam = 1 }) => {
//   const response = await axios.get(
//     `/api/user/dataget?page=${pageParam}&limit=5`
//   );
//   const data = response.data;
//   return { ...data, prevOffset: pageParam };
// };

// const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
//   queryKey: ["users"],
//   queryFn: getUsers,
//   getNextPageParam: (lastPage) => {
//     if (lastPage.prevOffset + 10 > lastPage.articleCount) {
//       return false;
//     }
//     return lastPage.prevOffset + 10;
//   },
// });

const useData = (
  options?: UseInfiniteQueryOptions<dataItem[], MyError>,
  onSuccess?: (data: InfiniteData<dataItem[]>) => void,
  onError?: (error: MyError) => void
) => {
  const queryOptions: UseInfiniteQueryOptions<dataItem[], MyError> = {
    ...options,
    getNextPageParam: (lastPage, allPages) => {
      console.log("All Pages:", allPages);

      // if (!lastPage || lastPage.length === 0) {
      //   return undefined;
      // }

      // // Calculate the next page number based on the length of allPages
      // const nextPageNumber = allPages.length + 1;

      // return nextPageNumber;

      if (!lastPage || lastPage.length === 0) {
        return undefined;
      }
    
      // If the last page fetched has less than 5 entries, there's no more data to fetch
      if (lastPage.length < 5) {
        return undefined;
      }

      const nextPageNumber = allPages.length + 1;
    
      // Otherwise, return the next page number
      return nextPageNumber;
    },

    onSuccess,
    onError,
  };

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage } =
    useInfiniteQuery<dataItem[], MyError>("posts", fetchData, queryOptions);

  const hasNextPageBoolean: boolean = hasNextPage || false;

  return {
    data,
    isLoading,
    isError,
    error,
    hasNextPage: hasNextPageBoolean,
    fetchNextPage,
  };
};

// const useData = (
//   options?: UseInfiniteQueryOptions<dataItem[], MyError>,
//   onSuccess?: (data: InfiniteData<dataItem[]>) => void,
//   onError?: (error: MyError) => void
// ) => {
//   const queryOptions: UseInfiniteQueryOptions<dataItem[], MyError> = {
//     ...options,
//     getNextPageParam: (lastPage) => {
//       if (!lastPage || lastPage.length === 0) {
//         return undefined;
//       }
//       const nextPageNumber = lastPage.length + 1;

//       return nextPageNumber;
//     },

//     onSuccess,
//     onError,
//   };

//   const { data, isLoading, isError, error, hasNextPage, fetchNextPage } =
//     useInfiniteQuery<dataItem[], MyError>("posts", fetchData, queryOptions);

//   const hasNextPageBoolean: boolean = hasNextPage || false;

//   return {
//     data,
//     isLoading,
//     isError,
//     error,
//     hasNextPage: hasNextPageBoolean,
//     fetchNextPage,
//   };
// };

// queryClient.invalidateQueries("posts");

// const invalidateQueryOnSocketEvent = () => {
//   queryClient.invalidateQueries("posts");
// };

// socket.on("dataChanged", invalidateQueryOnSocketEvent);

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

// export const useAddDataPost = () => {
//   const queryClient = useQueryClient();

//   const addPostData = async ({ name }: { name: string }) => {
//     try {
//       const response = await axios.post("/api/user/datainsert", { name });

//       socket.emit("newPost", response.data);

//       queryClient.invalidateQueries("posts");

//       return response.data;
//     } catch (error) {
//       console.error("Error while adding post:", error);
//       throw error;
//     }
//   };

//   socket.on("broadcastNewPost", () => {
//     queryClient.invalidateQueries("posts");
//   });

//   return useMutation(addPostData);
// };

export const useAddDataPost = ({ userId }: UseAddDataPostOptions) => {
  const queryClient = useQueryClient();

  const addPostData = async ({ name }: { name: string }) => {
    try {
      if (userId !== null) {
        const response = await axios.post("/api/user/datainsert", {
          name,
          userId,
        });

        socket.emit("newPost", response.data);

        queryClient.invalidateQueries("posts");

        console.log(userId);

        return response.data;
      } else {
        console.error("No authenticated user found");
        throw new Error("No authenticated user found");
      }
    } catch (error) {
      console.error("Error while adding post:", error);
      throw error;
    }
  };

  socket.on("broadcastNewPost", () => {
    queryClient.invalidateQueries("posts");
  });

  const { mutate } = useMutation(addPostData);

  return { mutate };
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
      const response = await axios.put(`/api/user/dataupdate/${postId}`, {
        name,
      });

      // const response = await axios.put(
      //   `https://react-practice-zeta-rust.vercel.app/api/user/dataupdate/${postId}`,
      //   {
      //     name,
      //   }
      // );

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

  // socket.on("broadcastNewPost", () => {
  //   queryClient.invalidateQueries("posts");
  // });

  return useMutation(updatePostData);
};

export default useData;
