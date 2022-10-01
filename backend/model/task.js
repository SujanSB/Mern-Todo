const mongoose = require("mongoose")


const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum : ['pending','complete'],
        default: 'pending'
    }
    
},
{ timestamps: true })

const TaskModel = mongoose.model("TaskModel",taskSchema)
module.exports = TaskModel