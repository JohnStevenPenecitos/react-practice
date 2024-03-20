import React, { useEffect, useRef, useState } from "react";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faCaretLeft,
  faCaretRight,
  faCircleArrowLeft,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import girlImage from "/images/jelly-no-messages-1.png";
import Search from "./Search";
import {
  ConversationItem,
  useConversationDetails,
} from "../hooks/useGetConversations";
import { useAuthContext } from "./Auth";
import { motion } from "framer-motion";
import { Field, FieldArray, Form, Formik, FormikHelpers } from "formik";
import { useSendMessage } from "../hooks/useSendMessages";
import { formatDistanceToNow } from "date-fns";
import { useSocketContext } from "./SocketContext";
import { faFaceSmile, faImages } from "@fortawesome/free-regular-svg-icons";
import EmojiPicker from "./EmojiPicker";

function Chat() {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [selectedMessage, setSelectedMessage] =
    useState<ConversationItem | null>(null);

  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmojiSelect = (
    emoji: string | { native: string }, // Define the type of emoji
    values: { message: string }, // Define the type of values
    setFieldValue: (field: string, value: any) => void // Define the type of setFieldValue
  ) => {
    console.log("Selected Emoji:", emoji);
    const emojiValue = typeof emoji === "string" ? emoji : emoji.native;
    console.log("Emoji Value:", emojiValue);
    if (emojiValue !== undefined) {
      const newMessage = values.message + emojiValue;
      console.log("New Message:", newMessage);
      setFieldValue("message", newMessage);
    } else {
      console.error("Emoji value is undefined:", emoji);
    }
  };

  const { authUser } = useAuthContext();

  const userAuthIdPost: string = authUser?._id?.toString() || "";

  const { onlineUsers } = useSocketContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  });

  const [showSearch, setShowSearch] = useState(false);

  const toggleContentVisibility = () => {
    setIsContentVisible((prev) => !prev);
  };

  const { mutate: sendMessage } = useSendMessage({
    senderId: authUser ? authUser._id : null,
  });

  const handleSendMessage = async (
    values: { message: string; receiverIds: string[] },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{ message: string; receiverIds: string[] }>
  ) => {
    try {
      const { message, receiverIds } = values;

      await sendMessage({ message, receiverIds });

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

  const handleMessageClick = (conversation: ConversationItem) => {
    setSelectedMessage(conversation);
    setIsContentVisible(true);
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    // setIsContentVisible(false);
  };

  const { data = [], isLoading, isError, error } = useConversationDetails();

  console.log("convo message user", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      {data.length === 0 ||
      !data.some((conversation) =>
        conversation.participants?.find((p) => p._id === userAuthIdPost)
      ) ? (
        <div className="w-[20rem]">
          <div className="flex justify-end">
            <FontAwesomeIcon
              className="hover:bg-gray-400 mt-1 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
              icon={faPenToSquare}
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
          {!showSearch ? (
            <div className="  flex justify-center items-center flex-col min-h-[80vh]">
              <img src={girlImage} className="h-56" alt="" />
              <span className="font-bold -mt-10">
                You do not have any messages
              </span>
            </div>
          ) : (
            <div className=" overflow-hidden bg-blue-200 rounded-lg">
              <div className="max-h-[80vh] overflow-auto">
                <Search setShowSearch={setShowSearch} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          className={`w-[${isContentVisible ? "20rem" : "5rem"}]`}
          initial={{ width: "5rem", opacity: 0 }}
          animate={{ width: isContentVisible ? "20rem" : "5rem", opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0, 0.3, 0.3, 1.01],
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
        >
          <div>
            <div className="mb-1">
              {!selectedMessage && (
                <motion.div
                  className={`flex w-full ${
                    isContentVisible ? "justify-between" : "justify-center"
                  } items-center`}
                >
                  {!showSearch && (
                    <FontAwesomeIcon
                      className="hover:bg-gray-400  rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
                      icon={isContentVisible ? faCaretLeft : faCaretRight}
                      onClick={toggleContentVisibility}
                    />
                  )}
                  {showSearch && (
                    <FontAwesomeIcon
                      className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
                      icon={faCircleArrowLeft}
                      onClick={() => setShowSearch(!showSearch)}
                    />
                  )}

                  {isContentVisible && (
                    <div className="flex justify-end w-full items-center">
                      <FontAwesomeIcon
                        className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
                        icon={faPenToSquare}
                        onClick={() => setShowSearch(!showSearch)}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            {!showSearch ? (
              data.map((conversation: ConversationItem) => {
                const isParticipant = conversation.participants?.find(
                  (p) => p._id === userAuthIdPost
                );

                const participantIds: (string | undefined)[] =
                  conversation.participants?.map((p) => p._id) || [];

                const participantStatus: { id: string; isOnline: boolean }[] =
                  participantIds.map((id) => ({
                    id: id || "",
                    isOnline:
                      typeof id === "string"
                        ? onlineUsers.some((user) => user._id === id)
                        : false,
                  }));

                console.log(
                  "Participant online status in conversation",
                  conversation._id,
                  ":",
                  participantStatus
                );

                const authenticatedUserStatus = participantStatus.find(
                  (participant) => participant.id !== userAuthIdPost
                );

                if (isParticipant) {
                  return (
                    <div key={conversation._id}>
                      {selectedMessage &&
                      selectedMessage._id === conversation._id ? (
                        <div className=" gap-2 flex flex-col">
                          <div className="flex justify-start">
                            <FontAwesomeIcon
                              className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
                              icon={faArrowCircleLeft}
                              onClick={handleBackToList}
                            />
                          </div>
                          <div className=" rounded-lg overflow-hidden">
                            <div className="bg-gray-700 flex p-2 text-white font-bold">
                              {conversation.participants && (
                                <div className="flex flex-row-reverse justify-center items-center gap-2">
                                  <div className="gap-1 flex">
                                    <span>
                                      {
                                        conversation.participants.find(
                                          (p) => p._id !== userAuthIdPost
                                        )?.firstName
                                      }
                                    </span>
                                    <span>
                                      {
                                        conversation.participants.find(
                                          (p) => p._id !== userAuthIdPost
                                        )?.lastName
                                      }
                                    </span>
                                  </div>
                                  <div className="flex flex-row justify-end items-end ">
                                    <Image
                                      src={
                                        conversation.participants.find(
                                          (p) => p._id !== userAuthIdPost
                                        )?.profilePhoto || ""
                                      }
                                    />
                                    <div className="absolute flex">
                                      {authenticatedUserStatus && (
                                        <span
                                          className={`h-3 w-3 rounded-full ${
                                            authenticatedUserStatus.isOnline
                                              ? "bg-green-500"
                                              : "bg-gray-400"
                                          }`}
                                        ></span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className=" overflow-auto max-h-[59vh]">
                              <div className="min-h-[59vh] bg-amber-200 flex flex-col justify-end p-2">
                                {conversation.messages &&
                                  conversation.messages.map((message) => {
                                    const isSender =
                                      message.senderId === userAuthIdPost;
                                    const isReceiver =
                                      message.receiverId === userAuthIdPost;
                                    if (isSender || isReceiver) {
                                      return (
                                        <div key={message._id} className="p-1">
                                          <motion.div
                                            className={
                                              isSender
                                                ? "flex justify-end items-end "
                                                : "flex justify-start items-start"
                                            }
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                              duration: 0.5,
                                            }}
                                          >
                                            <div className="flex flex-row-reverse justify-center items-center gap-1 ">
                                              <div className="flex flex-col">
                                                <div
                                                  className={
                                                    "bg-white p-3 flex justify-center items-center  " +
                                                    (message.message.length > 20
                                                      ? "w-48 rounded-3xl"
                                                      : "rounded-full")
                                                  }
                                                >
                                                  {message.message}
                                                  {/* <div className="relative">
                                                    {!isSender &&
                                                    conversation.participants ? (
                                                      <span className="text-xs flex bg-red-200 absolute bottom-0"></span>
                                                    ) : (
                                                      <span className="text-xs flex bg-blue-200 justify-end absolute bottom-0"></span>
                                                    )}
                                                  </div> */}
                                                </div>
                                              </div>

                                              {!isSender &&
                                              conversation.participants ? (
                                                <Image
                                                  key={`receiver_${message._id}`}
                                                  src={
                                                    conversation.participants.find(
                                                      (p) =>
                                                        p._id ===
                                                        message.senderId
                                                    )?.profilePhoto || ""
                                                  }
                                                />
                                              ) : null}
                                            </div>
                                          </motion.div>
                                        </div>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                                <div ref={messagesEndRef}></div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-700 flex justify-center items-center gap-1 p-3">
                              <FontAwesomeIcon
                                className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-xl bg-gray-200"
                                icon={faImages}
                              />

                              {/* {showEmojis && (
                                <div>
                                  <Picker onSelect={addEmoji} />
                                </div>
                              )} */}
                              <FontAwesomeIcon
                                className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-xl bg-gray-200"
                                icon={faFaceSmile}
                                onClick={() => setShowEmoji(!showEmoji)} // Toggle the state variable on click
                              />

                              <Formik
                                initialValues={{
                                  message: "",
                                  receiverIds: conversation.participants
                                    ? conversation.participants
                                        .filter(
                                          (participant) =>
                                            participant._id !== userAuthIdPost
                                        )
                                        .map((participant) => participant._id)
                                    : [],
                                }}
                                onSubmit={handleSendMessage}
                              >
                                {({ values, setFieldValue }) => (
                                  <Form>
                                    <div>
                                      <Field
                                        id="message"
                                        name="message"
                                        className="bg-gray-200 outline-none w-full rounded-full p-1 pl-3"
                                        placeholder="Write your message"
                                        onClick={() => setShowEmoji(false)}
                                      />
                                    </div>
                                    {showEmoji && (
                                      <div className="absolute top-[27%] right-14">
                                        <EmojiPicker
                                          onEmojiSelect={(emoji) =>
                                            handleEmojiSelect(
                                              emoji,
                                              values,
                                              setFieldValue
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                  </Form>
                                )}
                              </Formik>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="">
                          <div
                            className=" bg-blue-200 p-2 rounded-xl   hover:bg-gray-200 cursor-pointer mb-2"
                            onClick={() => handleMessageClick(conversation)}
                            style={{
                              display: selectedMessage ? "none" : "flex",
                            }}
                          >
                            {conversation.messages &&
                            conversation.messages.length ? (
                              <div
                                key={
                                  conversation.messages[
                                    conversation.messages.length - 1
                                  ]?._id
                                }
                                className={`flex justify-center items-center gap-2  ${
                                  isContentVisible ? "mx-0" : "mx-auto"
                                }`}
                              >
                                {conversation.messages &&
                                  conversation.messages.length > 0 &&
                                  conversation.messages[
                                    conversation.messages.length - 1
                                  ]?.senderId && (
                                    <div className="flex flex-row justify-end items-end w-12">
                                      <Image
                                        key={`sender_${
                                          conversation.messages[
                                            conversation.messages.length - 1
                                          ]._id
                                        }`}
                                        src={
                                          conversation.participants &&
                                          conversation.participants.length >
                                            0 &&
                                          userAuthIdPost &&
                                          conversation.messages &&
                                          conversation.messages.length > 0 &&
                                          conversation.messages[
                                            conversation.messages.length - 1
                                          ]?.senderId
                                            ? conversation.participants.find(
                                                (p) =>
                                                  p._id ===
                                                  (conversation.messages &&
                                                  conversation.messages.length >
                                                    0 &&
                                                  userAuthIdPost ===
                                                    conversation.messages[
                                                      conversation.messages
                                                        .length - 1
                                                    ]?.senderId
                                                    ? conversation.messages[
                                                        conversation.messages
                                                          .length - 1
                                                      ]?.receiverId
                                                    : conversation.messages &&
                                                      conversation.messages
                                                        .length > 0 &&
                                                      conversation.messages[
                                                        conversation.messages
                                                          .length - 1
                                                      ]?.senderId)
                                              )?.profilePhoto || ""
                                            : ""
                                        }
                                      />
                                      <div className="absolute flex">
                                        {authenticatedUserStatus && (
                                          <span
                                            className={`h-3 w-3 rounded-full ${
                                              authenticatedUserStatus.isOnline
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                            }`}
                                          ></span>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {isContentVisible &&
                                  conversation.messages[
                                    conversation.messages.length - 1
                                  ] && (
                                    <div className="">
                                      <div
                                        className="flex flex-col"
                                        key={
                                          conversation.messages[
                                            conversation.messages.length - 1
                                          ]._id
                                        }
                                      >
                                        {conversation.participants &&
                                        conversation.participants.length > 0 &&
                                        userAuthIdPost &&
                                        conversation.messages &&
                                        conversation.messages.length > 0 &&
                                        conversation.messages[
                                          conversation.messages.length - 1
                                        ]?.senderId ? (
                                          <span className="font-bold">
                                            {(() => {
                                              const senderId =
                                                conversation.messages[
                                                  conversation.messages.length -
                                                    1
                                                ]?.senderId;
                                              const messageReceiver =
                                                conversation.participants.find(
                                                  (p) =>
                                                    p._id ===
                                                    (userAuthIdPost ===
                                                      senderId &&
                                                    conversation.messages
                                                      ? conversation.messages[
                                                          conversation.messages
                                                            .length - 1
                                                        ]?.receiverId
                                                      : senderId)
                                                );

                                              return (
                                                <>
                                                  {`${messageReceiver?.firstName} ${messageReceiver?.lastName}`}
                                                </>
                                              );
                                            })()}
                                          </span>
                                        ) : (
                                          ""
                                        )}

                                        <span className="w-60">
                                          {conversation.messages.length > 0 &&
                                          conversation.messages[
                                            conversation.messages.length - 1
                                          ].senderId === userAuthIdPost ? (
                                            <div className=" flex gap-1">
                                              You:
                                              <div className="truncate">
                                                {
                                                  conversation.messages[
                                                    conversation.messages
                                                      .length - 1
                                                  ].message
                                                }
                                              </div>
                                              <div className="flex justify-center items-center text-center">
                                                <span className="text-xl -mt-1">
                                                  ·
                                                </span>
                                              </div>
                                              <span className="">
                                                {(() => {
                                                  const timeDifference =
                                                    formatDistanceToNow(
                                                      new Date(
                                                        conversation.messages[
                                                          conversation.messages
                                                            .length - 1
                                                        ].createdAt
                                                      ),
                                                      {
                                                        addSuffix: false,
                                                        includeSeconds: true,
                                                      }
                                                    );
                                                  let formattedTime =
                                                    timeDifference;
                                                  if (
                                                    timeDifference.includes(
                                                      "about"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /about/i,
                                                        ""
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than 5 second"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than 5 second/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than 10 second"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than 10 second/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than 20 second"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than 20 second/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "half a minute"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /half a minute/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than a minute"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than a minute/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "minute"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /(\d) minute/,
                                                        "$1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "hour"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /(\d) hour/,
                                                        "$1h"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "day"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /(\d) day/,
                                                        "$1d"
                                                      );
                                                  }
                                                  return formattedTime.replace(
                                                    /s$/,
                                                    ""
                                                  );
                                                })()}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex gap-1">
                                              <div className="truncate">
                                                {
                                                  conversation.messages[
                                                    conversation.messages
                                                      .length - 1
                                                  ].message
                                                }
                                              </div>
                                              <div className="flex justify-center items-center text-center">
                                                <span className="text-xl -mt-1">
                                                  ·
                                                </span>
                                              </div>
                                              <span className="">
                                                {(() => {
                                                  const timeDifference =
                                                    formatDistanceToNow(
                                                      new Date(
                                                        conversation.messages[
                                                          conversation.messages
                                                            .length - 1
                                                        ].createdAt
                                                      ),
                                                      {
                                                        addSuffix: false,
                                                        includeSeconds: true,
                                                      }
                                                    );
                                                  let formattedTime =
                                                    timeDifference;
                                                  if (
                                                    timeDifference.includes(
                                                      "about"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /about/i,
                                                        ""
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than 5 second"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than 5 second/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than 10 second"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than 10 second/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than 20 second"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than 20 second/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "half a minute"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /half a minute/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "less than a minute"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /less than a minute/i,
                                                        "1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "minute"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /(\d) minute/,
                                                        "$1m"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "hour"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /(\d) hour/,
                                                        "$1h"
                                                      );
                                                  }
                                                  if (
                                                    timeDifference.includes(
                                                      "day"
                                                    )
                                                  ) {
                                                    formattedTime =
                                                      formattedTime.replace(
                                                        /(\d) day/,
                                                        "$1d"
                                                      );
                                                  }
                                                  return formattedTime.replace(
                                                    /s$/,
                                                    ""
                                                  );
                                                })()}
                                              </span>
                                            </div>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return null;
                }
              })
            ) : (
              <div className=" overflow-hidden bg-blue-200 rounded-lg">
                <div className="max-h-[80vh] overflow-auto">
                  <Search setShowSearch={setShowSearch} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Chat;
