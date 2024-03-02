import axios from "axios";
import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
  useMutation,
} from "react-query";

interface dataItem {
  _id: string;
  name: string;
  post_id: string;
}

interface MyError {
  message: string;
}

const fetchData = async () => {
  // return axios.get("/api/user/dataget").then((response) => response.data);
  return axios.get("https://react-practice-zeta-rust.vercel.app/api/user/dataget").then((response) => response.data);
};

const useData = (
  options?: UseQueryOptions<dataItem[], MyError>,
  OnSuccess?: (data: dataItem[]) => void,
  OnError?: (error: MyError) => void
) => {
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

  return useQuery<dataItem[], MyError>("posts", fetchData, {
    onSuccess,
    onError,
    // select: (data: dataItem[]) => {
    //   return data || [];
    // },
    ...options,
  });
};

export const useAddDataPost = () => {
  const queryClient = useQueryClient();

  const addPostData = async ({ name }: { name: string }) => {
    // return await axios.post("/api/user/datainsert", { name });

    return await axios.post("https://react-practice-zeta-rust.vercel.app/api/user/datainsert", { name });
  };

  return useMutation(addPostData, {
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
    },
  });
};

// export const useAddDataComment = () => {
//   const queryClient = useQueryClient();

//   const addCommentData = async ({ content }: { content: string }) => {
//     return await axios.post("/api/user/insert-comment", { content });
//   };

//   return useMutation(addCommentData, {
//     onSuccess: () => {
//       // queryClient.invalidateQueries("posts");
//     },
//   });
// };


export default useData;
