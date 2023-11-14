import mongoose from "mongoose"

const orderItemsSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        default: 1,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PartCatalogue",
    }
})
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreateAccount"
    },
    date: {
        type: Date,
        default: Date.now,
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
    alternateMobileNo: {
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
    shippingAmount: {
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
    currency: {
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
export const Order = mongoose.model("shoppingOrder", OrderSchema)