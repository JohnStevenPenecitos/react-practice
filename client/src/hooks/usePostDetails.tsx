import axios from "axios";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "react-query";

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

interface DataItem {
  _id: string;
  name: string;
  post_id: string;
}

export interface CommentItem {
  _id: string;
  content: string;
  post_id: string;
  comment_id: string;
}

interface MyError {
  message: string;
}

const fetchPostData = async (postId: string) => {
  return axios.get(`/api/user/${postId}`).then((response) => response.data);
  // return axios.get(`https://react-practice-zeta-rust.vercel.app/api/user/${postId}`).then((response) => response.data);

};

const fetchCommentData = async (post_id: string) => {
  return axios
    .get(`/api/user/comment/${post_id}`)
    // .get(`https://react-practice-zeta-rust.vercel.app/api/user/comment/${post_id}`)

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
const usePostDetails = (
  postId: string,
  options?: UseQueryOptions<{ postData: DataItem }, MyError> &
    UsePostDetailsOptions
) => {
  const { onSuccess, onError } = options || {};

  return useQuery(
    ["posts", postId],
    async () => {
      const postData = await fetchPostData(postId);
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
      refetchOnWindowFocus: false, // Add this line to fix the type error
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

export const useAddDataComment = () => {
  const queryClient = useQueryClient();

  const addCommentData = async ({
    content,
    post_id,
  }: {
    content: string;
    post_id: string;
  }) => {
    return await axios.post("/api/user/insert-comment", { content, post_id });
    // return await axios.post("https://react-practice-zeta-rust.vercel.app/api/user/insert-comment", { content, post_id });

  };

  return useMutation(addCommentData, {
    onSuccess: () => {
      queryClient.invalidateQueries("comments");
    },
  });
};

export default usePostDetails;
