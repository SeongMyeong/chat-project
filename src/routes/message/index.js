const messageRouter = require("express").Router();
const messageController = require("./message.controller");

messageRouter.get("/get-messages", messageController.getMessageFromRoom);

module.exports = messageRouter;
