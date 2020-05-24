const socket=io();

//queryselector
const $sendLocationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')
const $input= document.querySelector('#message')
const submit=document.querySelector("#submit")

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


const {name, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


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
    if(!text.trim())
        $input.value='';
    else{
        socket.emit('createMessage',{from: "User",text: text},()=>{
            $input.value='';
        })
    }
}
//Create new Location message
const createLocation=(message)=>{
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
        socket.emit('creteLocationMessage',{latitude: location.coords.latitude,longitude: location.coords.longitude})
        $sendLocationButton.removeAttribute("disabled")
    },()=> {
        alert('Unable to fetch location')
        $sendLocationButton.removeAttribute("disabled")
    })
})

//To emit createMessage
submit.addEventListener('click',addMessage)

socket.on('connect',()=> {

    socket.emit('join',{name,room},(err)=>{
        if(err){
            alert(err);
            location.href='/'
        }else{
            console.log("No error!!")
        }
    })
})
socket.on('roomData',({room,users})=>{
    console.log(users);
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on('NewMessage', (message)=> {
    createList(message);
})
socket.on('NewLocationMessage',(message)=>{
    createLocation(message);
})
socket.on('disconnect',()=>{
    console.log('disconnected from server');
})
