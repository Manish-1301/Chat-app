const path = require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http')

const publicpath=path.join(__dirname,'/../public');

const app=express();
const server=http.createServer(app);
const io=socketIO(server);
const {generateMessage,generateLocationMessage}=require('./utils/message');

io.on('connection',(socket)=>{
    console.log('New user Connected');

    socket.emit('NewMessage',generateMessage("Admin","Welcome to the Chat app"))
    socket.broadcast.emit('NewMessage',generateMessage("Admin","New User Joined"))

    socket.on('createMessage',function (message) {
        console.log("create message :",message)
        io.emit('NewMessage',generateMessage(message.from,message.text))
    })
    socket.on('creteLocationMessage',function(location){
        console.log(location)
        io.emit('NewLocationMessage',generateLocationMessage("User",location.latitude,location.longitude))
    })
    socket.on('disconnect',()=>{
        console.log('User disconnected')
    })

})

app.use(express.static(publicpath));

server.listen(process.env.PORT || 3000,()=>{
    console.log('Listening on port 3000...')
})