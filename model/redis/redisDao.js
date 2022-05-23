const redishelpers = require('./redis')
const util = require('util')
const _ = require('lodash')
const KEY_ROOM = 'CHAT_ROOM'
const KEY_MESSAGE = 'CHAT_MESSAGE'
const KEY_INDEX = 'CHAT_INDEX'

/* 레디스 키 제거 */
const deleteRedisKey = async () => {
  return await redishelpers.redis.del(KEY_ROOM)
}

//현재까지 읽은 인덱스를 저장
//방에 들어감 -> 인덱스 저장
const setReadIndex = async (roomId, id) => {
  const lenkey = util.format('%s:%s', KEY_MESSAGE, roomId)
  let indexNum = await redishelpers.redis.llen(lenkey)

  const key = util.format('%s:%s:%s', KEY_INDEX, id, roomId)
  console.log('[SEO] SET_READ_INDEX ', key, indexNum)
  return redishelpers.redis.set(key, indexNum)
}

/* 현재방의 읽은 인덱스 가져오기 */
const getReadIndex = async (roomId, id) => {
  const key = util.format('%s:%s:%s', KEY_INDEX, id, roomId)
  const readIndex = await redishelpers.redis.get(key)
  return _.isNil(readIndex) ? 0 : readIndex
}

//message add
const addMessage = async (room_id, message, id, user_name, date) => {
  //const key = util.format("%s:%s:%s", KEY_MESSAGE, messageInfo.roomId, messageInfo.socketId);
  const key = util.format('%s:%s', KEY_MESSAGE, room_id)
  const value = util.format(
    '%s:%s:%s:%s:%s:%s',
    KEY_MESSAGE,
    message,
    room_id,
    id,
    user_name,
    date,
  )
  await setReadIndex(room_id, id)

  //const key = util.format("%s:%s", KEY_MESSAGE, messageInfo.roomId);
  //console.log('[SEO][redisDao] key , message', key, value)

  return await redishelpers.redis.rpush(key, value)
}

/* 채팅 메세지 가져오기 */
const getChatMessage = async ({ room_id, id }) => {
  try {
    //console.log('2')
    //console.log('[SEO][redisDao]   getChatMessage ', room_id)
    const key = util.format('%s:%s', KEY_MESSAGE, room_id)
    /* 현재 읽은 index 저장 */
    await setReadIndex(room_id, id)
    const res = await redishelpers.redis.lrange(key, 0, -1)
    return res
  } catch (e) {
    console.log(e)
  }
}

const getChatMessageCount = async (roomId, id) => {
  const key = util.format('%s:%s', KEY_MESSAGE, roomId)

  let roomMessageCount = await redishelpers.redis.llen(key) //현재 방의 메세지 카운트
  let messageReadIndex = await getReadIndex(roomId, id) //현재 계정의 읽은 메세지 카운트
  // console.log(
  //   "roomMessage messageRedindex ",
  //   roomMessageCount,
  //   messageReadIndex
  // );
  return util.format('%s:%s', roomMessageCount, messageReadIndex)
}

/* chatRoom 생성  */
/* set 중복없는 value 값  */

const createChatRoom = async (room_id, id) => {
  // roomList를 위해
  const room_key = util.format('%s', KEY_ROOM)
  await redishelpers.redis.sadd(room_key, room_id)
  // 내가 들어간 방을 알기 위해
  const key = util.format('%s:%s', KEY_ROOM, id)
  console.log('createChatRoom  ', key)
  return await redishelpers.redis.sadd(key, room_id)
}

// 전체 룸 리스트 반환
const getAllChatRoomList = async () => {
  const key = util.format('%s', KEY_ROOM)
  try {
    let resdata = await redishelpers.redis.smembers(key)
    console.log('getAllChatRoomList  = ', resdata)
    return resdata
  } catch (e) {
    console.log(e)
    return {}
  }
}

const getIsInRoom = async (room_id, id) => {
  try {
    const key = util.format('%s:%s', KEY_ROOM, id)
    let joinedRoom = await redishelpers.redis.smembers(key)
    const resdata = joinedRoom.find(item => item === room_id)
    return resdata
  } catch (e) {
    console.log(e)
  }
}
/* 내가 들어가 있는 룸 리스트 조회 */
const getJoinChatRoomList = async id => {
  try {
    console.log('[getJoinChatRoomList] id', id)
    const key = util.format('%s:%s', KEY_ROOM, id)
    // console.log('[SEO][getChatRoomList] KEY ', key)
    let resdata = await redishelpers.redis.smembers(key)
    console.log('getJoinChatRoomList= ', resdata)
    return resdata
  } catch (e) {
    console.log(e)
  }
}

/* 방에 들어가기  */
const joinChatRoom = async (room_id, id, user_name) => {
  //console.log(messageInfo);
  // 현재 룸 배열에 내아이디 추가하기
  const room_key = util.format('%s:%s', KEY_ROOM, room_id)
  const room_value = util.format('%s:%s', id, user_name)
  console.log('================joinChatRoom===================')
  console.log('room_key = ', room_key, ' room_value =', room_value)
  await redishelpers.redis.sadd(room_key, room_value)

  const member_count = await getChatRoomMember(room_id)
  console.log('member_count = ', member_count)
  // 현재 내가 들어가있는 방에 나 추가하기
  const key = util.format('%s:%s', KEY_ROOM, id)
  console.log('joinChatRoom key', key)
  await redishelpers.redis.sadd(key, room_id)
  return member_count
}

/* 방에서 나가기  */
const leaveChatRoom = async (room_id, id, user_name) => {
  console.log('================leaveChatRoom===================')
  //현재 룸 배열에 내 아이디 제거하기
  const room_key = util.format('%s:%s', KEY_ROOM, room_id)
  const room_value = util.format('%s:%s', id, user_name)
  await redishelpers.redis.srem(room_key, room_value)

  // 현재 내가 들어가있는 방에 나 제거하기
  const key = util.format('%s:%s', KEY_ROOM, id)
  console.log('joinChatRoom key', key)
  await redishelpers.redis.srem(key, room_id)

  let memberCount = await getChatRoomMember(room_id)
  if (memberCount === 0) {
    distroyRoom()
  }
}

/*해당 room 제거  */
const distroyRoom = room_id => {
  redishelpers.redis.srem(KEY_ROOM, room_id)
}

/* 채팅방 멤버수 구하기  */
const getChatRoomMember = room_id => {
  const key = util.format('%s:%s', KEY_ROOM, room_id)
  return redishelpers.redis.smembers(key)
}

const deleteChatRoom = value => {
  const key = util.format('%s:%s', KEY_ROOM, 'ADMIN')
  return redishelpers.redis.srem(key, value)
}
/////////////////////////////////

module.exports = {
  //key
  //CHAT 함수
  deleteRedisKey: deleteRedisKey,
  getChatMessage: getChatMessage,
  addMessage: addMessage,
  createChatRoom: createChatRoom,
  getJoinChatRoomList: getJoinChatRoomList,
  getAllChatRoomList: getAllChatRoomList,
  getChatRoomMember: getChatRoomMember,
  getChatMessageCount: getChatMessageCount,
  joinChatRoomRedis: joinChatRoom,
  leaveChatRoomRedis: leaveChatRoom,
  distroyRoom: distroyRoom,

  setReadIndex: setReadIndex,
  getReadIndex: getReadIndex,

  deleteChatRoom: deleteChatRoom,
  getIsInRoomRedis: getIsInRoom,
}
