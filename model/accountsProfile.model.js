import mongoose from "mongoose";

const AccountsProfileSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreateAccount"
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    Password: {
        type: String
    },
    profileImage: {
        type: String
    },
    locale: {
        type: String
    },
    timeZone: {
        type: String
    },
    dateFormat: {
        type: String
    },
    dateTimeFormat: {
        type: String
    },
    currency:{
        type:String
    }
}, { timestamps: true })
export const AccountsProfile = mongoose.model("AccountsProfiles", AccountsProfileSchema)
