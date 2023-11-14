import { Cart } from "../model/cart.model.js";
import { PartCatalogue } from "../model/part.model.js";

export const AddToCart = async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: userId });
        const product = await PartCatalogue.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', status: false });
        }
        if (product.Part_Qty < quantity) {
            return res.status(400).json({ message: 'Insufficient Only' + " " + product.Part_Qty + " " + 'Quantity Available', status: false });
        }
        if (cart) {
            let cartItemsList = cart.cartItem;
            let index = cartItemsList.findIndex((item) => item.productId == productId)
            if (index != -1) {
                cartItemsList[index].quantity = (quantity);
                cart.markModified('cartItem');
                await cart.save();
                return res.status(200).json({ message: "This Item already added in cart", status: true })
            }
            else {
                cart.cartItem.push({ productId: productId, quantity: quantity });
                await cart.save({});
                return res.status(200).json({ message: "Item added successfully", status: true });
            }
        }
        else {
            await Cart.create({
                userId: userId,
                cartItem: [{ productId: productId, quantity: quantity }]
            });
            return res.status(200).json({ message: "Item added successfully", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewCartItems = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', status: false });
        }
        const cartItems = await Promise.all(
            cart.cartItem.map(async (item) => {
                const product = await PartCatalogue.findById(item.productId);
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    product: product,
                };
            })
        );
        return res.status(200).json({ cart: cartItems, status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
}
export const removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', status: false });
        }
        const indexToRemove = cart.cartItem.findIndex((item) => item.productId == productId);
        if (indexToRemove === -1) {
            return res.status(404).json({ message: 'Product not found in the cart', status: false });
        }
        cart.cartItem.splice(indexToRemove, 1);
        await cart.save();
        return res.status(200).json({ message: 'Product removed from the cart', status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
}
export const removeCart = async (req, res, next) => {
    try {
        const cart = await Cart.findByIdAndDelete({ _id: req.params.id })
        return (cart) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}