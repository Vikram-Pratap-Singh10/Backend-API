import axios from "axios";
import { SalesReturn } from "../model/salesReturn.model.js";
import { Order } from "../model/order.model.js";
import { CreditNote } from "../model/creditNote.model.js";

export const PurchaseReturnXml = async (req, res) => {
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

export const viewPurchaseReturn = async (req, res, next) => {
    try {
        const purchaseReturn = await SalesReturn.find().sort({ sortorder: -1 })
        return purchaseReturn ? res.status(200).json({ PurchaseReturn: purchaseReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error:err, status: false })
    }
};
export const deletePurchaseReturn = async (req, res, next) => {
    try {
        const purchaseReturn = await SalesReturn.findByIdAndDelete({ _id: req.params.id })
        return purchaseReturn ? res.status(200).json({ message: "Delete Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
};
export const updatePurchaseReturn = async (req, res, next) => {
    try {
        const purchaseReturnId = req.params.id;
        const existingPurchaseReturn = await SalesReturn.findById(purchaseReturnId);
        if (!existingPurchaseReturn) {
            return res.status(404).json({ message: "PurchaseReturn Not Found", status: false });
        }
        const updatedPurchaseReturn = req.body;
        const updatePurchaseReturn = await SalesReturn.findByIdAndUpdate(purchaseReturnId, updatedPurchaseReturn, { new: true })
        return updatePurchaseReturn ? res.status(200).json({ message: "PurchaseReturn Updated Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
};
export const savePurchaseReturnOrder = async (req, res) => {
    const returnItems = req.body.returnItems;
    const { orderId } = req.body;
    try {
        const promises = returnItems.map(async ({ productId, qty, price }) => {
            const order = await Order.findOne({ _id: orderId });
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            const orderItem = order.orderItem.find(item => item.productId.toString() === productId);
            if (!orderItem) {
                throw new Error(`Product ${productId} not found in order ${orderId}`);
            }
            orderItem.status = 'return';
            await order.save();
        });
        await Promise.all(promises);
        const totalAmount = returnItems.reduce((total, item) => {
            return total + item.qty * item.price;
        }, 0);
        req.body.totalAmount = totalAmount;
        req.body.productItems = returnItems
        await CreditNote.create(req.body)
        const orderReturns = await SalesReturn.create(req.body);
        return res.status(200).json({ message: 'Order returns processed successfully', orderReturns });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};