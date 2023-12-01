import axios from "axios";
import { PurchaseOrder } from "../model/purchaseOrder.model.js";
import { PurchaseReturn } from "../model/purchaseReturn.model.js";
import { DebitNote } from "../model/debitNote.model.js";

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
        const purchaseReturn = await PurchaseReturn.find().sort({ sortorder: -1 }).populate({ path: "returnItems.productId", model: "product" });
        return purchaseReturn ? res.status(200).json({ PurchaseReturn: purchaseReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
};
export const viewPurchaseReturnByUserId = async (req, res, next) => {
    try {
        const purchaseReturn = await PurchaseReturn.find({ userId: req.params.id }).sort({ sortorder: -1 }).populate({ path: "returnItems.productId", model: "product" });
        return purchaseReturn ? res.status(200).json({ PurchaseReturn: purchaseReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
};
export const deletePurchaseReturn = async (req, res, next) => {
    try {
        const purchaseReturn = await PurchaseReturn.findByIdAndDelete({ _id: req.params.id })
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
        const existingPurchaseReturn = await PurchaseReturn.findById(purchaseReturnId);
        if (!existingPurchaseReturn) {
            return res.status(404).json({ message: "PurchaseReturn Not Found", status: false });
        }
        const updatedPurchaseReturn = req.body;
        const updatePurchaseReturn = await PurchaseReturn.findByIdAndUpdate(purchaseReturnId, updatedPurchaseReturn, { new: true })
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
            const order = await PurchaseOrder.findOne({ _id: orderId });
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            const orderItem = order.orderItems.find(item => item.productId.toString() === productId);
            if (!orderItem) {
                throw new Error(`Product ${productId} not found in order ${orderId}`);
            }
            orderItem.status = 'return';
            await order.save();
        });
        await Promise.all(promises);
        const totalAmount = returnItems.reduce((total, item) => {
            return total + item.Qty_Return * item.Product_Price;
        }, 0);
        req.body.totalAmount = totalAmount;
        req.body.productItems = returnItems;
        await DebitNote.create(req.body)
        const orderReturns = await PurchaseReturn.create(req.body);
        return res.status(200).json({ message: 'Purchase Order returns processed successfully', orderReturns });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};