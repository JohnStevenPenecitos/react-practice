import axios from "axios";
import { useQuery, UseQueryOptions } from "react-query";

// export interface ConversationItem {
//   _id: string;
//   participants?: Participant[];
//   messages?: Message[];
// }

export interface ConversationItem {
  _id: string;
  participants?: Participant[];
  messages?: Message[];
  createdAt: string;

}

// Interface for participant data
export interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  createdAt: string;
}

// Interface for message data
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

interface MyError {
  message: string;
}

interface UseConversationDetailsOptions {
  onSuccess?: (data: { conversationData: ConversationItem[] }) => void;
  onError?: (error: MyError) => void;
}

export const fetchConversationData = async (): Promise<ConversationItem[]> => {
  try {
    const response = await axios.post<{ conversations: ConversationItem[] }>(
      "/api/user/conversations"
    );
    return response.data.conversations.map((conversation) => ({
      ...conversation,
      receiverIds: conversation.participants || [],
    }));
  } catch (error) {
    throw error;
  }
};

export const useConversationDetails = (
  options?: UseQueryOptions<ConversationItem[], MyError> &
    UseConversationDetailsOptions
) => {
  const { onSuccess, onError } = options || {};

  return useQuery(
    ["conversations"],
    async () => {
      const conversationData = await fetchConversationData();
      return conversationData;
    },
    {
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess({ conversationData: data });
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

export const getParticipantInfo = (
  participants: Participant[] | undefined,
  participantId: string
): string => {
  if (!participants) return "";

  const participant = participants.find(
    (participant) => participant._id === participantId
  );
  if (!participant) return "";

  return `${participant.firstName} ${participant.lastName}`;
};
