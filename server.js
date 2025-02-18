const path = require("path");
const express = require("express");
const http = require("http"); //
const socketio = require("socket.io"); //requiring//importing socket io package

const app = express();
const server = http.createServer(app); //express actually uses this method under the hood to create a server, but we manually do this for now, so instead of app.listen we do server.listen

const io = socketio(server); // instance of the socketio server

// Set static folder

app.use(express.static(path.join(__dirname, "public")));

//Run when a client connects
io.on("connection", (socket) => {
  // taking the io object , which listens for any event, here we lsiten for a connection and takes an arrow fn with socket as a parameter
  console.log("new WS connection");

  //Welcome current user
  socket.emit("message", "Welcome to ChatCord"); //as soon as we're connected, first in our terminal console, the first message is logged and then it emits the message we send and it is handled in the frontend in app.js and that shows up on the client console

  //Broadcast whenn a user connects

  socket.broadcast.emit("message", "A user has joined the chat"); // this emits a message to all the users except the one who joins/connects the room/server unlike the above socket.emit method which emits the message to the user that joins the server

  //Runs when client/user disconnects

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg); //getting the message from client input compoenent and sending it back to display it properly
  });
});

const PORT = 3000 || process.env.PORT; // what does this is, first it sees if we have an environemnt variable named PORT and use thatif not, it uses 3000 as the port number

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
