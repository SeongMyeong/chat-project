import express from 'express'
const router = express.Router()
const controller = require('./terraController')

router.get('/circulatingSupply', controller.circulatingSupply)
router.get('/totalSupply', controller.totalSupply)

module.exports = router
