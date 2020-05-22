const {generateMessage,generateLocationMessage}=require('./message')
const _=require('lodash');


describe('/Message',()=>{
    test('Should generate a new message',()=>{
        const message=generateMessage("Manish","it is working!")
        expect(message.from).toBe("Manish")
        expect(message.text).toBe("it is working!")
        expect(_.isNumber(message.createdAt)).toBe(true)
    })
    test('Should generate a new Location message',()=>{
        const message=generateLocationMessage("Manish",123,456)
        expect(message.from).toBe("Manish")
        expect(message.text).toBe("https://www.google.com/maps?=123,456")
        expect(_.isNumber(message.createdAt)).toBe(true)
    })

})
