const express = require("express");
const { protectRoute } = require("../middlewares/auth.middleware");
const {
  getAllUsers,
  getMessages,
  sendMessage
} = require("../controllers/message.controller");

const router = express.Router();

router.get("/users", protectRoute, getAllUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

module.exports = router;
