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

    socket.emit('NewMessage',{
        from: "Admin",
        text: "Welcome to the Chat App",
        createdAt: new Date()
    })
    socket.broadcast.emit('NewMessage',{
        from: "Admin",
        text: "New user joined",
        createdAt: new Date()
    })

    socket.on("createMessage",function (message) {
        console.log("create message :",message)
        io.emit('NewMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date()
        })
    })
    socket.on('disconnect',()=>{
        console.log('User disconnected')
    })

})

app.use(express.static(publicpath));

server.listen(process.env.PORT || 3000,()=>{
    console.log('Listening on port 3000...')
})