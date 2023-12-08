import mongoose from 'mongoose';

const TargetCreationSchema = new mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    salesPersonId: {
        type: String
    },
    products: [{
        productId: {
            type: String
        },
        qtyAssign: {
            type: Number
        },
        price: {
            type: Number
        },
        totalPrice: {
            type: Number
        }
    }],
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    grandTotal: {
        type: Number
    }
}, { timestamps: true });
export const TargetCreation = mongoose.model('targetCreation', TargetCreationSchema);
