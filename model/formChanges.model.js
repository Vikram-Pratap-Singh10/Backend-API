import mongoose from "mongoose";

const FormChangeSchema = new mongoose.Schema({
    id:{
        type:String
    },
    status:{
        type:String
    },
    oldUser:{
        type:String
    },
    oldRole:{
        type:String
    },
    newUser:{
        type:String
    },
    newRole:{
        type:String
    },
    timestamp:{
        type: String
    },
    fieldName:{
        type:String
    },
    oldValue:{
        type:String
    },
    newValue:{
        type:String
    }
}, { timestamps: true })

export const formChanges = mongoose.model("formChange",FormChangeSchema)
