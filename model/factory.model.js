import mongoose from "mongoose";

const FactorySchema = new mongoose.Schema({
    warehouseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"warehouse"
    },
    stockTransferDate:{
        type:String
    },
    productItems:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        },
        unitType:{
            type:String
        },
        Size:{
            type:Number
        },
        transferQty:{
            type:Number
        },
        price:{
            type:Number
        },
        totalPrice:{
            type:Number
        }
    }],
    grandTotal:{
        type:Number
    },
    status:{
        type:String
    }
})
export const Factory = mongoose.model("factory",FactorySchema)