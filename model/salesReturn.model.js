import mongoose from "mongoose";

const SalesReturnSchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    orderId: {
        type: String
    },
    returnItems: [{
        productId: {
            type: String
        },
        Qty_Sales: {
            type: Number
        },
        Qty_Return: {
            type: Number
        },
        Product_Price: {
            type: Number
        }
    }],
    mobileNumber: {
        type: String
    },
    email: {
        type: String
    },
    Return_amount: {
        type: String
    }

})
export const SalesReturn = mongoose.model("salesReturn", SalesReturnSchema)