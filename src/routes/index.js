const router = require("express").Router();

const user = require("./user");
const message = require("./message");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 관련 API
 */
router.use("/user", user);

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: 채팅메시지 관련 API
 */
router.use("/message", message);

module.exports = router;
