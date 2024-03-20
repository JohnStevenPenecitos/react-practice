const MessageModel = require("../model/MessageModel.js");
const ConversationModel = require("../model/ConversationModel.js");
const mongoose = require("mongoose");

// const initialSendMessageTo = async (req, res, next) => {
//   const { message, receiverIds, senderId } = req.body;
//   try {
//     const savedMessages = [];
//     for (const id of receiverIds) {
//       const newMessage = new MessageModel({
//         message,
//         receiverId: mongoose.Types.ObjectId.createFromHexString(id),
//         senderId,
//       });
//       const savedMessage = await newMessage.save();
//       savedMessages.push(savedMessage);
//     }

//     res.status(201).json({
//       message: "Messages created successfully!",
//       messages: savedMessages,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const initialSendMessageTo = async (req, res, next) => {
  const { message, receiverIds, senderId } = req.body;
  try {
    const conversationParticipants = [senderId, ...receiverIds];

    // Check if a conversation already exists for these participants
    let conversation = await ConversationModel.findOne({
      participants: {
        $all: conversationParticipants.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        ),
      },
    });

    if (!conversation) {
      // Create a new conversation if one doesn't exist
      conversation = await ConversationModel.create({
        participants: conversationParticipants.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        ),
        messages: [],
      });
    }

    // Create and save messages for each receiver in the conversation
    const savedMessages = [];
    for (const id of receiverIds) {
      const newMessage = new MessageModel({
        message,
        senderId,
        receiverId: mongoose.Types.ObjectId.createFromHexString(id),
      });
      const savedMessage = await newMessage.save();

      // Add the message to the conversation
      conversation.messages.push(savedMessage._id);
      await conversation.save();

      savedMessages.push(savedMessage);
    }

    res.status(201).json({
      message: "Messages created successfully!",
      messages: savedMessages,
      conversationId: conversation._id,
    });
  } catch (error) {
    next(error);
  }
};

const sendMessageTo = async (req, res, next) => {
  const { message, receiverIds, senderId } = req.body;
  try {
    const conversationParticipants = [senderId, ...receiverIds];

    // Check if a conversation already exists for these participants
    let conversation = await ConversationModel.findOne({
      participants: {
        $all: conversationParticipants.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        ),
      },
    });

    if (!conversation) {
      // Create a new conversation if one doesn't exist
      conversation = await ConversationModel.create({
        participants: conversationParticipants.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        ),
        messages: [],
      });
    }

    // Create and save messages for each receiver in the conversation
    const savedMessages = [];
    for (const id of receiverIds) {
      const newMessage = new MessageModel({
        message,
        senderId,
        receiverId: mongoose.Types.ObjectId.createFromHexString(id),
      });
      const savedMessage = await newMessage.save();

      // Add the message to the conversation
      conversation.messages.push(savedMessage._id);
      await conversation.save();

      savedMessages.push(savedMessage);
    }

    res.status(201).json({
      message: "Messages created successfully!",
      messages: savedMessages,
      conversationId: conversation._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initialSendMessageTo,
  sendMessageTo,
};
