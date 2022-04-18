const pool = require("../../../middleware/MysqlConnection");
const { makeResponseFormat } = require("../../../middleware/MakeResponse");
const { checkMandatory } = require("../../../util/index");

exports.getChatRoomList = (req, res) => {
  try {
    const { user_id } = req.query;
    const mandatoryKeys = {
      user_id,
    };
    const passCheck = checkMandatory(mandatoryKeys);

    if (!passCheck.isPass) {
      return res.json(
        makeResponseFormat(
          "8001",
          { data: passCheck.nonPassArray },
          "필수입력정보 없음 "
        )
      );
    }
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

exports.makeChatRoomList = (req, res) => {
  try {
    const { room_id, user_id, room_name } = req.body;
    const mandatoryKeys = {
      room_id,
      user_id,
      room_name,
    };
    const passCheck = checkMandatory(mandatoryKeys);

    if (!passCheck.isPass) {
      return res.json(
        makeResponseFormat(
          "8001",
          { data: passCheck.nonPassArray },
          "필수입력정보 없음 "
        )
      );
    }
    const sql = `
      insert into chat_room (room_id, user_id, room_name)
      values ('${room_id}', '${user_id}', '${room_name}')
    `;

    const queries = [];
    queries.push(sql);
    pool
      .transaction(queries)
      .then((result) => {
        return res.json(
          makeResponseFormat("0000", {}, "채팅방 생성이 완료되었습니다")
        );
      })
      .catch((error) => {
        return res.json(
          makeResponseFormat(
            error.errno,
            {},
            `채팅방 생성이 실패했습니다. ${error.sqlMessage}`
          )
        );
      });
  } catch (error) {
    makeResponseFormat("9999", { ROOM_DATA: [], HITS: 0 }, error);
  }
};
