import axios from "axios";
import {
  useQuery,
  UseQueryOptions,
  QueryFunctionContext,
  QueryKey,
} from "react-query";

interface dataItem {
  _id: string;
  name: string;
  post_id: string;
}

interface MyError {
  message: string;
}

const fetchPostData = async (
  context: QueryFunctionContext<QueryKey, [string]>
) => {
  const postId = context.queryKey[1];
  return axios.get(`/api/user/${postId}`).then((response) => response.data);
};

interface UsePostDetailsOptions {
  onSuccess?: (data: dataItem | dataItem[]) => void; // Allow for both single item and array
  onError?: (error: MyError) => void;
}

const usePostDetails = (
  postId: string,
  options?: UseQueryOptions<dataItem | dataItem[], MyError> &
    UsePostDetailsOptions
) => {
  const { onSuccess, onError, ...queryOptions } = options || {};

  return useQuery<dataItem | dataItem[], MyError>(
    ["posts", postId],
    fetchPostData,
    {
      ...queryOptions,
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        if (onError) {
          onError(error);
        }
      },
    }
  );
};

export default usePostDetails;
