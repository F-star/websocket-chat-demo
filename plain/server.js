import { WebSocketServer } from "ws";
import http from "http";
import { readFileSync } from "fs";

// 创建一个 ws 服务
const wsSever = new WebSocketServer({
  port: 6060,
});

// 每当一个客户端进行了 ws 连接，就会创建一个 ws 对象
wsSever.on("connection", (ws) => {
  // 新客户端连接时，广播
  wsSever.clients.forEach((client) => {
    client.send(`有人进入聊天室，当前聊天室人数：${wsSever.clients.size}`);
  });

  // 广播任何客户端发送的消息
  ws.on("message", (data) => {
    const msg = data.toString();
    wsSever.clients.forEach((client) => {
      client.send(msg);
    });
  });

  // 当有客户端退出时，广播
  ws.on("close", () => {
    wsSever.clients.forEach((client) => {
      client.send(`有人退出了聊天室，当前聊天室人数：${wsSever.clients.size}`);
    });
  });
});

// 给 html 提供个简单静态服务
http
  .createServer((req, res) => {
    const html = readFileSync("./plain/index.html");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  })
  .listen(5050);
