const ConversationModel = require("../model/ConversationModel.js");
const MessageModel = require("../model/MessageModel.js");

// const getAllConversations = async (req, res, next) => {
//   try {
//     // Fetch all conversations
//     const conversations = await ConversationModel.find();

//     // Extract participant ObjectId references from each conversation
//     const participants = conversations.map((conversation) => ({
//       _id: conversation._id,
//       participants: conversation.participants.map((participant) =>
//         participant.toString()
//       ),
//     }));

//     res.status(200).json({
//       message: "Conversations retrieved successfully!",
//       conversations: participants,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllConversations = async (req, res, next) => {
//   try {
//     // Fetch all conversations
//     const conversations = await ConversationModel.find();

//     // Extract participant ObjectId references from each conversation
//     const participants = conversations.map((conversation) => ({
//       _id: conversation._id,
//       participants: conversation.participants.map((participant) =>
//         participant.toString()
//       ),
//     }));

//     // Fetch messages and extract receiver IDs
//     const receiverIds = await MessageModel.distinct("receiverId", {
//       conversationId: { $in: conversations.map((conv) => conv._id) },
//     });

//     // Combine conversation data with receiver IDs
//     const conversationsWithReceiverIds = participants.map((conv) => ({
//       ...conv,
//       receiverIds: receiverIds.filter((id) => conv.participants.includes(id)),
//     }));

//     res.status(200).json({
//       message: "Conversations retrieved successfully!",
//       conversations: conversationsWithReceiverIds,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllConversations = async (req, res, next) => {
//   try {
//     // Fetch all conversations with messages populated
//     const conversations = await ConversationModel.find().populate("messages");

//     // Extract participant ObjectId references from each conversation
//     const participants = conversations.map((conversation) => ({
//       _id: conversation._id,
//       participants: conversation.participants.map((participant) =>
//         participant.toString()
//       ),
//       messages: conversation.messages, // Include populated messages
//     }));

//     res.status(200).json({
//       message: "Conversations retrieved successfully!",
//       conversations: participants,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getAllConversations = async (req, res, next) => {
  try {
    // Fetch all conversations with messages populated
    const conversations = await ConversationModel.find()
      .populate({
        path: "participants",
        select: "firstName lastName profilePhoto", // Select the fields you need
      })
      .populate("messages");

    // Extract participant details from each conversation
    const participants = conversations.map((conversation) => ({
      _id: conversation._id,
      participants: conversation.participants.map((participant) => ({
        _id: participant._id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        profilePhoto: participant.profilePhoto,
      })),
      messages: conversation.messages, // Include populated messages
    }));

    res.status(200).json({
      message: "Conversations retrieved successfully!",
      conversations: participants,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllConversations };
