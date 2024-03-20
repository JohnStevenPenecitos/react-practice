import axios from "axios";
import {
  //   useQuery,
  //   UseQueryOptions,
  //   useQueryClient,
  useMutation,
  useQueryClient,
} from "react-query";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

interface UseAddDataPostOptions {
  senderId: number | null;
}

export const useSendInitialMessage = ({ senderId }: UseAddDataPostOptions) => {
  const queryClient = useQueryClient();
  const addInitialMessage = async ({
    message,
    receiverIds,
  }: {
    message: string;
    receiverIds: string[];
  }) => {
    try {
      if (senderId !== null) {
        const response = await axios.post("/api/user/send-initial-message", {
          message,
          receiverIds,
          senderId,
        });

        console.log(receiverIds);

        socket.emit("initialMessage", response.data);

        queryClient.invalidateQueries("conversations");

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

  socket.on("broadcastInitialMessage", () => {
    queryClient.invalidateQueries("conversations");
  });

  const { mutate } = useMutation(addInitialMessage);

  return { mutate };
};

export const useSendMessage = ({ senderId }: UseAddDataPostOptions) => {
  const queryClient = useQueryClient();
  const addMessage = async ({
    message,
    receiverIds,
  }: {
    message: string;
    receiverIds: string[];
  }) => {
    try {
      if (senderId !== null) {
        const response = await axios.post("/api/user/send-message", {
          message,
          receiverIds,
          senderId,
        });

        socket.emit("newMessage", response.data);

        console.log(receiverIds);

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

  socket.on("broadcastMessage", () => {
    queryClient.invalidateQueries("conversations");
  });

  const { mutate } = useMutation(addMessage);

  return { mutate };
};
