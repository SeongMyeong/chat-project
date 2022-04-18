const userRouter = require("express").Router();
const userController = require("./user.controller");

/**
 * @swagger
 *  /api/user/get-chat-room:
 *    get:
 *      summary: "유저 채팅방 리스트 조회"
 *      description: "해당 사용자의 채팅방 리스트를 조회한다"
 *      tags: [Users]
 *      consumes:
 *      - application/json
 *      parameters:
 *      - in: param
 *        name: user_id
 *        required: true
 *        description: 유저 아이디
 *        schema:
 *          type: string
 *          example: wsadqeqe
 *      responses:
 *        "200":
 *          description: 사용자 채팅방 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  result:
 *                    type: string
 *                    example: "0000"
 *                  reason:
 *                    type: string
 *                    example: "success"
 *                  data:
 *                    type: object
 *                    example:
 *                      {
 *                        "ROOM_DATA": [
 *                            {
 *                                "ROOM_ID": "010101",
 *                                "ROOM_NAME": "테스트방입니다",
 *                                "USER_ID": "wsadqeqe",
 *                                "INSERT_DATE": "2022-04-14T09:23:59.000Z"
 *                            }
 *                        ]
 *                      }
 */
userRouter.get("/get-chatroom-list", userController.getChatRoomList);

module.exports = userRouter;
