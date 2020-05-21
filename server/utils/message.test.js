const {generateMessage}=require('./message')
const _=require('lodash');


describe('/Message',()=>{
    test('Should generate a new message',()=>{
        const message=generateMessage("Manish","it is working!")
        console.log(message)
        expect(message.from).toBe("Manish")
        expect(message.text).toBe("it is working!")
        expect(_.isNumber(message.createdAt)).toBe(true)
    })
})