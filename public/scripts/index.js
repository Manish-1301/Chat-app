const socket=io();
socket.on('connect',function() {
    console.log('Connected to server')
})

const createList= function(message){
    const node = document.createElement("LI");                 
    const textnode = document.createTextNode(`${message.from}: ${message.text}`);         
    node.appendChild(textnode);                              
    document.getElementById("myList").appendChild(node);
}
function addMessage(){
    const text=document.getElementById("message").value;
    document.getElementById("message").value='';
    socket.emit('createMessage',{from: "User",text: text})
}

document.getElementById("message").addEventListener( 'keypress',function (event){
    if(event.keyCode===13)
        addMessage();
})
document.getElementById("location").addEventListener('click',function () {
    if(!navigator.geolocation)
        return alert('Geolocation not supported in your browser');
    navigator.geolocation.getCurrentPosition(function(location){
        console.log(location)
        socket.emit('creteLocationMessage',{latitude: location.coords.latitude,longitude: location.coords.longitude})
    },function(){
        alert('Unable to fetch location')
    })
})

const submit=document.getElementById("submit")
submit.addEventListener('click',addMessage)
socket.on('NewMessage',function (message) {
    console.log('New message :', message );
    createList(message);
})
socket.on('disconnect',function(){
    console.log('disconnected from server');
})
