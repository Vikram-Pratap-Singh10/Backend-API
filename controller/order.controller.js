import ExcelJS from 'exceljs'
import axios from 'axios';
import Razorpay from "razorpay";
import shortid from "shortid";
import { deliveryAddress } from '../model/deliveryAddress.model.js';
import { AccountCreate } from '../model/createAccount.model.js';
import { Order } from '../model/shoppingOrder.model.js';

export const orderXml = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/CreateOrderConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveOrders = async (req, res) => {
    try {
        const partType = req.body.partType;
        if (partType === 'Orders') {
            const filePath = await req.file.path;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(1);
            const headerRow = worksheet.getRow(1);
            const headings = [];
            headerRow.eachCell((cell) => {
                headings.push(cell.value);
            });
            const insertedDocuments = [];
            const existingParts = [];
            for (let rowIndex = 2; rowIndex <= worksheet.actualRowCount; rowIndex++) {
                const dataRow = worksheet.getRow(rowIndex);
                const document = {};
                for (let columnIndex = 1; columnIndex <= headings.length; columnIndex++) {
                    const heading = headings[columnIndex - 1];
                    const cellValue = dataRow.getCell(columnIndex).value;
                    document[heading] = cellValue;
                }
                const existingRecord = await Order.findOne({
                    Part_Number: document.Part_Number,
                });
                if (!existingRecord) {
                    const insertedDocument = await Order.create(document);
                    insertedDocuments.push(insertedDocument);
                } else {
                    existingParts.push(document.Part_Number);
                }
            }
            let message = 'Data Inserted Successfully';
            if (existingParts.length > 0) {
                message = `Some orders already exist: ${existingParts.join(', ')}`;
            }
            return res.status(200).json({ message, status: true });
        }
        else {
            return res.status(400).json({ error: "Bad Request", status: false });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
}
export const viewOrders = async (req, res, next) => {
    try {
        let orders = await Order.find();
        return (orders.length > 0) ? res.status(200).json({ Order: orders, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};

export const razorpay = new Razorpay({
    key_id: "rzp_test_Vhg1kq9b86udsY",
    key_secret: "JqBlqFSxkpviUc6CUR8BcmOt"
});

export const payment = async (req, res) => {
    const payment_capture = 1;
    const amount = req.body.totalBill;
    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };
    try {
        const response = await razorpay.orders.create(options);
        res.json({ id: response.id, currency: response.currency, amount: response.amount });
    } catch (error) {
        console.log(error);
    }
}
export const placeOrder = async (req, res, next) => {
    try {
        const orderItems = req.body.orderItems;
        const account = await AccountCreate.findOne({ _id: req.body.userId });
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
                alternateMobileNo: req.body.alternateMobileNo,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                landMark: req.body.landMark,
                pincode: req.body.pincode,
                grandTotal: req.body.grandTotal,
                shippingAmount: req.body.shippingAmount,
                taxAmount: req.body.taxAmount,
                currency: req.body.currency,
                paymentId: req.body.paymentId,
                orderItem: orderItems,
            });
            const savedOrder = await order.save();
            const address = await deliveryAddress.create({ userId: req.body.userId, address: req.body.DeliveryAddress })
            return res.status(200).json({ orderdetail: savedOrder, status: true });
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
            model: 'PartCatalogue'
        }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the user", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                quantity: item.quantity
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
            model: 'PartCatalogue'
        }).exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found", status: false });
        }
        const formattedOrders = orders.map(order => {
            const formattedOrderItems = order.orderItem.map(item => ({
                product: item.productId,
                quantity: item.quantity
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
