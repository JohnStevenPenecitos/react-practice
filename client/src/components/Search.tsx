import axios from "axios";
import { useEffect, useState } from "react";

import searchImage from "/images/jelly-character-chooses-one-of-the-suggested-options.png";
import noUserFound from "/images/jelly-character-is-searching-for-a-document.png";

import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { User, useSendInitialMessage } from "../hooks/useSendMessages";
import { useAuthContext } from "./Auth";

interface SearchProps {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}
function Search({ setShowSearch }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const { authUser } = useAuthContext();

  const userAuthId = authUser?._id;

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      if (!query) {
        setSearchResult([]);
        return;
      }
      const response = await axios.post(
        `/api/user/search-user?firstName=${query}`
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error("Error searching for users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleUserClick = (user: User) => {
    if (!selectedUsers.some((u: User) => u._id === user._id)) {
      setSelectedUsers((prevUsers: User[]) => [...prevUsers, user]);
      setSearchQuery(`${user.firstName} ${user.lastName}`);
    }
  };

  useEffect(() => {
    const receiverIds = selectedUsers.map((user) => user._id);
    console.log("Receiver IDs:", receiverIds);
  }, [selectedUsers]);

  const handleRemoveUser = (userToRemove: User) => {
    setSelectedUsers((prevUsers: User[]) =>
      prevUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  const { mutate: sendInitial } = useSendInitialMessage({
    senderId: authUser ? authUser._id : null,
  });

  const handleSendInitialMessage = async (
    values: { message: string; receiverIds: string[] },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{ message: string; receiverIds: string[] }>
  ) => {
    try {
      const { message } = values;
      const receiverIds = selectedUsers.map((user) => user._id);

      await sendInitial({ message, receiverIds });

      setShowSearch(false);

      resetForm();

      console.log("fasdfadsfdfdfd", receiverIds);

      // Handle success, e.g., show a success message
      console.log("Messages submitted successfully!");
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error submitting messages:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // const userIds = selectedUsers.map((user) => user._id);

  return (
    <>
      <div className=" border-b-2 border-gray-400 flex justify-center items-center ">
        <div
          className={`flex gap-2 justify-center items-center p-3 ${
            selectedUsers.length > 0 ? "bg-blue-200" : ""
          }`}
        >
          <span>To:</span>
          <input
            type="text"
            className="bg-transparent outline-none"
            placeholder="Enter first name to search"
            // value={searchQuery}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col  p-5 gap-2">
        {isLoading && (
          <div className="flex flex-col justify-center items-center">
            <div className="border-gray-400 h-6 w-6 animate-spin rounded-full border-4 border-t-white"></div>
          </div>
        )}
        {searchResult.length > 0 ? (
          searchResult.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-2 hover:bg-gray-400 p-2 rounded-lg cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              {user?.profilePhoto && <Image src={user?.profilePhoto} />}
              <div className="flex">{`${user.firstName} ${user.lastName}`}</div>
            </div>
          ))
        ) : !isLoading && searchQuery ? (
          <div className="flex flex-col justify-center items-center">
            <img src={noUserFound} className="h-36" alt="" />
            <span className="font-bold -mt-5">No user found</span>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <img src={searchImage} className="h-36" alt="" />
            <span className="font-bold -mt-5">Search user using firstname</span>
          </div>
        )}
      </div>

      {selectedUsers.length > 0 && (
        <div>
          <div className="p-3 border-y-2 border-gray-400 flex gap-2">
            <div className="flex justify-center items-center text-center">
              <span>Send to:</span>
            </div>
            <ul className="flex flex-row gap-2 flex-wrap">
              {selectedUsers.map((user, index) => (
                <li
                  className="bg-blue-300 p-[5px] rounded-lg flex gap-2 justify-center items-center"
                  key={index}
                >
                  {`${user.firstName} ${user.lastName}`}
                  <FontAwesomeIcon
                    className="hover:bg-gray-400 rounded-full cursor-pointer text-gray-800 text-lg flex justify-center items-center p-[5px]"
                    icon={faXmark}
                    onClick={() => handleRemoveUser(user)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {selectedUsers.length > 0 && (
        <Formik
          initialValues={{
            message: "",
            receiverIds: selectedUsers.map((user) => user._id),
          }}
          onSubmit={handleSendInitialMessage}
        >
          <Form>
            <div className="p-3">
              <Field
                type="text"
                id="message"
                name="message"
                className="bg-gray-200 outline-none w-full rounded-full p-1 pl-3"
                placeholder="Write your message"
              />
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
}

export default Search;
