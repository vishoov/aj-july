const express = require('express');
const cors = require('cors');
//we need to make a http handshake with the server
const http = require('http');
const app = express();

//we will upgrade the express app to a http server -> handshake 
const server = http.createServer(app);

//SOCKET.IO CODE STARTS HERE
//import socket.io
const socketIo = require("socket.io");
//setup the socket.io server along with its configuration
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"], // Corrected typo: 'allowedHeader' to 'allowedHeaders'
        credentials: true // Allow cookies
    }
});

//setup the socket.io connection
io.on("connection", (socket)=>{
    console.log(`A user connected with id: ${socket.id}`);

    //listen for the message event from the client

    socket.on("message", (data)=>{
        const { message, reciever } = data;
        console.log(`Message received from client: ${message}`);
        //you can emit the message to all connected clients


        //forward the message to a specific client
        if(reciever){
            //forward the message to the specific client
            io.to(reciever).emit("forward-message", {message, socketId: socket.id});

        }else{
            io.emit("forward-message", {message, socketId: socket.id});
        }
    })

    socket.on("join-room", (room)=>{
    console.log(`User with id: ${socket.id} joined the room :${room}`);

//this is where we will join the room
    socket.join(room);


    })


})
//io.on is used to listen for events on the server side
//connection event is emitted when a new client connects to the server
//connection will be recieved on the server side and we can handle it using a callback function
//.on -> method is used to listen for events
//.emit -> method is used to emit events (send events to the socket server)
//socket object is used to interact with the connected client
//socket object is defined by socket.io and it is passed as an argument to the callback function
//socket.id is a unique identifier for the each and every connected client





app.get("/", (req, res)=>{
    try{
        res.json({
            message: "Welcome to the chat app server"
        })
    }
    catch(err){
        console.log("Error in getting the response", err);
        res.status(500).json({
            message:err.message
        })
    }
})



server.listen(3000, ()=>{
    try{
        console.log("Server is running on port 3000");
    }
    catch(err){
        console.log("Error in starting the server", err);
    }
})



