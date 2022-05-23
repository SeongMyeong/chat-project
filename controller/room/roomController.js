import service from '../../service/room'

const createRoom = async (req, res) => {
  // return res.json()
  const { code, success, data } = await service.createRoom({
    ...req.body,
  })
  //console.log('[createRoom] code ,success, data', code, success, data)
  return res.status(code).json({ success, data })
}

const leaveChatRoom = async (req, res) => {
  const { code, success } = await service.leaveChatRoom({
    ...req.body,
  })
  return res.status(code).json({ success })
}

const joinChatRoom = async (req, res) => {
  const { code, data, success } = await service.joinChatRoom({
    ...req.body,
  })
  return res.status(code).json({ success, result: data })
}

const getAllChatRoomList = async (req, res) => {
  const { code, data, success } = await service.roomList({
    ...req.body,
  })
  return res.status(code).json({ success, result: data })
}

const getJoinChatRoomList = async (req, res) => {
  const { code, data, success } = await service.joinRoomList({
    ...req.body,
  })
  return res.status(code).json({ success, result: data })
}

const setReadIndexChatRoom = async (req, res) => {
  const { code, data, success } = await service.setReadIndexChatRoom({
    ...req.body,
  })
  return res.status(code).json({ success, result: data })
}

const getReadIndexChatRoom = async (req, res) => {
  const { code, data, success } = await service.getReadIndexChatRoom({
    ...req.body,
  })
  return res.status(code).json({ success, result: data })
}

const deleteRedisKey = async (req, res) => {
  const { code, data, success } = await service.handleDeleteRedisKey({
    ...req.body,
  })
  return res.status(code).json({ success, result: data })
}

module.exports = {
  createRoom,
  leaveChatRoom,
  joinChatRoom,
  getAllChatRoomList,
  getJoinChatRoomList,
  setReadIndexChatRoom,
  getReadIndexChatRoom,
  deleteRedisKey,
}
