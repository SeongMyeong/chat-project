const pool = require("../../../middleware/MysqlConnection");
const { makeResponseFormat } = require("../../../middleware/MakeResponse");

exports.getChatRoomList = (req, res) => {
  try {
    const { user_id } = req.query;
    const sql = `
    select room_id as ROOM_ID,
          room_name as ROOM_NAME,
          user_id as USER_ID,
          insert_date as INSERT_DATE
    from chat_room
    where user_id = '${user_id}'
  `;
    const queries = [];
    queries.push(sql);
    pool.transaction(queries).then((result) => {
      if (result[0].length === 0) {
        return res.json(makeResponseFormat("0000", { ROOM_DATA: [], HITS: 0 }));
      } else {
        return res.json(
          makeResponseFormat("0000", {
            ROOM_DATA: result[0],
            HITS: result[0].length,
          })
        );
      }
    });
  } catch (error) {
    return res.json(
      makeResponseFormat("9999", { ROOM_DATA: [], HITS: 0 }, error)
    );
  }
};
