const socket=io();
socket.on('connect',function() {
    console.log('Connected to server')

    socket.emit('createMessage',{
        from: "Manish",
        text: "Shovna"
    })
})
socket.on('disconnect',function(){
    console.log('disconnected from server');
})
socket.on('NewMessage',function (message) {
    console.log('New message :', message );
})
