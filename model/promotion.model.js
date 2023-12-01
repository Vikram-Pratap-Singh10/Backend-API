import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema({
    percentageWise: [{
        totalAmount: {
            type: Number
        },
        percentageDiscount: {
            type: Number
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        freeQty: {
            type: Number
        },
        status: {
            type: String,
            default: "Active"
        }
    }],
    amountWise: [{
        totalAmount: {
            type: Number
        },
        percentageAmount: {
            type: Number
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        freeQty: {
            type: Number
        },
        status: {
            type: String,
            default: "Active"
        }
    }],
    productWise: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        productQty: {
            type: Number
        },
        discountAmount: {
            type: Number
        },
        discountPercentage: {
            type: Number
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        freeSameProductQty: {
            type: Number
        },
        freeOtherProducts: [{
            productId: {
                type: String
            },
            freeProductQty: {
                type: Number
            }
        }]
    }],
    promoCodeWise: [{
        promoCode: {
            type: String
        },
        promoAmount: {
            type: Number
        },
        startDate: {
            type: String
        },
        endDate: {
            type: String
        },
        status: {
            type: String
        }
    }],
    status: {
        type: String
    }
})

export const Promotion = mongoose.model("promotion", PromotionSchema);