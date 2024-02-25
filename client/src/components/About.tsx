import axios from "axios";
import { useState } from "react";
import TitlePage from "./TitlePage";
import useData from "../hooks/useData";

const About: React.FC = () => {
  const [name, setName] = useState<string>("");
  // const [data, setData] = useState<dataItem[]>([]);

  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   fetchData();
  // }, []); // Effect runs once when the component mounts

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   axios
  //     .post("/api/user/datainsert", { name })
  //     .then((result) => {
  //       console.log(result);
  //       // After successful insertion, fetch updated data
  //       // fetchData();
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get<dataItem[]>("/api/user/dataget");
  //     setData(response.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // const fetchData = async () => D{
  //   const response = await axios.get<dataItem[]>("/api/user/dataget");
  //   return response.data;
  // };

  // const onSuccess = (data: dataItem[]) => {
  //   console.log("Success", data);
  // };

  // const onError = (error: MyError) => {
  //   console.log("Error", error);
  // };

  // const fetchData = async () => {
  //   return axios.get("/api/user/dataget").then((response) => response.data);
  // };

  // const { isLoading, data, isError, error, isFetching, refetch } = useQuery<
  //   dataItem[],
  //   MyError
  // >("posts", fetchData, {
  //   onSuccess,
  //   onError,
  //   select: (data: dataItem[]) => {
  //     return data || [];
  //   },
  // });

  const { isLoading, data, isError, error, isFetching, refetch } = useData({
    onSuccess: () => {
      // console.log("Custom Success", data);
    },
    onError: () => {
      // console.log("Custom Error", error);
    },
  });

  // console.log({ isLoading, isFetching });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post("/api/user/datainsert", { name });
    // fetchData();
  };

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  const handleFetchClick = () => {
    refetch();
  };
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // if (status === "error") {
  //   return <div>Error loading data</div>;
  // }

  return (
    <>
      <TitlePage title="About Page" />
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium text-gray-900 ">
          Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(a) => setName(a.target.value)}
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder=""
          required
        />
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        <button onClick={handleFetchClick}>Fetch </button>

        <div className="p-5">
          {data &&
            data.map((item) => (
              <div
                key={item._id}
                className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg mb-3"
              >
                {item.name}
              </div>
            ))}

          {/* {data &&
            data.map((item) => <div key={item._id}>{item.propertyName}</div>)} */}

          {/* {data.map((name, index) => (
            <div key={index}>{name}</div>
          ))} */}
        </div>
      </form>
    </>
  );
};

export default About;
