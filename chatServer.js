import { config as dotenv } from 'dotenv'
import express from 'express'
import { createServer } from 'http'
// import createChatServer from 'socket.io'
import { addChatMessage } from './service/chat'
import {
  setReadIndexChatRoom,
  getReadIndexChatRoom,
  getIsInRoom,
} from './service/room'
import { SOCKET_EVENT } from './util/constant'
dotenv()

const server = createServer(express())
// const io = createChatServer(server, {
//   cors: { origin: process.env.FRONTEND_HOST, credentials: true },
// })

var io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

const namespace = io.of('/room')
// namespace.use((socket, next) => {
//   // TODO jwt 검증 로직 필요
//   next()
// })

namespace.on('connection', socket => {
  const { room_id } = socket.handshake.query

  // socket.join(room_id)
  socket.emit('connection', 'jell')
  // socket.join()
  namespace.on(SOCKET_EVENT.MESSAGE, () => {})

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })

  socket.on(SOCKET_EVENT.MESSAGE, async data => {
    console.log('message on! ')
    const { room_id, message, id, user_name } = data
    const { data: result } = await addChatMessage({
      room_id,
      message,
      id,
      user_name,
      date: new Date(new Date().getTime()),
    })

    await setReadIndexChatRoom({ room_id, id })
    const getIndexInfo = await getReadIndexChatRoom({ room_id, id })

    namespace.in(room_id).emit(SOCKET_EVENT.MESSAGE, {
      ...result,
      date: new Date(new Date().getTime()),
      current_cursor: getIndexInfo?.data,
    })
  })

  socket.on(SOCKET_EVENT.JOIN_ROOM, async data => {
    const { room_id, id, user_name } = data
    console.log('********************SOCKET_EVENT.JOIN_ROOM ', room_id)

    const { data: isIn } = await getIsInRoom(room_id, id)
    /*  방안에 없으면 메세지   */
    if (!isIn) {
      const { data: result } = await addChatMessage({
        room_id,
        message: `${user_name}님이 들어오셨습니다.`,
        id: 'information',
        user_name: 'information',
        date: new Date(new Date().getTime()),
      })

      await setReadIndexChatRoom({ room_id, id })
      const getIndexInfo = await getReadIndexChatRoom({ room_id, id })
      namespace.in(room_id).emit(SOCKET_EVENT.MESSAGE, {
        ...result,
        date: new Date(new Date().getTime()),
        current_cursor: getIndexInfo?.data,
      })
    }
    socket.join(room_id)
    namespace.in(room_id).emit(SOCKET_EVENT.JOIN_ROOM, {
      room_id,
    })
  })
  socket.on(SOCKET_EVENT.LEAVE_ROOM, async data => {
    console.log('SOCKET_EVENT.LEAVE_ROOM ', data)
    const { room_id, id, user_name } = data
    const { data: result } = await addChatMessage({
      room_id,
      message: `${user_name}님이 나가셨습니다.`,
      id: 'information',
      user_name: 'information',
    })
    await setReadIndexChatRoom({ room_id, id })
    const getIndexInfo = await getReadIndexChatRoom({ room_id, id })
    namespace.in(room_id).emit(SOCKET_EVENT.MESSAGE, {
      ...result,
      date: new Date(new Date().getTime()),
      current_cursor: getIndexInfo?.data,
    })

    socket.leave(room_id)
    namespace.in(room_id).emit(SOCKET_EVENT.LEAVE_ROOM, {
      room_id,
    })
  })
})

server.listen(process.env.CHAT_PORT, () => {
  console.log('chat server created ')
})

export default server
