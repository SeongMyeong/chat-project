import { asyncWrapper } from '../../util'
import service from '../../service/chat'

const getChat = async (req, res) => {
  //return res.json({ success: true, data: '' })
  const { code, success, data } = await service.getChatMessages({
    ...req.query,
    ...req.params,
  })
  // console.log('code, success, data ', code, success, data)
  return res.status(code).json({ success, data })
}

module.exports = {
  getChat,
}
