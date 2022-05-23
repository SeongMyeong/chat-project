import express from 'express'
// import channelCotroller from './channel'

import userController from './user'
import chatController from './chat'
import roomController from './room'
import terraController from './terra'
const router = express.Router()

// router.use('/channel', channelCotroller)

router.use('/user', userController)
router.use('/chat', chatController)
router.use('/room', roomController)
router.use('/terra', terraController)
module.exports = router
