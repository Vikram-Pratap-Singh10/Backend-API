import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    qty: {
        type: Number
    },
    price: {
        type: Number
    },
    status: {
        type: String,
        default: "ordered"
    }
});
const createOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "party"
    },
    date: {
        type: Date,
        default: Date.now,
    },
    DateofDelivery: {
        type: String
    },
    fullName: {
        type: String
    },
    address: {
        type: String
    },
    MobileNo: {
        type: Number
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    landMark: {
        type: String
    },
    pincode: {
        type: Number
    },
    grandTotal: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "pending"
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    currentAddress: {
        type: String
    },
    paymentId: {
        type: String
    },
    paymentMode: {
        type: String
    },
    orderItem: [orderItemsSchema]
}, { timestamps: true })

export const CreateOrder = mongoose.model("createOrder", createOrderSchema)