import { ServerWebSocket } from "bun";
import { v4 as uuidv4 } from "uuid";

interface User {
  name: string;
  publicKey: string;
  socket: ServerWebSocket<UserData>;
}

interface UserData {
  id: string;
}

const users = new Map<string, User>();

Bun.serve({
  port: 8080,
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    open(ws: ServerWebSocket<UserData>) {
      console.log("Connected");
      ws.data = {
        id: uuidv4(),
      };
      ws.send(
        JSON.stringify({
          type: "id",
          id: (ws.data as UserData).id,
        })
      );
    }, // a socket is opened
    message(ws, message) {
      console.log("Received: ", message);
      try {
        const json = JSON.parse(message.toString());
        if (json.type === "enter") {
          if (users.size >= 2) {
            ws.send("Server is full. Max of 2 users allowed.");
            ws.close(1000, "Server is full. Max of 2 users allowed.");
            return;
          }
          const name = json.name;
          const publicKey = json.publicKey;
          users.set((ws.data as UserData).id, {
            name,
            publicKey,
            socket: ws,
          });
          console.log(
            "Users: ",
            Array.from(users.values()).map((user) => user.socket.data.id + " - " + user.name + " | " + user.publicKey)
          );
          users.forEach((user: User) => {
            if (user.socket.data.id === (ws.data as UserData).id) return;
            user.socket.send(
              JSON.stringify({
                type: "enter",
                id: (ws.data as UserData).id,
                name,
                publicKey,
              })
            );
          });
          ws.send(
            JSON.stringify({
              type: "users",
              users: Array.from(users.values())
                .filter((user) => user.socket.data.id !== ws.data.id)
                .map((user) => ({
                  id: user.socket.data.id,
                  name: user.name,
                  publicKey: user.publicKey,
                })),
            })
          );
        } else if (json.type === "message") {
          users.forEach((user: User) => {
            if (user.socket.data.id === (ws.data as UserData).id) return;
            user.socket.send(
              JSON.stringify({
                type: "message",
                id: (ws.data as UserData).id,
                message: json.message,
                sig: json.sig,
                pubEd: json.pubEd,
                iv: json.iv,
                tag: json.tag,
              })
            );
          });
        }
      } catch (err) {
        console.log("Invalid JSON: ", err);
        return;
      }
    }, // a message is received
    close(ws, code, message) {
      users.delete((ws.data as UserData).id);
      ws.close(code, message);
      users.forEach((user: User) => {
        user.socket.send(
          JSON.stringify({
            type: "leave",
            id: (ws.data as UserData).id,
          })
        );
      });
      console.log("Closed: ", code, message);
    }, // a socket is closed
  }, // handlers
});
