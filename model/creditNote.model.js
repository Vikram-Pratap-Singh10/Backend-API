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

export const CreditNote = mongoose.model("creditNote", CreditNoteSchema)