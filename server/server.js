const path = require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http')
const {generateMessage,generateLocationMessage}=require('./utils/message');
const{addUser,getUser,getUsersInRoom,removeUser}=require('./utils/users')

const publicpath=path.join(__dirname,'/../public');

const app=express();
const server=http.createServer(app);
const io=socketIO(server);

io.on('connection',(socket)=>{
    console.log(`user Connected`);

    socket.on('join',(options,callback)=>{
        const {user,error}=addUser(socket.id,options.name,options.room)
        console.log(user,error)
        if(error){
            return callback(error)
        }
        socket.join(options.room)
        socket.emit('NewMessage',generateMessage("Admin",`Hey ${options.name},welcome to the Chat app`))
        socket.to(options.room).broadcast.emit('NewMessage',generateMessage("Admin",`${options.name} Joined`))
        io.to(options.room).emit('roomData',{
            room: options.room,
            users:getUsersInRoom(options.room)
        })
        callback()
    })

    

    socket.on('createMessage', (message,callback)=> {
        const user=getUser(socket.id)
        if(user){
            io.to(user.room).emit('NewMessage',generateMessage(user.name,message.text))
        }
        callback()
    })
    socket.on('creteLocationMessage',(location)=>{
        const user=getUser(socket.id)
        if(user)
            io.to(user.room).emit('NewLocationMessage',generateLocationMessage(user.name,location.latitude,location.longitude))
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id);
        io.to(user.room).emit('roomData',{
            room: user.room,
            users:getUsersInRoom(user.room)
        })
        socket.to(user.room).broadcast.emit('NewMessage',generateMessage("Admin",`${user.name} left`))
        console.log('User disconnected')
    })

})

app.use(express.static(publicpath));

server.listen(process.env.PORT || 3000,()=>{
    console.log('Listening on port 3000...')
})