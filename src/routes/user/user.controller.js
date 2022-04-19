const pool = require("../../../middleware/MysqlConnection");
const { makeResponseFormat } = require("../../../middleware/MakeResponse");
const { checkMandatory } = require("../../../util/index");
const { getUserIdFromRequest, extractTokenFromRequest, decodeJWT, createJWT } = require("../../../middleware/JwtService");

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

exports.login = async (req, res) => {
  const { user_id, password } = req.body
  const mandatoryKeys = {
    user_id,
    password,
  }
  const passCheck = checkMandatory(mandatoryKeys)

  if (!passCheck.isPass) {
    return res.json(
        makeResponseFormat('8001', { data: passCheck.nonPassArray }, '필수입력정보 없음 ')
    )
  }
  try {
    const sql = `
      select user_id as USER_ID,
            password as PASSWORD,
            user_name as USER_NAME,
            user_email as USER_EMAIL,
            user_profile_image as USER_PROFILE_IMAGE,
            user_nickname as USER_NICKNAME
      from user_info
      where user_id = '${user_id}'
    `
    const queries = []
    queries.push(sql)

    pool
        .transaction(queries)
        // connection.promise().query(sql)
        .then((result) => {
          if (result[0].length === 0) {
            return res.json(makeResponseFormat('4001', {}, '사용자가 없습니다.'))
          } else {
            const dbPassword = result[0][0].PASSWORD
            try {
              // const hashPassword = crypto.createHash('sha256').update(inputPassword).digest('hex')
              if (password === dbPassword) {
                // 패스워드 동일
                const accessToken = createJWT({
                  user_id: result[0][0].USER_ID,
                  expire_date: '1d',
                })
                const refreshToken = createJWT({
                  user_id: result[0][0].USER_ID,
                  expire_date: '30d',
                })

                res.setHeader(
                    'Set-Cookie',
                    `access_token=${accessToken}; path=/; expires=${new Date(
                        Date.now() + 60 * 60 * 24 * 1000 * 3 // 1일
                    )}; httponly`
                )
                // res.setHeader(
                //   'Set-Cookie',
                //   `refresh_token=${refreshToken}; path=/; expires=${new Date(Date.now() + 60 * 60 * 24 * 1000 * 30, // 30일
                //   )}; httponly`,
                // );

                return res.json(
                    makeResponseFormat('0000', {
                      USER_DATA: {
                        USER_ID: result[0][0].USER_ID,
                        USER_NAME: result[0][0].USER_NAME,
                        ACCESS_TOKEN: accessToken,
                        REFRESH_TOKEN: refreshToken,
                        USER_EMAIL: result[0][0].USER_EMAIL,
                        USER_PROFILE_IMAGE: result[0][0].USER_PROFILE_IMAGE,
                        USER_NICKNAME: result[0][0].USER_NICKNAME,
                      },
                    })
                )
              } else {
                return res.json(makeResponseFormat('4002', {}, '패스워드가 잘못되었습니다.'))
              }
            } catch (error) {
              console.log('[masonms] error: ', error)
              return res.json(makeResponseFormat('9999', {}, error.code))
            }
          }
        })
        .catch((err) => {
          console.log('[masonms] error: ', err)
          // connection.end()
          return res.json(makeResponseFormat('9999', {}, err))
        })
        .then(() => {
          console.log('[masonms] finally then')
        })
  } catch (error) {
    return res.json(makeResponseFormat('9999', [], 0, error))
  }
}

exports.idCheck = (req, res) => {
  const { user_id } = req.body
  const mandatoryKeys = {
    user_id,
  }
  const passCheck = checkMandatory(mandatoryKeys)

  if (!passCheck.isPass) {
    return res.json(
        makeResponseFormat('8001', { data: passCheck.nonPassArray }, '필수입력정보 없음 ')
    )
  }

  try {
    const idCheckSql = `
      select user_id as USER_ID
      from user_info
      where user_id = '${user_id}'
    `

    const queries = []
    queries.push(idCheckSql)

    pool
        .transaction(queries)
        // connection.promise().query(idCheckSql)
        .then((result) => {
          if (result[0].length === 0) {
            // 기존회원정보 없음
            return res.json(makeResponseFormat('0000', {}, '가입이 가능한 아이디입니다.'))
          } else {
            // 기존회원정보 있음
            // 기존 회원있음 return
            return res.json(makeResponseFormat('4000', {}, '이미 가입한 회원입니다.'))
          }
        })
        .catch((err) => {
          console.log('[masonms] idCheck error: ', err)
          // connection.end()
          return res.json(makeResponseFormat('9999', {}, err))
        })
        .then(() => {
          console.log('[masonms] finally then')
        })
  } catch (error) {
    console.log('[masonms] try error: ', error)
    return res.json(makeResponseFormat('9999', [], 0, error))
  }
}

exports.signup = (req, res) => {
  const {
    user_id,
    password,
    user_name,
    user_email,
    user_profile_image,
    user_nickname: nickname,
  } = req.body
  const mandatoryKeys = {
    user_id,
    password,
    user_name,
  }
  const passCheck = checkMandatory(mandatoryKeys)
  if (!passCheck.isPass) {
    return res.json(
        makeResponseFormat('8001', { data: passCheck.nonPassArray }, '필수입력정보 없음 ')
    )
  }
  try {
    const idCheckSql = `
      select user_id as USER_ID
      from user_info
      where user_id = '${user_id}'
    `

    const queries = []
    queries.push(idCheckSql)

    pool
        .transaction(queries)
        // connection.promise().query(idCheckSql)
        .then((result) => {
          if (result[0].length === 0) {
            // 기존회원정보 없음
            // 회원가입 insert 진행
            queries.pop()
            const user_nickname = isEmpty(nickname) ? user_name : nickname
            const insertSql = `
          insert into user_info (user_id, password, user_name, user_email, user_profile_image, user_nickname)
          values ('${user_id}', '${password}', '${user_name}', '${user_email}', '${user_profile_image}', '${user_nickname}');
        `
            queries.push(insertSql)
            pool.transaction(queries).then((result) => {
              return res.json(makeResponseFormat('0000', {}, '회원가입이 완료되었습니다.'))

            })
                .catch((error) => {
                  return res.json(
                      makeResponseFormat(
                          error.errno,
                          {},
                          `회원가입이 실패했습니다. ${error.sqlMessage}`
                      )
                  );
                })
          } else {
            // 기존회원정보 있음
            // 기존 회원있음 return
            return res.json(makeResponseFormat('4000', {}, '이미 가입한 회원입니다.'))
          }
        })
        .catch((err) => {
          console.log('[masonms] idCheck error: ', err)
          // connection.end()
          return res.json(makeResponseFormat('9999', {}, err))
        })
        .then(() => {
          console.log('[masonms] finally then')
        })
  } catch (error) {
    console.log('[masonms] try error: ', error)
    return res.json(makeResponseFormat('9999', [], 0, error))
  }
}