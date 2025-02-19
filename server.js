const path = require("path");
const express = require("express");
const http = require("http"); //
const socketio = require("socket.io"); //requiring//importing socket io package
const { userJoin, getCurrentUser } = require("./utils/user");

const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app); //express actually uses this method under the hood to create a server, but we manually do this for now, so instead of app.listen we do server.listen

const io = socketio(server); // instance of the socketio server

// Set static folder

app.use(express.static(path.join(__dirname, "public")));

const botname = "Chat Room Bot";
//Run when a client connects
io.on("connection", (socket) => {
  // taking the io object , which listens for any event, here we lsiten for a connection and takes an arrow fn with socket as a parameter
  console.log("new WS connection");

  //catching the username and roomanem once a user joins a room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room); //getting user format

    socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage(botname, "Welcome to ChatCord")); //as soon as we're connected, first in our terminal console, the first message is logged and then it emits the message we send and it is handled in the frontend in app.js and that shows up on the client console

    //Broadcast whenn a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botname, `${user.username} has joined the chat`)
      ); // this emits a message to all the users except the one who joins/connects the room/server unlike the above socket.emit method which emits the message to the user that joins the server

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      io.emit("message", formatMessage(user.username, msg)); //getting the message from client input compoenent and sending it back to display it properly
    });
  });

  //Runs when client/user disconnects

  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botname, `A user has left the chat`));
  });
});

const PORT = 3000 || process.env.PORT; // what does this is, first it sees if we have an environemnt variable named PORT and use thatif not, it uses 3000 as the port number

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
