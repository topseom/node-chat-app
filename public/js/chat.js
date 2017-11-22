var socket = io();

var param = $.deparam(window.location.search);
var name = param['name'] || 'User';
var room = param['room'];

function scrollToBottom(){
    //Selectors
    var messages = $('#messages');
    var newMessage = $('#messages > li:last-child')

    //Height
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight  >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function(){
    console.log('Connected to server');
    socket.emit('join',param,function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log("No error");
        }
    })
});

socket.on('updateUserList',function(users){
    console.log("Users List",users);
    var ol = $('<o style="list-style-type:decimal"></o>');
    users.forEach(user=>{
        if(user != name){
            var li = $('<li></li>');
            li.text(user);
            ol.append(li);
        }
    });
    $('#users').html(ol);
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime} : ${message.text}`);
    // $('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createAt: formattedTime
    });
    
    $('#messages').append(html);
    scrollToBottom();
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');

    // li.text(`${message.from} ${formattedTime} : `);
    // a.attr('href',message.url);
    // li.append(a);
    
});

// socket.emit('createMessage',{
//     from:"Mike",
//     text:"Hi"
// },function(data){
//     console.log('Got it '+data);
// });

$('#message-form').on('submit',function(e){
    e.preventDefault();
    
    var messageTextBox = $('[name=message]');

    socket.emit('createMessage',{
        from:name,
        room,
        text:messageTextBox.val()
    },function(){
        messageTextBox.val('');
    });
});

var locationButton = $('#send-location');
locationButton.on('click',function(e){
    if(!navigator.geolocation){
        return alert('Geolocation not support by your browser');
    }
    locationButton.attr('disabled','disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            room
        });
    },function(){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    });
});
