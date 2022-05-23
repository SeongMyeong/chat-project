// import { Chat } from '../model/Chat'
import {
  createChatRoom,
  getJoinChatRoomList,
  getAllChatRoomList,
  joinChatRoomRedis,
  leaveChatRoomRedis,
  setReadIndex,
  getReadIndex,
  deleteRedisKey,
  getChatRoomMember,
  getIsInRoomRedis,
} from '../model/redis/redisDao'
import statusCode from '../util/statusCode'
import { verifyRequiredParams } from '../util'
import { parseRoomMemberList } from '../util/parseRedis'

const chatRoomMember = async () => {
  try {
    const data = await getChatRoomMember()
    return {
      code: statusCode.OK,
      data,
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}
/* 전체 방 리스트 */
const roomList = async () => {
  try {
    const data = await getAllChatRoomList()
    //console.log('[roomList] data = ', data)
    return {
      code: statusCode.OK,
      data,
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}
/* 내가 들어간 방 리스트 */
const joinRoomList = async ({ id }) => {
  verifyRequiredParams(id)
  try {
    const data = await getJoinChatRoomList(id)
    //console.log('data = ', data)
    return {
      code: statusCode.OK,
      data,
      success: true,
    }
  } catch (e) {
    console.log(e)
    return {
      code: statusCode.BAD_REQUEST,
      data: '',
      success: false,
    }
  }
}
/* 방 입장 */
const joinChatRoom = async ({ room_id, id, user_name }) => {
  //console.log('joinChatRoom room_id id', room_id, id)
  verifyRequiredParams(room_id, id, user_name)
  try {
    const res = await joinChatRoomRedis(room_id, id, user_name)
    console.log('joinChatRoom ', res)
    return {
      code: statusCode.OK,
      data: parseRoomMemberList(res),
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}
/* 방 나가기 */
const leaveChatRoom = async ({ room_id, id, user_name }) => {
  verifyRequiredParams(room_id, id, user_name)
  const res = leaveChatRoomRedis(room_id, id, user_name)
  return {
    code: statusCode.OK,
    data: res,
    success: true,
  }
}
/* 방 생성 */
const createRoom = async ({ room_id, id }) => {
  try {
    verifyRequiredParams(room_id, id)
    await createChatRoom(room_id, id)
    return {
      code: statusCode.CREATED,
      data: '',
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}
/* 채팅방의 읽은 인덱스 저장 */
const setReadIndexChatRoom = async ({ room_id, id }) => {
  try {
    verifyRequiredParams(room_id, id)
    await setReadIndex(room_id, id)
    return {
      code: statusCode.OK,
      data: '',
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}
/* 채팅방의 읽은 인덱스 가져오기 */
const getReadIndexChatRoom = async ({ room_id, id }) => {
  //console.log('roomId ', room_id, 'id ', id)
  try {
    verifyRequiredParams(room_id, id)
    const index = await getReadIndex(room_id, id)
    return {
      code: statusCode.OK,
      data: index,
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}

const handleDeleteRedisKey = async () => {
  try {
    const index = await deleteRedisKey()
    return {
      code: statusCode.OK,
      data: index,
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}

const getIsInRoom = async (room_id, id) => {
  try {
    const isIn = await getIsInRoomRedis(room_id, id)
    return {
      code: statusCode.OK,
      data: isIn,
      success: true,
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  roomList,
  createRoom,
  joinChatRoom,
  joinRoomList,
  leaveChatRoom,
  setReadIndexChatRoom,
  getReadIndexChatRoom,
  handleDeleteRedisKey,
  chatRoomMember,
  getIsInRoom,
}
