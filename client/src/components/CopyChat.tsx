import { useEffect, useRef, useState } from "react";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
import { useAuthContext } from "../authentication/Auth";
import { motion } from "framer-motion";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useSendMessage } from "../hooks/useSendMessages";
import { formatDistanceToNow } from "date-fns";
import { useSocketContext } from "../authentication/SocketContext";
import { faFaceSmile, faImages } from "@fortawesome/free-regular-svg-icons";
import EmojiPicker from "./EmojiPicker";
import axios from "axios";
// import { io } from "socket.io-client";
import { useQueryClient } from "react-query";
import { socket } from "../hooks/useData";
import noChatSelected from "/images/jelly-character-distributes-tasks-on-a-kanban-board.png";

function CopyChat() {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [selectedMessage, setSelectedMessage] =
    useState<ConversationItem | null>(null);

  // const socket = io("http://localhost:3000");

  const queryClient = useQueryClient();

  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmojiSelect = (
    emoji: string | { native: string }, // Define the type of emoji
    values: { message: string }, // Define the type of values
    setFieldValue: (field: string, value: any) => void // Define the type of setFieldValue
  ) => {
    // console.log("Selected Emoji:", emoji);
    const emojiValue = typeof emoji === "string" ? emoji : emoji.native;
    console.log("Emoji Value:", emojiValue);
    if (emojiValue !== undefined) {
      const newMessage = values.message + emojiValue;
      // console.log("New Message:", newMessage);
      setFieldValue("message", newMessage);
    } else {
      // console.error("Emoji value is undefined:", emoji);
    }
  };

  const { authUser } = useAuthContext();

  const userAuthIdPost: string = authUser?._id?.toString() || "";

  const { onlineUsers } = useSocketContext();

  //   const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  //   const scrollToBottom = () => {
  //     if (messagesEndRef.current) {
  //       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //     }
  //   };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  //   useEffect(() => {
  //     scrollToBottom();
  //   }, [conversation]);

  //   const messagesContainerRef = useRef<HTMLDivElement>(null); // Specify the type here

  //   const scrollToBottom = () => {
  //     messagesContainerRef.current?.scrollTo({
  //       top: messagesContainerRef.current.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   };

  //   useEffect(() => {
  //     scrollToBottom();
  //   }, [conversation]);

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

      // Call handleMessageClick with the selected conversation
      //   if (selectedConversation !== undefined) {
      //     console.log("handleMessageClick is called with:", selectedConversation);
      //     handleMessages(selectedConversation);
      //   }

      resetForm();
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error submitting messages:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleMessageClick = (conversation: ConversationItem) => {
  //   setSelectedMessage(conversation);
  //   setIsContentVisible(true);
  // };

  const markMessageAsSeen = async (messageId: string, receiverId: string) => {
    try {
      // const queryClient = useQueryClient();

      // Make a request to mark the message as seen by the authenticated user
      await axios.put(`/api/user/message-seen/${messageId}`, { receiverId });

      console.log("message", messageId);

      socket.emit("seenMessage");

      socket.on("broadcastSeenMessage", () => {
        queryClient.invalidateQueries("conversations");
      });

      console.log("Message marked as seen by receiver:", receiverId);
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  };

  const handleMessageClick = async (conversation: ConversationItem) => {
    setSelectedMessage(conversation);
    // setSelectedMessage(null);

    // setIsContentVisible(true);

    // Call markMessageAsSeen for each message in the conversation
    if (conversation.messages && conversation.messages.length > 0) {
      for (const message of conversation.messages) {
        // Check if the receiverId of the message is equal to userAuthId
        if (message.receiverId === userAuthIdPost) {
          try {
            markMessageAsSeen(message._id, message.receiverId);
          } catch (error) {
            console.error("Error marking message as seen:", error);
          }
        }
      }
    }
  };

  // const handleMessages = async (conversation: ConversationItem) => {
  //   // Call markMessageAsSeen for each message in the conversation
  //   if (conversation.messages && conversation.messages.length > 0) {
  //     for (const message of conversation.messages) {
  //       // Check if the receiverId of the message is equal to userAuthId
  //       if (message.receiverId === userAuthIdPost) {
  //         try {
  //           markMessageAsSeen(message._id, message.receiverId);
  //         } catch (error) {
  //           console.error("Error marking message as seen:", error);
  //         }
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (conversation) {
  //     if (
  //       selectedMessage &&
  //       conversation.messages &&
  //       conversation.messages.length > 0
  //     ) {
  //       for (const message of conversation.messages) {
  //         console.log("Message:", message);
  //         console.log(
  //           "ReceiverId:",
  //           message.receiverId,
  //           "UserAuthId:",
  //           userAuthIdPost
  //         );
  //         if (message.receiverId === userAuthIdPost) {
  //           console.log("Marking message as seen:", message._id);
  //           try {
  //             markMessageAsSeen(message._id, message.receiverId);
  //             console.log("Message marked as seen successfully:", message._id);
  //           } catch (error) {
  //             console.error("Error marking message as seen:", error);
  //           }
  //         }
  //       }
  //     } else {
  //       console.log("Conversation has no messages.");
  //     }
  //     console.log("Show Selected Message:", conversation.messages);
  //   } else {
  //     console.log("Conversation is null or undefined.");
  //   }
  // }, [conversation, selectedMessage, userAuthIdPost]);

  // const handleBackToList = () => {
  //   setSelectedMessage(null);
  //   // setIsContentVisible(false);
  // };

  // const getAllMessageIds = (conversation: ConversationItem): string[] => {
  //   const allMessageIds: string[] = [];

  //   if (!conversation.messages || conversation.messages.length === 0) {
  //     return allMessageIds; // No messages in the conversation
  //   }

  //   conversation.messages.forEach((message) => {
  //     allMessageIds.push(message._id);
  //   });

  //   return allMessageIds;
  // };

  // const getMessagesWithSeenMessage = (
  //   conversation: ConversationItem
  // ): Message[] => {
  //   if (!conversation.messages || conversation.messages.length === 0) {
  //     return []; // No messages in the conversation
  //   }

  //   // Filter messages that have a non-empty value in seenMessage
  //   const messagesWithSeenMessage = conversation.messages.filter(
  //     (message) => message.seenMessage && message.seenMessage.length > 0
  //   );

  //   return messagesWithSeenMessage;
  // };

  // const getEmptySeenMessagesCount = (
  //   conversation: ConversationItem
  // ): number => {
  //   if (!conversation.messages || conversation.messages.length === 0) {
  //     return 0; // No messages in the conversation
  //   }

  //   // Filter messages that have an empty value in seenMessage and receiverId is not equal to userAuthId
  //   const emptySeenMessagesCount = conversation.messages.filter(
  //     (message) =>
  //       message.seenMessage &&
  //       message.seenMessage.length > 0 &&
  //       message.receiverId !== userAuthIdPost
  //   ).length;

  //   return emptySeenMessagesCount;
  // };

  const getEmptySeenMessagesCount = (
    conversation: ConversationItem
  ): number => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 0; // No messages in the conversation
    }

    // Filter messages that have an empty value in seenMessage and log if receiverId is equal to userAuthIdPost
    const emptySeenMessagesCount = conversation.messages.filter((message) => {
      if (
        message.seenMessage &&
        !message.seenMessage.length &&
        message.receiverId === userAuthIdPost
      ) {
        console.log(
          "ReceiverId is equal to UserAuthIdPost:",
          message.receiverId === userAuthIdPost
        );
        return true; // Include the message in the filtered result
      }
      return false; // Exclude the message from the filtered result
    }).length;

    return emptySeenMessagesCount;
  };

  const { data = [], isLoading, isError, error } = useConversationDetails();

  // console.log("convo message user", data);

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
        <div className="w-[20rem] ">
          <div className="flex justify-end">
            <FontAwesomeIcon
              className="hover:bg-gray-400 mt-1 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
              icon={faPenToSquare}
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
          {!showSearch ? (
            <div className="  flex justify-center items-center flex-col min-h-[70vh] ">
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
        <div className="flex gap-5  p-1 ">
          <motion.div
            className={`w-[${isContentVisible ? "35rem" : "5rem"}]`}
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className=" overflow-hidden rounded-lg p-1">
              <div className="mb-2">
                {!selectedMessage && (
                  <motion.div
                    className={`flex w-full  ${
                      isContentVisible ? "justify-between" : "justify-center"
                    } items-center`}
                  >
                    {!showSearch && (
                      <FontAwesomeIcon
                        className="hover:bg-gray-400  rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200 hidden"
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
                      <div className="flex justify-end w-full items-center ">
                        <FontAwesomeIcon
                          className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
                          icon={faPenToSquare}
                          onClick={() => setShowSearch(!showSearch)}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {selectedMessage && (
                  <motion.div
                    className={`flex w-full  ${
                      isContentVisible ? "justify-between" : "justify-center"
                    } items-center`}
                  >
                    {showSearch && (
                      <FontAwesomeIcon
                        className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
                        icon={faCircleArrowLeft}
                        onClick={() => setShowSearch(!showSearch)}
                      />
                    )}

                    {isContentVisible && (
                      <div className="flex justify-end w-full items-center ">
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

              <div className="overflow-auto max-h-[70vh] relative  scrollbar-thin  scrollbar-thumb-purple-500 scrollbar-track-gray-300 scroll-smooth">
                {!showSearch ? (
                  data.map((conversation: ConversationItem) => {
                    const isParticipant = conversation.participants?.find(
                      (p) => p._id === userAuthIdPost
                    );

                    const participantIds: (string | undefined)[] =
                      conversation.participants?.map((p) => p._id) || [];

                    const participantStatus: {
                      id: string;
                      isOnline: boolean;
                    }[] = participantIds.map((id) => ({
                      id: id || "",
                      isOnline:
                        typeof id === "string"
                          ? onlineUsers.some((user) => user._id === id)
                          : false,
                    }));

                    const authenticatedUserStatus = participantStatus.find(
                      (participant) => participant.id !== userAuthIdPost
                    );

                    if (isParticipant) {
                      return (
                        <div key={conversation._id}>
                          <div className="">
                            {/* <div
                              className=" bg-blue-200 p-2 rounded-xl   hover:bg-gray-200 cursor-pointer mb-2 mx-1"
                              onClick={() => handleMessageClick(conversation)}
                            > */}
                            <div
                              className={`p-2 rounded-xl hover:bg-gray-200 cursor-pointer mb-2 mx-1 ${
                                selectedMessage &&
                                selectedMessage._id === conversation._id
                                  ? "bg-blue-400"
                                  : "bg-blue-200"
                              }`}
                              onClick={() => handleMessageClick(conversation)}
                            >
                              {conversation &&
                              conversation.messages &&
                              conversation.messages.length ? (
                                <div
                                  key={
                                    conversation.messages[
                                      conversation.messages.length - 1
                                    ]?._id
                                  }
                                  className={`flex  gap-2  ${
                                    isContentVisible ? "mx-0" : "mx-auto"
                                  }`}
                                >
                                  {conversation &&
                                    conversation.messages &&
                                    conversation.messages.length > 0 &&
                                    conversation.messages[
                                      conversation.messages.length - 1
                                    ]?.senderId && (
                                      <div className="flex flex-row justify-end items-end w-16">
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
                                                    conversation.messages
                                                      .length > 0 &&
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
                                          conversation.participants.length >
                                            0 &&
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
                                                    conversation.messages
                                                      .length - 1
                                                  ]?.senderId;
                                                const messageReceiver =
                                                  conversation.participants.find(
                                                    (p) =>
                                                      p._id ===
                                                      (userAuthIdPost ===
                                                        senderId &&
                                                      conversation.messages
                                                        ? conversation.messages[
                                                            conversation
                                                              .messages.length -
                                                              1
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

                                          <span className="w-72">
                                            {conversation &&
                                            conversation.messages &&
                                            conversation.messages.length > 0 &&
                                            conversation.messages[
                                              conversation.messages.length - 1
                                            ]?.senderId === userAuthIdPost ? (
                                              <div className=" flex justify-between">
                                                <div className="flex gap-1 truncate">
                                                  You:
                                                  <div
                                                    className={`truncate ${
                                                      conversation.messages[
                                                        conversation.messages
                                                          .length - 1
                                                      ].message.length < 15
                                                        ? ""
                                                        : "w-36"
                                                    }`}
                                                  >
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
                                                              conversation
                                                                .messages
                                                                .length - 1
                                                            ].createdAt
                                                          ),
                                                          {
                                                            addSuffix: false,
                                                            includeSeconds:
                                                              true,
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
                                                <div>
                                                  {conversation.messages &&
                                                  conversation.messages[
                                                    conversation.messages
                                                      .length - 1
                                                  ]?.senderId === userAuthIdPost
                                                    ? conversation.messages.map(
                                                        (message, index) => (
                                                          <div key={index}>
                                                            <div className="flex flex-col">
                                                              {index ===
                                                                (conversation
                                                                  .messages
                                                                  ?.length ??
                                                                  0) -
                                                                  1 &&
                                                                message &&
                                                                message.seenMessage &&
                                                                message
                                                                  .seenMessage
                                                                  .length >
                                                                  0 && (
                                                                  <div className="flex justify-end ">
                                                                    {message.seenMessage.map(
                                                                      (
                                                                        seenMessage,
                                                                        index
                                                                      ) =>
                                                                        seenMessage &&
                                                                        seenMessage.seenBy &&
                                                                        seenMessage
                                                                          .seenBy
                                                                          .profilePhoto ? (
                                                                          <img
                                                                            key={
                                                                              index
                                                                            }
                                                                            src={
                                                                              seenMessage
                                                                                .seenBy
                                                                                .profilePhoto
                                                                            }
                                                                            alt="Profile"
                                                                            className="w-5 h-5 rounded-full mt-1"
                                                                          />
                                                                        ) : null
                                                                    )}
                                                                  </div>
                                                                )}
                                                            </div>
                                                          </div>
                                                        )
                                                      )
                                                    : null}
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="flex gap-1">
                                                {/* <div className="truncate">
                                                {
                                                  conversation.messages[
                                                    conversation.messages
                                                      .length - 1
                                                  ].message
                                                }
                                              </div> */}

                                                {conversation.messages &&
                                                  conversation.messages
                                                    .length && (
                                                    <div
                                                      className={
                                                        getEmptySeenMessagesCount(
                                                          conversation
                                                        ) > 0
                                                          ? "truncate font-bold"
                                                          : "truncate"
                                                      }
                                                    >
                                                      <div
                                                        className={
                                                          conversation.messages[
                                                            conversation
                                                              .messages.length -
                                                              1
                                                          ].message.length < 15
                                                            ? ""
                                                            : "truncate w-32"
                                                        }
                                                      >
                                                        {
                                                          conversation.messages[
                                                            conversation
                                                              .messages.length -
                                                              1
                                                          ].message
                                                        }
                                                      </div>
                                                    </div>
                                                  )}

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
                                                            conversation
                                                              .messages.length -
                                                              1
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

                              <div className="flex bottom-10  relative justify-end">
                                {conversation.messages &&
                                  conversation.messages.length &&
                                  getEmptySeenMessagesCount(conversation) >
                                    0 && (
                                    <div className="text-sm bg-red-300 rounded-full h-7 w-7 flex justify-center items-center font-bold absolute ">
                                      {getEmptySeenMessagesCount(conversation)}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <div className=" overflow-hidden bg-blue-200 rounded-lg w-96">
                    <div className="max-h-[80vh] overflow-auto">
                      <Search setShowSearch={setShowSearch} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className=" justify-center items-center w-full">
            <div className="  min-h-[80vh] w-full flex flex-col justify-center items-center">
              {selectedMessage && data ? (
                <>
                  {data.map((conversation: ConversationItem) => {
                    const isParticipant = conversation.participants?.find(
                      (p) => p._id === userAuthIdPost
                    );

                    const participantIds: (string | undefined)[] =
                      conversation.participants?.map((p) => p._id) || [];

                    const participantStatus: {
                      id: string;
                      isOnline: boolean;
                    }[] = participantIds.map((id) => ({
                      id: id || "",
                      isOnline:
                        typeof id === "string"
                          ? onlineUsers.some((user) => user._id === id)
                          : false,
                    }));

                    const authenticatedUserStatus = participantStatus.find(
                      (participant) => participant.id !== userAuthIdPost
                    );

                    if (isParticipant) {
                      return (
                        <div key={conversation._id} className="w-full">
                          {selectedMessage &&
                          selectedMessage._id === conversation._id ? (
                            <div className="gap-2 flex flex-col w-full">
                              <div className="rounded-lg overflow-hidden w-full">
                                <div className="bg-gray-700 flex p-2 text-white font-bold w-full">
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
                                      <div className="flex flex-row justify-end items-end">
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

                                <div className="overflow-auto max-h-[57vh]  scrollbar-thin  scrollbar-thumb-gray-700 scrollbar-track-gray-300 scroll-smooth">
                                  <div className="bg-amber-200 flex flex-col justify-end p-2 min-h-[57vh] ">
                                    {conversation.messages &&
                                      conversation.messages.map((message) => {
                                        const isSender =
                                          message.senderId === userAuthIdPost;
                                        const isReceiver =
                                          message.receiverId === userAuthIdPost;

                                        if (isSender || isReceiver) {
                                          return (
                                            <div
                                              key={message._id}
                                              className="p-1"
                                            >
                                              <motion.div
                                                className={`flex ${
                                                  isSender
                                                    ? "justify-end"
                                                    : "justify-start"
                                                } items-${
                                                  isSender ? "end" : "start"
                                                }`}
                                                initial={{
                                                  opacity: 0,
                                                  y: 10,
                                                }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                              >
                                                <div className="flex flex-row-reverse justify-center items-center gap-1">
                                                  <div className="flex flex-col">
                                                    <div
                                                      className={`bg-white p-3 flex justify-center items-center ${
                                                        message.message.length >
                                                        20
                                                          ? "w-48 rounded-3xl"
                                                          : "rounded-full"
                                                      }`}
                                                    >
                                                      {message.message}
                                                    </div>

                                                    {message &&
                                                      message.seenMessage &&
                                                      conversation.messages &&
                                                      conversation.messages
                                                        .length > 0 &&
                                                      conversation.messages
                                                        .slice()
                                                        .reverse()
                                                        .find(
                                                          (msg) =>
                                                            msg.senderId ===
                                                            userAuthIdPost
                                                        ) === message && (
                                                        <div className="flex justify-end">
                                                          {message.seenMessage.map(
                                                            (seenUser, index) =>
                                                              seenUser.seenBy
                                                                ?.profilePhoto && (
                                                                <img
                                                                  key={index}
                                                                  src={
                                                                    seenUser
                                                                      .seenBy
                                                                      .profilePhoto
                                                                  }
                                                                  className="w-5 h-5 rounded-full mt-1"
                                                                />
                                                              )
                                                          )}
                                                        </div>
                                                      )}
                                                  </div>

                                                  {!isSender &&
                                                    conversation.participants && (
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
                                                    )}
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

                                <div className="bg-gray-700 flex items-center gap-1 p-3 ">
                                  <div className="flex gap-2">
                                    <FontAwesomeIcon
                                      className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-xl bg-gray-200"
                                      icon={faImages}
                                    />
                                  </div>
                                  <div className="w-full ">
                                    <Formik
                                      initialValues={{
                                        message: "",
                                        receiverIds: conversation.participants
                                          ? conversation.participants
                                              .filter(
                                                (participant) =>
                                                  participant._id !==
                                                  userAuthIdPost
                                              )
                                              .map(
                                                (participant) => participant._id
                                              )
                                          : [],
                                      }}
                                      onSubmit={handleSendMessage}
                                    >
                                      {({ values, setFieldValue }) => (
                                        <Form>
                                          <div className="w-full flex ">
                                            <Field
                                              id="message"
                                              name="message"
                                              className="bg-gray-300 outline-none rounded-full p-2 pl-3 w-full"
                                              placeholder="Write your message"
                                              onClick={() => {
                                                setShowEmoji(false);
                                                handleMessageClick(
                                                  conversation
                                                );
                                              }}
                                            />
                                            {showEmoji && (
                                              <div className="absolute top-[23%] right-10">
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
                                          </div>
                                        </Form>
                                      )}
                                    </Formik>
                                  </div>
                                  <FontAwesomeIcon
                                    className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-xl bg-gray-200"
                                    icon={faFaceSmile}
                                    onClick={() => setShowEmoji(!showEmoji)} // Toggle the state variable on click
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <img src={noChatSelected} className="h-72" alt="" />
                  <span className="font-bold -mt-5">No chat selected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CopyChat;
