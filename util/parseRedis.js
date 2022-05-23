//"CHAT_MESSAGE:dsa:3:a5a0cdc1-a638-4932-807a-ba9e3a239026:Nathan"
const parseMessageList = list => {
  return list.map(item => {
    const splitedMessage = item.split(':')
    const message = splitedMessage[1]
    const room_id = splitedMessage[2]
    const id = splitedMessage[3]
    const user_name = splitedMessage[4]
    const date = splitedMessage[5]
    return { message, room_id, id, user_name, date }
  })
}
const parseRoomMemberList = list => {
  return list.map(item => {
    const splitedMessage = item.split(':')
    const id = splitedMessage[0]
    const user_name = splitedMessage[1]
    return { id, user_name }
  })
}

module.exports = { parseMessageList, parseRoomMemberList }
