const express = require('express')
const router = express.Router()
const controller = require('./chat')
// const { Auth } = require('../../middleware/auth')

router.get('/getChatMessages', controller.getChat)

module.exports = router
