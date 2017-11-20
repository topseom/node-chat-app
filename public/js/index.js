var socket = io();

socket.on('connect', function(){
    console.log('Connected to server');
    socket.emit('createMessage',{
        from:'top@example.com',
        text:'hey!'
    });
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

socket.on('newMessage',function(email){
    console.log('New message',email);
});
