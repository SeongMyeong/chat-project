var app = require("express")();
var server = require("http").createServer(app);
let { SOCKET_EVENT } = require("./util/constants");
var express = require("express");
var cookieParser = require("cookie-parser");

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

var api = require("./src/routes");
app.use("/api", api);

const { swaggerUi, specs } = require("./middleware/Swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const namespace = io.of("room");
namespace.use((socket, next) => {
  // TODO jwt 검증 로직 필요
  next();
});

namespace.on("connection", (socket) => {
  const { room_id } = socket.handshake.query;
  console.log("io connection ", room_id);
  console.log(socket.rooms); // Set { <socket.id> }

  socket.join(room_id);
  console.log(socket.rooms); // Set { <socket.id>, "room1" }

  console.log("[masonms] io connection");
  //연결이 들어오면 실행되는 이벤트
  // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.

  //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
  socket.emit("usercount", io.engine.clientsCount);
  // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
  // socket.on('message', (msg) => {
  //   //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
  //   console.log('Message received: ', msg);

  //   // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
  //   io.emit('message', msg);
  // });
  socket.on(SOCKET_EVENT.MESSAGE, (data) => {
    //console.log('data =', data, socket);
    console.log("소켓 메세지 on", socket.rooms); // Set { <socket.id>, "room1" }
    const { id, message, user_name, room_id } = data;
    namespace.in(room_id).emit(SOCKET_EVENT.MESSAGE, {
      ...data,
      time: new Date().getTime(),
    });
  });
});

server.listen(3000, function () {
  console.log("Listening on http://localhost:3000/");
});
