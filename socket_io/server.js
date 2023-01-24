import { readFileSync } from "fs";
import http from "http";
import { Server } from "socket.io";

const io = new Server(6060, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  // 新客户端连接时，广播
  io.emit("chat", `有人进入聊天室，当前聊天室人数：${io.engine.clientsCount}`);

  // 广播任何客户端发送的消息
  socket.on("chat", (data) => {
    io.emit("chat", data);
  });


  // 当有客户端退出时，广播
  socket.on("disconnect", () => {
    io.emit("chat", `有人退出了聊天室，当前聊天室人数：${io.engine.clientsCount}`);
  });
});

// 给 html 提供个简单静态服务
http
  .createServer((req, res) => {
    const html = readFileSync("./socket_io/index.html");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  })
  .listen(5050);
