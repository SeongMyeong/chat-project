import express from 'express'
const router = express.Router()
const controller = require('./roomController')
const { Auth } = require('../../middleware/auth')

router.post('/createChatRoom', controller.createRoom)
router.get('/getAllChatRoomList', controller.getAllChatRoomList)
router.post('/getJoinChatRoomList', controller.getJoinChatRoomList)
router.post('/joinChatRoom', controller.joinChatRoom)
router.post('/leaveChatRoom', controller.leaveChatRoom)
router.get('/getReadIndexChatRoom', controller.getReadIndexChatRoom)
router.post('/setReadIndexChatRoom', controller.setReadIndexChatRoom)

router.get('/deleteRedisKey', controller.deleteRedisKey)
module.exports = router
