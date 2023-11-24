import axios from "axios";
import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";

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
        const account = await User.findOne({ _id: req.body.userId });
        if (!account) {
            return res.status(401).json({ message: "No user found", status: false });
        } else {
            const billAmount = orderItems.reduce((total, orderItem) => {
                return total + (orderItem.price * orderItem.quantity);
            }, 0);
            const order = new Order({
                userId: account._id,
                fullName: req.body.fullName,
                address: req.body.address,
                MobileNo: req.body.MobileNo,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                landMark: req.body.landMark,
                pincode: req.body.pincode,
                grandTotal: req.body.grandTotal,
                discount:req.body.discount,
                shippingCost: req.body.shippingCost,
                taxAmount: req.body.taxAmount,
                orderItem: orderItems,
            });
            const savedOrder = await order.save();
            return res.status(200).json({ orderDetail: savedOrder, status: true });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err });
    }
};
export const orderHistoryByUserId = async (req, res, next) => {
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
                quantity: item.quantity,
                price:item.price
            }));
            return {
                _id: order._id,
                userId: order.userId,
                fullName: order.fullName,
                address: order.address,
                MobileNo: order.MobileNo,
                alternateMobileNo: order.alternateMobileNo,
                country: order.country,
                state: order.state,
                city: order.city,
                landMark: order.landMark,
                pincode: order.pincode,
                grandTotal: order.grandTotal,
                shippingAmount: order.shippingAmount,
                taxAmount: order.taxAmount,
                currency: order.currency,
                paymentId: order.paymentId,
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
export const orderHistory = async (req, res, next) => {
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