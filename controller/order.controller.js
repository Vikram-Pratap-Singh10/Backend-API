import axios from "axios";
import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";

export const OrderXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateCustomerConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const placeOrder = async (req, res, next) => {
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
            const order = new Order({
                userId: user._id,
                fullName: req.body.fullName,
                address: req.body.address,
                MobileNo: req.body.MobileNo,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                landMark: req.body.landMark,
                pincode: req.body.pincode,
                grandTotal: req.body.grandTotal,
                discount: req.body.discount,
                shippingCost: req.body.shippingCost,
                taxAmount: req.body.taxAmount,
                status: req.body.status,
                orderItem: orderItems
            });

            const savedOrder = await order.save();
            return res.status(200).json({ orderDetail: savedOrder, status: true });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
export const placeOrderHistoryByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const orders = await Order.find({ userId: userId }).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the user", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                price: item.price
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
export const placeOrderHistory = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                price: item.price
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
        return res.status(500).json({ error: err });
    }
};