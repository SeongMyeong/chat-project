// import { Chat } from '../model/Chat'
import { addMessage, getChatMessage } from '../model/redis/redisDao'
import statusCode from '../util/statusCode'
import { parseMessageList } from '../util/parseRedis'
import { verifyRequiredParams } from '../util'

const getChatMessages = async room_id => {
  try {
    //verifyRequiredParams(room_id)
    const result = await getChatMessage(room_id)
    //console.log('result = ', result)
    return {
      code: statusCode.OK,
      data: parseMessageList(result),
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}

const addChatMessage = async ({ room_id, message, id, user_name, date }) => {
  try {
    verifyRequiredParams(room_id)
    const result = await addMessage(room_id, message, id, user_name, date)
    //console.log('result', result)
    return { data: { room_id, message, id, user_name, date } }
  } catch (e) {
    console.log(e)
  }
}

// const createChatMessage = async ({ channelId, creator, contents, file }) => {
//   verifyRequiredParams(channelId, creator, contents || file)
//   const result = await dbErrorHandler(() =>
//     Chat.create({
//       channel: channelId,
//       creator,
//       contents,
//       file: file === null ? undefined : file,
//     }),
//   )
//   return { data: result }
// }
// const createReplyMessage = async ({
//   channelId,
//   creator,
//   contents,
//   parentId,
//   file,
// }) => {
//   verifyRequiredParams(channelId, creator, contents, parentId)
//   const result = await dbErrorHandler(() =>
//     Chat.create({
//       channel: channelId,
//       parentId: parentId,
//       creator,
//       contents,
//       file: file === null ? undefined : file,
//     }),
//   )
//   return { data: result }
// }

// const getReplyMessage = async ({ channelId, parentId }) => {
//   verifyRequiredParams(channelId, parentId)
//   const result = await dbErrorHandler(() =>
//     Chat.getReplyMessages({ channelId, parentId }),
//   )
//   return { code: statusCode.OK, data: result, success: true }
// }

module.exports = { getChatMessages, addChatMessage }
