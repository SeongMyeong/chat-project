const userRouter = require("express").Router();
const userController = require("./user.controller");

/**
 * @swagger
 *  /api/user/get-user-list:
 *    get:
 *      summary: "자신을 제외한 유저정보 조회"
 *      description: "현재 사용자들 중 자신을 제외한 유저정보를 조회한다"
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
 *          description: 사용자 리스트 조회
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
 *                        "USER_DATA": [
 *                            {
 *                                "USER_ID": "seo",
 *                                 "USER_NAME": "김서연"
 *                            }
 *                         ]
 *                      }
 */
userRouter.get("/get-user-list", userController.getUserList);

/**
 * @swagger
 *  /api/user/get-chatroom-list:
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

/**
 * @swagger
 *  /api/user/make-chat-room:
 *    put:
 *      summary: "유저의 채팅방 생성"
 *      description: "해당 사용자가 채팅방을 생성한다"
 *      tags: [Users]
 *      consumes:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: room_id
 *        required: true
 *        description: 채팅방 룸 아이디
 *        schema:
 *          type: string
 *          example: 010123
 *      - in: body
 *        name: user_id
 *        required: true
 *        description: 유저 아이디
 *        schema:
 *          type: string
 *          example: wsadqeqe
 *      - in: body
 *        name: room_name
 *        required: true
 *        description: 채팅방 이름
 *        schema:
 *          type: string
 *          example: 테스트 채팅방
 *      responses:
 *        "200":
 *          description: 사용자 채팅방 생성
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
 *                    example: "채팅방 생성이 완료되었습니다"
 *                  data:
 *                    type: object
 *                    example:
 *                      {}
 */
userRouter.put("/make-chat-room", userController.makeChatRoomList);

/**
 * @swagger
 *  /api/user/enter-chat-room:
 *    put:
 *      summary: "유저의 채팅방 입장"
 *      description: "해당 사용자가 채팅방에 입장한다"
 *      tags: [Users]
 *      consumes:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: room_id
 *        required: true
 *        description: 채팅방 룸 아이디
 *        schema:
 *          type: string
 *          example: 010123
 *      - in: body
 *        name: user_id
 *        required: true
 *        description: 유저 아이디
 *        schema:
 *          type: string
 *          example: wsadqeqe
 *      responses:
 *        "200":
 *          description: 사용자 채팅방 입장
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
 *                    example: "채팅방에 입장하였습니다"
 *                  data:
 *                    type: object
 *                    example:
 *                      {}
 */
userRouter.put("/enter-chat-room", userController.enterChatRoom);

module.exports = userRouter;
