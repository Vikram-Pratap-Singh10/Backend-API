import mongoose from "mongoose";

const StockUpdationSchema = new mongoose.Schema({
    warehouseToId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "warehouse"
    },
    warehouseFromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "warehouse"
    },
    stockTransferDate: {
        type: String
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
    status: {
        type: String
    }
})
export const StockUpdation = mongoose.model("stockUpdation", StockUpdationSchema)