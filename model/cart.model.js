import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartCatalogue',
    },
    quantity: {
        type: Number,
        default: 1,
    },
});

const userCartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    cartItem: [cartItemSchema],
},{timestamps:true});

export const Cart = mongoose.model('cart', userCartSchema);