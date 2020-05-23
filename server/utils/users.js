let users=[]

const addUser =(id,name,room) =>{
    name=name.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!name || !room){
        return {error: 'Name and Room are required'} 
    }
    const existingUser=users.find((user)=>{
        return user.name===name && user.room===room
    })
    if(existingUser){
        return {error: 'Name already present in the chat,Try another name'}
    }
    const user={id,name,room}
    users.push(user);
    return {user}
}

const getUser=(id)=>{
    return users.find((user)=> user.id===id)
}

const getUsersInRoom=(room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}

const removeUser=(id)=>{
    user=users.find((user)=>user.id===id)
    users=users.filter((user)=>user.id !== id)
    return user
}

module.exports={addUser,getUser,getUsersInRoom,removeUser}