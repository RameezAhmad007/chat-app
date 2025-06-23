const User = require("../models/user.model");
const Message = require("../models/message.model");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");

const getAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser }
    }).select("-password");
    if (filteredUsers.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: filteredUsers });
  } catch (error) {
    console.error("Error in getAllUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    });

    res
      .status(200)
      .json({ message: "Messages fetched successfully", data: messages });
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  getMessages,
  sendMessage
};
