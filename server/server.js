const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname,"../public");
const port = process.env.PORT||3000;
const app = express();
const server = http.createServer(app);
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/user');

var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log("New user connected");

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name are required.');
        }

        socket.join(params.room);
        var user = users.addUser(socket.id,params.name,params.room);
        socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
        if(user){
            io.to(params.room).emit('updateUserList',users.getUserList(params.room));
            socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} joined.`));
        }
        callback();
    });

    socket.on('createMessage',(message,callback)=>{
        console.log('createMessage',message);
        var user = users.getUser(socket.id);
        if(isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(message.from,message.text));
        }
        callback();
    });

    socket.on('createLocationMessage',(coords)=>{
        console.log(coords);
        var user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude));
    });

    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            socket.broadcast.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
        }
        //console.log(socket.id);
        console.log("User was disconnect");
    });
});

server.listen(port,()=>{
    console.log(`server running at ${port}`);
});