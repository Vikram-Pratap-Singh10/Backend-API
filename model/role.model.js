import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    roleName:{
        type:String
    },
    desc:{
        type:String
    },
    rolePermission:[]
})

export const Role = mongoose.model("role",roleSchema);