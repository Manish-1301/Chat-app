const path = require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http')

const publicpath=path.join(__dirname,'/../public');

const app=express();
const server=http.createServer(app);
const io=socketIO(server);

io.on('connection',(socket)=>{
    console.log('New user Connected');

    socket.on('disconnect',()=>{
        console.log('User disconnected')
    })
    socket.emit('NewMessage',{
        from: "Manish",
        text: "Shovna",
        at: new Date()
    })
    socket.on("createMessage",function (message) {
        console.log("New message :",message)
    })
})

app.use(express.static(publicpath));

server.listen(process.env.PORT || 3000,()=>{
    console.log('Listening on port 3000...')
})