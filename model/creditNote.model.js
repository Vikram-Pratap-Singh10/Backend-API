import mongoose from "mongoose";

const CreditNoteSchema = new mongoose.Schema({
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
    totalAmount: {
        type: Number
    }
}, { timestamps: true });

export const CreditNote = mongoose.model("creditNote", CreditNoteSchema)