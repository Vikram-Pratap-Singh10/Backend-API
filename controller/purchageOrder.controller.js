import { Product } from "../model/product.model.js";
import { PurchaseOrder } from "../model/purchaseOrder.model.js";
import { User } from "../model/user.model.js";

export const purchaseOrder = async (req, res, next) => {
    try {
        const orderItems = req.body.orderItems;
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(401).json({ message: "No user found", status: false });
        } else {
            const billAmount = orderItems.reduce((total, orderItem) => {
                return total + (orderItem.price * orderItem.quantity);
            }, 0);
            for (const orderItem of orderItems) {
                const product = await Product.findOne({ _id: orderItem.productId });
                if (product) {
                    product.Size -= orderItem.qty;
                    await product.save();
                } else {
                    console.error(`Product with ID ${orderItem.productId} not found`);
                }
            }
            req.body.userId = user._id;
            const order = await PurchaseOrder.create(req.body)
            return order ? res.status(200).json({ orderDetail: order, status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
        }
    }
    catch (err) {
        console.log(err);
        return req.status(500).json({ error: err, status: false })
    }
};
export const purchaseOrderHistoryByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const orders = await PurchaseOrder.find({ userId: userId }).populate({
            path: 'orderItems.productId',
            model: 'product'
        }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the user", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItems.map(item => ({
                product: item.productId,
                qty: item.qty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                fullName: order.fullName,
                address: order.address,
                MobileNo: order.MobileNo,
                country: order.country,
                state: order.state,
                city: order.city,
                landMark: order.landMark,
                pincode: order.pincode,
                grandTotal: order.grandTotal,
                discount: order.discount,
                shippingCost: order.shippingCost,
                taxAmount: order.taxAmount,
                orderItems: formattedOrderItems,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });
        return res.status(200).json({ orderHistory: formattedOrders, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
export const purchaseOrderHistory = async (req, res, next) => {
    try {
        const orders = await PurchaseOrder.find({}).populate({
            path: 'orderItems.productId',
            model: 'product'
        }).exec();
        console.log(orders)
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItems.map(item => ({
                product: item.productId,
                qty: item.qty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                fullName: order.fullName,
                address: order.address,
                MobileNo: order.MobileNo,
                country: order.country,
                state: order.state,
                city: order.city,
                landMark: order.landMark,
                pincode: order.pincode,
                grandTotal: order.grandTotal,
                discount: order.discount,
                shippingCost: order.shippingCost,
                taxAmount: order.taxAmount,
                status: order.status,
                orderItems: formattedOrderItems,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });
        return res.status(200).json({ orderHistory: formattedOrders, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
};