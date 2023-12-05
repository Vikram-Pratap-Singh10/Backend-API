import axios from "axios";
import { SalesReturn } from "../model/salesReturn.model.js";
import { Order } from "../model/order.model.js";
import { CreditNote } from "../model/creditNote.model.js";
import { CreateOrder } from "../model/createOrder.model.js";
import { Product } from "../model/product.model.js";

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

export const viewSalesReturn = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.find().sort({ sortorder: -1 }).populate({ path: "returnItems.productId", model: "product" });
        return salesReturn ? res.status(200).json({ SalesReturn: salesReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const viewSalesReturnById = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.find({ orderId: req.params.id }).sort({ sortorder: -1 }).populate({ path: "returnItems.productId", model: "product" });
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
export const updateSalesReturnOrder = async (req, res) => {
    const { salesReturnId } = req.params.id;
    const updateData = req.body;
    try {
        const existingSalesReturn = await SalesReturn.findOne({ _id: salesReturnId });
        if (!existingSalesReturn) {
            return res.status(404).json({ message: `Sales return with ID ${salesReturnId} not found`, status: false });
        }
        const originalReturnItems = existingSalesReturn.productItems;
        const orderId = existingSalesReturn.orderId;
        await SalesReturn.updateOne({ _id: salesReturnId }, { $set: updateData });
        const promises = updateData.productItems.map(async ({ productId, Qty_Return }) => {
            const order = await Order.findOne({ _id: orderId });
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            const orderItem = order.orderItem.find(item => item.productId.toString() === productId);

            if (orderItem) {
                orderItem.qty -= Qty_Return;
                const product = await Product.findOne({ _id: productId });
                if (product) {
                    product.Size += Qty_Return;
                    await product.save();
                }
                await order.save();
            }
        });
        await Promise.all(promises);
        const updatedSalesReturn = await SalesReturn.findOne({ _id: salesReturnId });
        return res.status(200).json({ message: 'Sales return updated successfully', updatedSalesReturn });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
};
export const saveSalesReturnOrder = async (req, res) => {
    const returnItems = req.body.returnItems;
    const { orderId } = req.body;
    try {
        const promises = returnItems.map(async ({ productId, Qty_Return, Qty_Sales, price }) => {
            const product = await Product.findOne({ _id: productId })
            const order = await Order.findOne({ _id: orderId });
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            const orderItem = order.orderItem.find(item => item.productId.toString() === productId);
            if (!orderItem) {
                throw new Error(`Product ${productId} not found in order ${orderId}`);
            }
            if (orderItem.Qty_Sales === 1) {
                product.Size += Qty_Return;
                orderItem.qty -= Qty_Return;
                order.status = "return";
                orderItem.status = 'return';
                await order.save();
            } else {
                product.Size += Qty_Return;
                orderItem.qty -= Qty_Return;
                await order.save();
            }
        });
        await Promise.all(promises);
        const totalAmount = returnItems.reduce((total, item) => {
            return total + item.Qty_Return * item.Product_Price;
        }, 0);
        req.body.totalAmount = totalAmount;
        req.body.productItems = returnItems;
        await CreditNote.create(req.body)
        const salesReturns = await SalesReturn.create(req.body);
        return res.status(200).json({ message: 'Order returns processed successfully', SalesReturn: salesReturns });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
};

export const viewSalesReturnCreateOrder = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.find().sort({ sortorder: -1 }).populate({ path: "returnItems.productId", model: "product" });
        return salesReturn ? res.status(200).json({ SalesReturn: salesReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const viewSalesReturnCreateOrderById = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.find({ orderId: req.params.id }).sort({ sortorder: -1 }).populate({ path: "returnItems.productId", model: "product" });
        return salesReturn ? res.status(200).json({ SalesReturn: salesReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const deleteSalesReturnCreateOrder = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.findByIdAndDelete({ _id: req.params.id })
        return salesReturn ? res.status(200).json({ message: "Delete Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const updateSalesReturnCreateOrder = async (req, res, next) => {
    const { salesReturnId } = req.params.id;
    const updateData = req.body;
    try {
        const existingSalesReturn = await SalesReturn.findOne({ _id: salesReturnId });
        if (!existingSalesReturn) {
            return res.status(404).json({ message: `Sales return with ID ${salesReturnId} not found`, status: false });
        }
        const originalReturnItems = existingSalesReturn.productItems;
        const orderId = existingSalesReturn.orderId;
        await SalesReturn.updateOne({ _id: salesReturnId }, { $set: updateData });
        const promises = updateData.productItems.map(async ({ productId, Qty_Return }) => {
            const order = await CreateOrder.findOne({ _id: orderId });
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            const orderItem = order.orderItem.find(item => item.productId.toString() === productId);

            if (orderItem) {
                orderItem.qty -= Qty_Return;
                const product = await Product.findOne({ _id: productId });
                if (product) {
                    product.Size += Qty_Return;
                    await product.save();
                }
                await order.save();
            }
        });
        await Promise.all(promises);
        const updatedSalesReturn = await SalesReturn.findOne({ _id: salesReturnId });
        return res.status(200).json({ message: 'Sales return updated successfully', updatedSalesReturn });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}
export const saveSalesReturnCreateOrder = async (req, res) => {
    const returnItems = req.body.returnItems;
    const { orderId } = req.body;
    try {
        const promises = returnItems.map(async ({ productId, Qty_Return, Qty_Sales, price }) => {
            const product = await Product.findOne({ _id: productId })
            const order = await CreateOrder.findOne({ _id: orderId });
            if (!order) {
                throw new Error(`Order ${orderId} not found`);
            }
            const orderItem = order.orderItem.find(item => item.productId.toString() === productId);
            if (!orderItem) {
                throw new Error(`Product ${productId} not found in order ${orderId}`);
            }
            if (Qty_Sales === 1) {
                product.Size += Qty_Return;
                orderItem.qty -= Qty_Return;
                order.status = "return";
                orderItem.status = 'return';
                await order.save();
            } else {
                product.Size += Qty_Return;
                orderItem.qty -= Qty_Return;
                await order.save();
            }
        });
        await Promise.all(promises);
        const totalAmount = returnItems.reduce((total, item) => {
            return total + item.Qty_Return * item.Product_Price;
        }, 0);
        req.body.totalAmount = totalAmount;
        req.body.productItems = returnItems;
        await CreditNote.create(req.body)
        const salesReturns = await SalesReturn.create(req.body);
        return res.status(200).json({ message: 'Order returns processed successfully', SalesReturn: salesReturns });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
};