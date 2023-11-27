import axios from "axios";
import { SalesReturn } from "../model/salesReturn.model.js";
import { Order } from "../model/order.model.js";

export const SalesReturnXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/SalesReturn.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveSalesReturnOrder = async (req, res, next) => {
    const { orderId, productId } = req.body;
    try {
        const order = await Order.findOne({ _id: orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const orderItem = order.orderItem.find(item => item.productId.toString() === productId);
        if (!orderItem) {
            return res.status(404).json({ message: 'Product not found in the order' });
        }
        orderItem.status = 'return';
        const updatedOrder = await order.save();
        const orderReturn = new SalesReturn(req.body);
        await orderReturn.save();
        return res.status(200).json({ message: 'Order return processed successfully', updatedOrder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const viewSalesReturn = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.find().sort({ sortorder: -1 })
        return salesReturn ? res.status(200).json({ SalesReturn: salesReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const deleteSalesReturn = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.findByIdAndDelete({ _id: req.params.id })
        return salesReturn ? res.status(200).json({ message: "Delete Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const updateSalesReturn = async (req, res, next) => {
    try {
        const salesReturnId = req.params.id;
        const existingSalesReturn = await SalesReturn.findById(salesReturnId);
        if (!existingSalesReturn) {
            return res.status(404).json({ message: "SalesReturn Not Found", status: false });
        }
        const updatedSalesReturn = req.body;
        const updateSalesReturn = await SalesReturn.findByIdAndUpdate(salesReturnId, updatedSalesReturn, { new: true })
        return updateSalesReturn ? res.status(200).json({ message: "SalesReturn Updated Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
// export const saveSalesReturnOrder = async (req, res) => {
//     const returnItems = req.body.returnItems;
//     const { orderId } = req.body;
//     try {
//         const promises = returnItems.map(async ({ productId }) => {
//             const order = await Order.findOne({ _id: orderId });
//             if (!order) {
//                 throw new Error(`Order ${orderId} not found`);
//             }
//             const orderItem = order.orderItem.find(item => item.productId.toString() === productId);
//             if (!orderItem) {
//                 throw new Error(`Product ${productId} not found in order ${orderId}`);
//             }
//             orderItem.status = 'return';
//             const updatedOrder = await order.save();
//         });
//         await Promise.all(promises);
//         const orderReturns = await SalesReturn.create(req.body);
//         return res.status(200).json({ message: 'Order returns processed successfully', orderReturns });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };