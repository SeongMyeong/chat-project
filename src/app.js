var app = require("express")();
var server = require("http").createServer(app);
let { SOCKET_EVENT } = require("../util/constants");
var express = require("express");
var cookieParser = require("cookie-parser");
var { setMessage } = require("./routes/message/message.dao")

const cors = require("cors");
app.use(cors());

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.set("view engine", "ejs"); // 렌더링 엔진 모드를 ejs로 설정
app.set("views", __dirname + "/views"); // ejs이 있는 폴더를 지정

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

var api = require("./routes");
app.use("/api", api);

const { swaggerUi, specs } = require("../middleware/Swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const namespace = io.of("room");
namespace.use((socket, next) => {
  // TODO jwt 검증 로직 필요
  next();
});

namespace.on("connection", (socket) => {
  // connection 시 socket으로 들어온 room_id로 join
  const { room_id } = socket.handshake.query;
  socket.join(room_id);

  socket.emit("usercount", io.engine.clientsCount);

  socket.on(SOCKET_EVENT.MESSAGE, (data) => {
    //console.log('data =', data, socket);
    console.log("소켓 메세지 on", socket.rooms); // Set { <socket.id>, "room1" }

    const { id, message, user_name, room_id, test_id } = data;
    const sendTime = new Date().getTime() // UTC 시간

    console.log('[masonms] sendTime: ', koreaNow)
    setMessage({
      ...data,
      time: sendTime
    })
    namespace.in(room_id).emit(SOCKET_EVENT.MESSAGE, {
      ...data,
      time: sendTime
    });
  });
});

server.listen(3000, function () {
  console.log("Listening on http://localhost:3000/");
});
