import axios from "axios";
import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";
import { CreateOrder } from "../model/createOrder.model.js";
import { findUserDetails, getUserHierarchy } from "../rolePermission/permission.js";
import { CreditNote } from "../model/creditNote.model.js";

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
                return total + (orderItem.price * orderItem.qty);
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
                partyId: req.body.partyId,
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                currentAddress: req.body.currentAddress,
                orderItem: orderItems
            });
            const savedOrder = await order.save();
            // req.body.orderId = savedOrder._id;
            // req.body.totalAmount = billAmount;
            // req.body.productItems = orderItems;
            // await CreditNote.create(req.body)
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
        // const userHierarchy = await findUserDetails(userId);
        // const adminDetail = (userHierarchy[userHierarchy.length - 1])
        const orders = await Order.find({ userId: userId }).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).populate({ path: "partyId", model: "party" }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the user", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                unitQty: item.unitQty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                partyId: order.partyId,
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
                // adminDetail: adminDetail,
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
        const userId = req.params.id;
        const userHierarchy = await findUserDetails(userId);
        const adminDetail = (userHierarchy[userHierarchy.length - 1])
        const orders = await Order.find({}).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).populate({ path: "partyId", model: "party" }).exec();
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                unitQty: item.unitQty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                partyId: order.partyId,
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                currentAddress: req.body.currentAddress,
                orderItems: formattedOrderItems,
                adminDetail: adminDetail,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });
        return res.status(200).json({ orderHistory: formattedOrders, adminDetail, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
export const updatePlaceOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        req.body.orderItem = req.body.orderItems
        const updatedFields = req.body;
        if (!orderId || !updatedFields) {
            return res.status(400).json({ message: "Invalid input data", status: false });
        }
        const order = await Order.findById({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        else if (order.status === 'completed')
            return res.status(400).json({ message: "this order not updated", status: false })
        const oldOrderItems = order.orderItem || [];
        const newOrderItems = updatedFields.orderItem || [];
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
export const updatePlaceOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await Order.findById({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Place order not found' });
        }
        order.status = status;
        await order.save();
        // if (status === 'completed') {
        //     req.body.totalAmount = order.grandTotal;
        //     req.body.productItems = order.orderItem;
        //     req.body.userId = order.userId;
        //     req.body.orderId = order._id;
        //     await CreditNote.create(req.body)
        // }
        return res.status(200).json({ Order: order, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}

export const createOrder = async (req, res, next) => {
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
                    console.error(`Product with ID ${orderItem.productId} not found`);
                }
            }
            const order = new CreateOrder({
                userId: user._id,
                fullName: req.body.fullName,
                partyId: req.body.partyId,
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                currentAddress: req.body.currentAddress,
                status: req.body.status,
                orderItem: orderItems
            });
            const savedOrder = await order.save();
            // req.body.totalAmount = billAmount;
            // req.body.productItems = orderItems;
            // await CreditNote.create(req.body)
            return res.status(200).json({ orderDetail: savedOrder, status: true });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
export const createOrderHistoryByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // const userHierarchy = await findUserDetails(userId);
        // const adminDetail = (userHierarchy[userHierarchy.length - 1])
        const orders = await CreateOrder.find({ userId: userId }).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).populate({ path: "partyId", model: "party" }).exec();
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the user", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                unitQty: item.unitQty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                fullName: order.fullName,
                partyId: order.partyId,
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
                // adminDetail: adminDetail,
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
export const createOrderHistory = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userHierarchy = await findUserDetails(userId);
        const adminDetail = (userHierarchy[userHierarchy.length - 1])
        const orders = await CreateOrder.find({}).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).populate({ path: "partyId", model: "party" }).exec();
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                unitQty: item.unitQty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                fullName: order.fullName,
                partyId: order.partyId,
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
        return res.status(500).json({ error: err });
    }
};
export const updateCreateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await CreateOrder.findById({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'sales order not found' });
        }
        order.status = status;
        await order.save();
        // if (status === 'completed') {
        //     req.body.totalAmount = order.grandTotal;
        //     req.body.productItems = order.orderItem;
        //     req.body.userId = order.userId;
        //     req.body.orderId = order._id;
        //     await CreditNote.create(req.body)
        // }
        return res.status(200).json({ Order: order, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
};
export const updateCreateOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        req.body.orderItem = req.body.orderItems
        const updatedFields = req.body;
        if (!orderId || !updatedFields) {
            return res.status(400).json({ message: "Invalid input data", status: false });
        }
        const order = await CreateOrder.findById({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        else if (order.status === 'completed')
            return res.status(400).json({ message: "this order not updated", status: false })
        const oldOrderItems = order.orderItem || [];
        const newOrderItems = updatedFields.orderItem || [];
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

export const autoBillingLock = async (req, res, next) => {
    try {
        const order = await Order.find({ userId: req.params.id })
        const orders = await order[order.length - 1];
        const time1 = await new Date(order[order.length - 1].createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate - time1;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        if (days >= 15) {
            orders.status = "locked";
            await order.save();
            return console.log("right")
        }
        console.log("all right")
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}

export const SalesOrderList = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userHierarchy = await findUserDetails(userId);
        const adminDetail = (userHierarchy[userHierarchy.length - 1])
        const orders = await Order.find({}).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).populate({ path: "partyId", model: "party" }).exec();
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                unitQty: item.unitQty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                partyId: order.partyId,
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                currentAddress: req.body.currentAddress,
                orderItems: formattedOrderItems,
                adminDetail: adminDetail,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });
        const createOrder = await CreateOrder.find({}).populate({
            path: 'orderItem.productId',
            model: 'product'
        }).populate({ path: "partyId", model: "party" }).exec();
        if (!createOrder || createOrder.length === 0) {
            return res.status(404).json({ message: "No orders found", status: false });
        }
        const Orders = createOrder.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                qty: item.qty,
                unitQty: item.unitQty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                partyId: order.partyId,
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                currentAddress: req.body.currentAddress,
                orderItems: formattedOrderItems,
                adminDetail: adminDetail,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });
        const ordersDetails = await formattedOrders.concat(Orders)
        return res.status(200).json({ orderHistory: ordersDetails, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};