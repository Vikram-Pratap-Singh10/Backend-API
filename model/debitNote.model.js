import mongoose from "mongoose";

const DebitNoteSchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    userId: {
        type: String
    },
    purchaseOrderId: {
        type: String
    },
    productItems: [],
    totalAmount: {
        type: Number
    }
}, { timestamps: true });

export const DebitNote = mongoose.model("debitNote", DebitNoteSchema)