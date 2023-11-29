import mongoose from "mongoose";

const DebitNoteSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    purchaseOrderId: {
        type: String
    },
    productItems: [{
        productId: {
            type: String
        },
        qty: {
            type: Number
        },
        price: {
            type: Number
        }
    }],
    totalAmount: {
        type: Number
    }
}, { timestamps: true });

export const DebitNote = mongoose.model("debitNote", DebitNoteSchema)