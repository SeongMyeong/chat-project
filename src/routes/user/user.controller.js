const pool = require("../../../middleware/MysqlConnection");
const { makeResponseFormat } = require("../../../middleware/MakeResponse");
const { checkMandatory } = require("../../../util/index");
const JwtService = require("../../../middleware/JwtService");

exports.getUserList = (req, res) => {
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
    select user_id as USER_ID,
          user_name as USER_NAME
    from user_info
    where 3=3 and 
    user_id != '${user_id}'
  `;
    const queries = [];
    queries.push(sql);
    pool.transaction(queries).then((result) => {
      if (result[0].length === 0) {
        return res.json(makeResponseFormat("0000", { USER_DATA: [], HITS: 0 }));
      } else {
        return res.json(
          makeResponseFormat("0000", {
            USER_DATA: result[0],
            HITS: result[0].length,
          })
        );
      }
    });
  } catch (error) {
    return res.json(
      makeResponseFormat("9999", { USER_DATA: [], HITS: 0 }, error)
    );
  }
};

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
    where 3=3 and 
    user_id = '${user_id}'
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
    const makeRoomSql = `
      insert into chat_room (room_id, user_id, room_name)
      values ('${room_id}', '${user_id}', '${room_name}')
    `;

    const enterRoomSql = `
      insert into user_in_chat_room (room_id, user_id)
      values ('${room_id}', '${user_id}')
    `;

    const queries = [];
    queries.push(makeRoomSql);
    queries.push(enterRoomSql);
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

// 채팅방 진입
exports.enterChatRoom = (req, res) => {
  try {
    const { user_id, room_id } = req.body;
    const mandatoryKeys = {
      room_id,
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
      insert into user_in_chat_room (room_id, user_id)
      values ('${room_id}', '${user_id}')
    `;

    const queries = [];
    queries.push(sql);
    pool
      .transaction(queries)
      .then((result) => {
        return res.json(
          makeResponseFormat("0000", {}, "채팅방에 입장하였습니다.")
        );
      })
      .catch((error) => {
        return res.json(
          makeResponseFormat(
            error.errno,
            {},
            `채팅방 입장에 실패했습니다. ${error.sqlMessage}`
          )
        );
      });
  } catch (error) {
    makeResponseFormat("9999", { ROOM_DATA: [], HITS: 0 }, error);
  }
};

// 채팅방 나가기

exports.exitChatRoom = (req, res) => {
  try {
    const { user_id, room_id, owner_id } = req.body;
    const mandatoryKeys = {
      room_id,
      user_id,
      owner_id,
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

    // 1. 채팅방에서 현재 아이디 delete
    const exitSql = `
      delete from user_in_chat_room
      where 3=3 and
      user_id = '${user_id}' and room_id = '${room_id}'
    `;

    // 2. 채팅방에 들어간 인원 count select
    const countSql = `
      select count(*) AS MEMBER_COUNT
      from user_in_chat_room
      where 3=3 and
      room_id = '${room_id}' and
      user_id = '${owner_id}'
    `;

    // 3. 2의 결과가 0 일 경우, 채팅방 delete
    const deleteRoomSql = `
      delete from chat_room
      where 3=3 and
      user_id = '${owner_id}' and
      room_id = '${room_id}'
    `;

    const queries = [];
    queries.push(exitSql);
    pool
      .transaction(queries)
      .then((result) => {
        return res.json(
          makeResponseFormat("0000", {}, "채팅방에 입장하였습니다.")
        );
      })
      .catch((error) => {
        return res.json(
          makeResponseFormat(
            error.errno,
            {},
            `채팅방 입장에 실패했습니다. ${error.sqlMessage}`
          )
        );
      });
  } catch (error) {
    makeResponseFormat("9999", { ROOM_DATA: [], HITS: 0 }, error);
  }
};
