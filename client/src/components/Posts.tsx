import { Link } from "react-router-dom";
import Modal from "./Modal";
import Button from "./Button";
import { useState } from "react";
import useData from "../hooks/useData";

const Posts = () => {
  const [alertVisible, setAlertVisibility] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  const [updatedName, setUpdatedName] = useState("");

  const handleEditClick = (name: string) => {
    setSelectedName(name);
    setUpdatedName(name);
    setAlertVisibility(true);
  };

  const handleUpdateName = () => {
    setSelectedName(updatedName);
    setAlertVisibility(false);
  };

  const { isLoading, data, isError, error, isFetching } = useData({
    onSuccess: () => {
      // console.log("Custom Success", data);
    },
    onError: () => {
      // console.log("Custom Error", error);
    },
  });

  if (isLoading || isFetching) {
    return (
      <div className="max-w-sm mx-auto p-5">
        <div className="animate-pulse bg-gray-300 h-12 mb-2 rounded"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="max-w-sm mx-auto p-5">{error?.message}</div>;
  }

  return (
    <>
      <div className="max-w-sm mx-auto">
        {alertVisible && (
          <Modal title="update" onClose={() => setAlertVisibility(false)}>
            <h1>{selectedName}</h1>
            <div className="bg-gray-200 flex items-center justify-center h-12">
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>

            <div className="flex justify-end p-2">
              <Button color="blue" onClick={handleUpdateName}>
                Update
              </Button>
            </div>
          </Modal>
        )}

        <div className="p-5">
          {data &&
            data.map((item) => (
              <div
                key={item.post_id}
                className="bg-red-200 border-2 border-blue-400 p-2 rounded-lg mb-3 flex justify-between"
              >
                <Link to={`/app/about/${item.post_id}`}>{item.name}</Link>{" "}
                <Button color="red" onClick={() => handleEditClick(item.name)}>
                  Edit
                </Button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Posts;
