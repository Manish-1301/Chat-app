const socket=io();
socket.on('connect',function() {
    console.log('Connected to server')
})
//queryselector
const $sendLocationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

const createList= function(message){
    const formattedTime=moment(message.createdAt).format('h:mm a');
    const html=Mustache.render(messageTemplate,{
        from: message.from,
        message: message.text,
        createdAt:formattedTime
    })
    shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
    $messages.insertAdjacentHTML('beforeend', html)
    if (!shouldScroll) {
        scrollToBottom();
    }

}
function addMessage(){
    const text=document.getElementById("message").value;
    document.getElementById("message").value='';
    socket.emit('createMessage',{from: "User",text: text})
}

function createLocation(message){
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        from: message.from,
        url: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
    $messages.insertAdjacentHTML('beforeend', html)
    if (!shouldScroll) {
        scrollToBottom();
    }
}

document.getElementById("message").addEventListener( 'keypress',function (event){
    if(event.keyCode===13)
        addMessage();
})

loc=document.getElementById("location");
loc.addEventListener('click',function () {
    if(!navigator.geolocation)
        return alert('Geolocation not supported in your browser');
    loc.setAttribute("disabled","disabled")
    navigator.geolocation.getCurrentPosition(function(location){
        console.log(location)
        socket.emit('creteLocationMessage',{latitude: location.coords.latitude,longitude: location.coords.longitude})
        loc.removeAttribute("disabled")
    },function(){
        alert('Unable to fetch location')
        loc.removeAttribute("disabled")
    })
})

const submit=document.getElementById("submit")
submit.addEventListener('click',addMessage)
socket.on('NewMessage',function (message) {
    console.log('New message :', message );
    createList(message);
})
socket.on('NewLocationMessage',function(message){
    console.log('New message :', message );
    createLocation(message);
})
socket.on('disconnect',function(){
    console.log('disconnected from server');
})
