import mongoose from "mongoose";

const DebitNoteSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    orderId: {
        type: String
    },
    productItems: [{
        productId: {
            type: String
        },
        Qty_Purchased:{
            type:Number
        },
        Qty_Return: {
            type: Number
        },
        Product_Price: {
            type: Number
        }
    }],
    totalAmount: {
        type: Number
    }
}, { timestamps: true });

export const DebitNote = mongoose.model("debitNote", DebitNoteSchema)