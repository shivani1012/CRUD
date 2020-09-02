const mongoose = require("mongoose")
const Schema = mongoose.Schema


const UserTask = Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = User_Schema = mongoose.model('user',UserTask)
