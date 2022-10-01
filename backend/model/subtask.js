const mongoose = require("mongoose")


const subtaskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum : ['pending','complete'],
        default: 'pending'
    },
    subtaskOf: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaskModel",
      },
    
},
{ timestamps: true })

const SubTaskModel = mongoose.model("SubTaskModel",subtaskSchema)
module.exports = SubTaskModel