const mysql = require("mysql2");
const util = require("util");

// mysql 연결
const pool = mysql.createPool({
  connectionLimit: 5000,
  host: process.env.NODE_ENV === "production" ? "221.133.61.193" : "10.1.193.1",
  user: "dev",
  password: "Mysql1234%",
  database: "chatserver",
  multipleStatements: true,
});

// db 연결
pool.getConnection((err, connection) => {
  if (err) {
    switch (err.code) {
      case "PROTOCOL_CONNECTION_LOST":
        console.error("Database connection was closed.");
        break;
      case "ER_CON_COUNT_ERROR":
        console.error("Database has too many connections.");
        break;
      case "ECONNREFUSED":
        console.error("Database connection was refused.");
        break;
    }
  }
  if (connection) return connection.release();
});

pool.query = util.promisify(pool.query);

pool.getConnection = util.promisify(pool.getConnection);

const transaction = async (queries) => {
  const connection = await pool.getConnection();
  try {
    connection.beginTransaction = util.promisify(connection.beginTransaction);
    connection.commit = util.promisify(connection.commit);
    await connection.beginTransaction();
    connection.query = util.promisify(connection.query);
    for (let i in queries) {
      const query = queries[i];
      const result = await connection.query(query);
      queries[i] = result;
    }
    await connection.commit();
    connection.release();
    return queries;
  } catch (e) {
    connection.rollback = util.promisify(connection.rollback);
    await connection.rollback();
    connection.release();
    throw e;
  }
};

// export default pool;
module.exports = {
  pool: pool,
  transaction: transaction,
};
