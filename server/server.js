const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,"../public");
const port = process.env.PORT||3000;
const app = express();
const server = http.createServer(app);
const {generateMessage} = require('./utils/message');
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log("New user connected");
    
    socket.emit('newMessage',generateMessage('admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage',generateMessage('admin','New user joined'));

    socket.on('createMessage',(message,callback)=>{
        console.log('createMessage',message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('this is from server.');
    });

    socket.on('disconnect',()=>{
        console.log("User was disconnect");
    });
});

server.listen(port,()=>{
    console.log(`server running at ${port}`);
});