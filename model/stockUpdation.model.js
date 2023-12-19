import mongoose from "mongoose";

const StockUpdationSchema = new mongoose.Schema({
    warehouseToId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    warehouseFromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    stockTransferDate: {
        type: String
    },
    exportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "factory"
    },
    productItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        unitType: {
            type: String
        },
        Size: {
            type: Number
        },
        currentStock: {
            type: Number
        },
        transferQty: {
            type: Number
        },
        price: {
            type: Number
        },
        totalPrice: {
            type: Number
        }
    }],
    grandTotal: {
        type: Number
    },
    transferStatus: {
        type: String
    }
}, { timestamps: true })
export const StockUpdation = mongoose.model("stockUpdation", StockUpdationSchema)