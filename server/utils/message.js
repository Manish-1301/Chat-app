const moment=require('moment')

const generateMessage = (from,text)=>{
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
}

const generateLocationMessage=(from,latitude,longitude)=>{
    return {
        from,
        text:`https://www.google.com/maps?=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports={generateMessage,generateLocationMessage}