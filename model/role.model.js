import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role"
    },
    roleName: {
        type: String
    },
    position: {
        type: Number
    },
    desc: {
        type: String
    },
    rank: {
        type: Number
    },
    rolePermission: []
}, { timestamps: true })

export const Role = mongoose.model("role", roleSchema);