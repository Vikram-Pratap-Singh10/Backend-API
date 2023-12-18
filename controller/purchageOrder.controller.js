import mongoose from "mongoose";
import { Product } from "../model/product.model.js";
import { PurchaseOrder } from "../model/purchaseOrder.model.js";
import { User } from "../model/user.model.js";
import { DebitNote } from "../model/debitNote.model.js";
import { findUserDetails } from "../rolePermission/permission.js";

export const purchaseOrder = async (req, res, next) => {
    try {
        const orderItems = req.body.orderItems;
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(401).json({ message: "No user found", status: false });
        } else {
            const billAmount = orderItems.reduce((total, orderItem) => {
                return total + (orderItem.price * orderItem.qty);
            }, 0);
            for (const orderItem of orderItems) {
                const product = await Product.findOne({ _id: orderItem.productId });
                if (product) {
                    product.Size -= orderItem.qty;
                    await product.save();
                } else {
                    return res.status(404).json(`Product with ID ${orderItem.productId} not found`);
                }
            }
            req.body.userId = user._id;
            const order = await PurchaseOrder.create(req.body)
            req.body.purchaseOrderId = await order._id;
            req.body.totalAmount = billAmount;
            req.body.productItems = orderItems;
            await DebitNote.create(req.body)
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                currentAddress: req.body.currentAddress,
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
        const userId = req.params.id;
        const userHierarchy = await findUserDetails(userId);
        const adminDetail = (userHierarchy[userHierarchy.length - 1])
        const orders = await PurchaseOrder.find({}).populate({
            path: 'orderItems.productId',
            model: 'product'
        }).exec();
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                currentAddress: req.body.currentAddress,
                status: order.status,
                orderItems: formattedOrderItems,
                adminDetail: adminDetail,
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
export const updatePurchaseOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await PurchaseOrder.findById({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }
        order.status = status;
        await order.save();
        // if (status === 'completed') {
        //     req.body.totalAmount = order.grandTotal;
        //     req.body.productItems = order.orderItems;
        //     req.body.userId = order.userId;
        //     req.body.orderId = order._id;
        //     await DebitNote.create(req.body)
        // }
        return res.status(200).json({ Order: order, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}
export const updatePurchaseOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        req.body.orderItem = req.body.orderItems
        const updatedFields = req.body;
        if (!orderId || !updatedFields) {
            return res.status(400).json({ message: "Invalid input data", status: false });
        }
        const order = await PurchaseOrder.findById({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        else if (order.status === 'completed')
            return res.status(400).json({ message: "this order not updated", status: false })
        const oldOrderItems = order.orderItems || [];
        const newOrderItems = updatedFields.orderItems || [];
        for (const newOrderItem of newOrderItems) {
            const oldOrderItem = oldOrderItems.find(item => item.productId.toString() === newOrderItem.productId.toString());
            if (oldOrderItem) {
                const quantityChange = newOrderItem.qty - oldOrderItem.qty;
                if (quantityChange !== 0) {
                    const product = await Product.findById({ _id: newOrderItem.productId });
                    if (product) {
                        product.Size -= quantityChange;
                        await product.save();
                    } else {
                        console.error(`Product with ID ${newOrderItem.productId} not found`);
                    }
                }
            }
        }
        Object.assign(order, updatedFields);
        const updatedOrder = await order.save();
        return res.status(200).json({ orderDetail: updatedOrder, status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};