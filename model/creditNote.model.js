import mongoose from "mongoose";

const CreditNoteSchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    userId: {
        type: String
    },
    orderId: {
        type: String
    },
    productItems: [],
    totalAmount: {
        type: Number
    }
}, { timestamps: true });

export const CreditNote = mongoose.model("creditNote", CreditNoteSchema)