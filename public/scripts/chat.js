const socket=io();
socket.on('connect',()=> {
    console.log('Connected to server')
})
//queryselector
const $sendLocationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')
const $input= document.querySelector('#message')
const submit=document.querySelector("#submit")

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    //Height of the second last message
    if(($messages.childElementCount) >= 5 ) {
        const secondLastMessage=$newMessage.previousElementSibling
        const secondLastMessageStyles=getComputedStyle(secondLastMessage)
        const secondLastMessageMargin=parseInt(secondLastMessageStyles.marginBottom)

        var secondLastMessageHeight=secondLastMessage.offsetHeight + secondLastMessageMargin
    }
    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight -secondLastMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
//Create new text message
const createList= (message)=>{
    const formattedTime=moment(message.createdAt).format('h:mm a');
    const html=Mustache.render(messageTemplate,{
        from: message.from,
        message: message.text,
        createdAt:formattedTime
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

}
const addMessage=()=>{
    const text=$input.value;
    $input.value='';
    socket.emit('createMessage',{from: "User",text: text})
}
//Create new Location message
const createLocation=(message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        from: message.from,
        url: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
}
//Dettet enter
$input.addEventListener( 'keypress',(event)=>{
    if(event.keyCode===13)
        addMessage();
})
// To emit createLocationMessage
$sendLocationButton.addEventListener('click',()=> {
    if(!navigator.geolocation)
        return alert('Geolocation not supported in your browser');
    $sendLocationButton.setAttribute("disabled","disabled")
    navigator.geolocation.getCurrentPosition((location)=>{
        console.log(location)
        socket.emit('creteLocationMessage',{latitude: location.coords.latitude,longitude: location.coords.longitude})
        $sendLocationButton.removeAttribute("disabled")
    },()=> {
        alert('Unable to fetch location')
        $sendLocationButton.removeAttribute("disabled")
    })
})

//To emit createMessage
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
