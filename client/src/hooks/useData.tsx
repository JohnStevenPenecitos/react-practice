import axios from "axios";
import { useQuery, UseQueryOptions } from "react-query";

interface dataItem {
  _id: string;
  name: string;
}

interface MyError {
  message: string;
}

const fetchData = async () => {
  return axios.get("/api/user/dataget").then((response) => response.data);
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
    select: (data: dataItem[]) => {
      return data || [];
    },
    ...options,
  });
};

export default useData;
