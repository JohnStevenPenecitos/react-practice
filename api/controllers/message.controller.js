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

// const markMessageAsSeen = async (req, res) => {
//   try {
//     const messageId = req.params.id;
//     const senderId = req.body.senderId;

//     const newMessageSeen = {
//       seenBy: senderId,
//       created: new Date(),
//     };

//     const message = await MessageModel.findByIdAndUpdate(
//       messageId,
//       {
//         $push: { seenMessage: newMessageSeen },
//       },
//       { new: true }
//     );

//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }

//     res.json({ message: "Message marked as seen" });
//   } catch (error) {
//     console.error("Error marking message as seen:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const markMessageAsSeen = async (req, res) => {
  try {
    const messageId = req.params.id;
    const receiverId = req.body.receiverId;

    // Check if the senderId already exists in the seenMessage array
    const message = await MessageModel.findOneAndUpdate(
      {
        _id: messageId,
        "seenMessage.seenBy": { $ne: receiverId }, // Ensure senderId doesn't exist in seenBy array
      },
      {
        $addToSet: {
          seenMessage: {
            seenBy: receiverId,
            created: new Date(),
          },
        },
      },
      { new: true }
    );

    // if (!message) {
    //   return res.status(404).json({ message: "Message not found" });
    // }

    res.json({ message: "Message marked as seen" });
  } catch (error) {
    console.error("Error marking message as seen:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const markMessageAsSeen = async (req, res) => {
//   try {
//     const messageId = req.params.id;
//     const senderId = req.body.senderId;

//     const message = await MessageModel.findOneAndUpdate(
//       { _id: messageId, "seenMessage.seenBy": { $ne: senderId } },
//       { $addToSet: { seenMessage: { seenBy: senderId, created: new Date() } } },
//       { new: true }
//     );

//     if (!message) {
//       console.error("Message not found with ID:", messageId);
//       return res.status(404).json({ message: "Message not found" });
//     }

//     if (message) {
//       console.log("Message already seen with ID:", messageId);
//       return res.status(200).json({ message: "Message already seen" });
//     }

//     console.log("Message marked as seen with ID:", messageId);
//     res.json({ message: "Message marked as seen" });
//   } catch (error) {
//     console.error("Error marking message as seen:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports = {
  initialSendMessageTo,
  sendMessageTo,
  markMessageAsSeen,
};
