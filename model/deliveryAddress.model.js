import mongoose from "mongoose";

const DeliveryAddressSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    address:{
        type:String
    }
})
export const deliveryAddress = mongoose.model("deliveryAddress",DeliveryAddressSchema);