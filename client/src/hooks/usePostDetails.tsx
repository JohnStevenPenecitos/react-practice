import axios from "axios";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "react-query";
import { io } from "socket.io-client";
// import { useAuthContext } from "../components/Auth";

// interface dataItem {
//   _id: string;
//   name: string;
//   post_id: string;
// }

// interface MyError {
//   message: string;
// }

// const fetchPostData = async (
//   context: QueryFunctionContext<QueryKey, [string]>
// ) => {
//   const postId = context.queryKey[1];
//   return axios.get(`/api/user/${postId}`).then((response) => response.data);
// };

// interface UsePostDetailsOptions {
//   onSuccess?: (data: dataItem | dataItem[]) => void; // Allow for both single item and array
//   onError?: (error: MyError) => void;
// }

// const usePostDetails = (
//   postId: string,
//   options?: UseQueryOptions<dataItem | dataItem[], MyError> &
//     UsePostDetailsOptions
// ) => {
//   const { onSuccess, onError, ...queryOptions } = options || {};

//   return useQuery<dataItem | dataItem[], MyError>(
//     ["posts", postId],
//     fetchPostData,
//     {
//       ...queryOptions,
//       onSuccess: (data) => {
//         if (onSuccess) {
//           onSuccess(data);
//         }
//       },
//       onError: (error) => {
//         if (onError) {
//           onError(error);
//         }
//       },
//     }
//   );
// };

export interface DataItem {
  _id: string;
  name: string;
  likes: string;
  postedBy?: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
  profilePhoto?: string;
}

export interface CommentItem {
  _id: string;
  content: string;
  createdAt: string;
  commentBy?: {
    firstName: string;
    lastName: string;
    profilePhoto: string;
  };
  comments?: Comment[];
  profilePhoto?: string;
}

export interface Comment {
  _id: string;
  text: string;
  created: string;
  replyBy?: {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  };
  comments: {
    text: string;
    created: Date;
    replyBy?: {
      firstName: string;
      lastName: string;
      profilePhoto?: string;
    };
  }[];
}

interface UseAddDataPostOptions {
  userId: number | null;
}

interface MyError {
  message: string;
}

// const { authUser } = useAuthContext();

// const userAuthId = authUser?._id;

const socket = io("http://localhost:3000");

const fetchPostData = async (postId: string) => {
  return axios.get(`/api/user/${postId}`).then((response) => response.data);
};

const fetchCommentData = async (post_id: string) => {
  return axios
    .get(`/api/user/comment/${post_id}`)
    .then((response) => response.data);
};

interface UsePostDetailsOptions {
  onSuccess?: (data: { postData: DataItem }) => void;
  onError?: (error: MyError) => void;
}

interface UseCommentDetailsOptions {
  onSuccess?: (data: { commentsData: CommentItem[] }) => void;
  onError?: (error: MyError) => void;
}

//Post
// const usePostDetails = (
//   postId: string,
//   options?: UseQueryOptions<{ postData: DataItem }, MyError> &
//     UsePostDetailsOptions
// ) => {
//   const { onSuccess, onError } = options || {};

//   return useQuery(
//     ["posts", postId],
//     async () => {
//       const postData = await fetchPostData(postId);
//       return { postData };
//     },
//     {
//       refetchInterval: false,
//       onSuccess: (data) => {
//         if (onSuccess) {
//           onSuccess(data);
//         }
//       },
//       onError: (error: MyError) => {
//         if (onError) {
//           onError(error);
//         }
//       },
//       refetchOnWindowFocus: false,
//     }
//   );
// };

const usePostDetails = (
  postId: string,
  options?: UseQueryOptions<{ postData: DataItem }, MyError> &
    UsePostDetailsOptions
) => {
  const { onSuccess, onError } = options || {};

  const queryClient = useQueryClient();

  // Move the invalidation inside the useQuery callback
  return useQuery(
    ["posts", postId],
    async () => {
      const postData = await fetchPostData(postId);

      // Invalidate queries here
      queryClient.invalidateQueries("posts");

      return { postData };
    },
    {
      refetchInterval: false,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error: MyError) => {
        if (onError) {
          onError(error);
        }
      },
      refetchOnWindowFocus: false,
    }
  );
};

//Comment
// Adjust the return type of useCommentDetails to include commentsData
// export const useCommentDetails = (
//   postId: string,
//   options?: UseQueryOptions<{ commentsData: CommentItem[] }, MyError> &
//     UseCommentDetailsOptions
// ) => {
//   const { onSuccess, onError } = options || {};

//   return useQuery(
//     ["comments", postId],
//     async () => {
//       const commentsData = await fetchCommentData(postId);
//       return { commentsData };
//     },
//     {
//       // ...queryOptions,
//       refetchInterval: false,
//       onSuccess: (data) => {
//         if (onSuccess) {
//           onSuccess(data);
//         }
//       },
//       onError: (error: MyError) => {
//         if (onError) {
//           onError(error);
//         }
//       },
//     }
//   );
// };

// Adjust the return type of useCommentDetails to include commentsData as an array
export const useCommentDetails = (
  postId: string,
  options?: UseQueryOptions<{ commentsData: CommentItem[] }, MyError> &
    UseCommentDetailsOptions
) => {
  const { onSuccess, onError } = options || {};

  return useQuery(
    ["comments", postId],
    async () => {
      const commentsData = await fetchCommentData(postId);
      return { commentsData };
    },
    {
      refetchInterval: false,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error: MyError) => {
        if (onError) {
          onError(error);
        }
      },
    }
  );
};

// export const useAddDataComment = ({ userId }: UseAddDataPostOptions) => {
//   const queryClient = useQueryClient();

//   const addCommentData = async ({
//     content,
//     post_id,
//   }: {
//     content: string;
//     post_id: string;
//   }) => {
//     return await axios.post("/api/user/insert-comment", { content, post_id });
//   };

//   return useMutation(addCommentData, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("comments");
//     },
//   });
// };

export const useAddDataComment = ({ userId }: UseAddDataPostOptions) => {
  const queryClient = useQueryClient();

  const addCommentData = async ({
    content,
    post_id,
  }: {
    content: string;
    post_id: string;
  }) => {
    try {
      if (userId !== null) {
        const response = await axios.post("/api/user/insert-comment", {
          content,
          post_id,
          userId,
        });

        socket.emit("newComment", response.data);

        // queryClient.invalidateQueries("comments");
        // queryClient.invalidateQueries("posts");

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

  socket.on("broadcastComment", () => {
    queryClient.invalidateQueries("comments");
    queryClient.invalidateQueries("posts");
  });

  const { mutate } = useMutation(addCommentData);

  return { mutate };
};

export default usePostDetails;
