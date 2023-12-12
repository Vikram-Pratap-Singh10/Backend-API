import mongoose from "mongoose";
import { StockUpdation } from "../model/stockUpdation.model.js";
import { getStockHierarchy } from "../rolePermission/permission.js";
import { Warehouse } from "../model/warehouse.model.js";

export const viewInWardStockToWarehouse = async (req, res, next) => {
    try {
        const factory = await StockUpdation.find({ warehouseToId: req.params.id }).populate({
            path: 'productItems.productId',
            model: 'product'
        }).populate({ path: "warehouseToId", model: "warehouse" }).exec();
        if (!factory || factory.length === 0) {
            return res.status(404).json({ message: "No factory found", status: false });
        }
        const factoryProductItems = factory.map(factory => {
            const formattedItems = factory.productItems.map(item => ({
                product: item.productId,
                unitType: item.unitType,
                Size: item.Size,
                transferQty: item.transferQty,
                price: item.price,
                totalPrice: item.totalPrice
            }));
            return {
                _id: factory._id,
                stockTransferDate: factory.stockTransferDate,
                warehouseFromId: factory.warehouseFromId,
                grandTotal: factory.grandTotal,
                productItems: formattedItems,
                status: factory.status,
                createdAt: factory.createdAt,
                updatedAt: factory.updatedAt
            };
        });
        return res.status(200).json({ Warehouse: factoryProductItems, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
};

export const viewOutWardStockToWarehouse = async (req, res, next) => {
    try {
        const factory = await StockUpdation.find({ warehouseFromId: req.params.id }).populate({
            path: 'productItems.productId',
            model: 'product'
        }).populate({ path: "warehouseToId", model: "warehouse" }).exec();
        if (!factory || factory.length === 0) {
            return res.status(404).json({ message: "No factory found", status: false });
        }
        const factoryProductItems = factory.map(factory => {
            const formattedItems = factory.productItems.map(item => ({
                product: item.productId,
                unitType: item.unitType,
                Size: item.Size,
                transferQty: item.transferQty,
                price: item.price,
                totalPrice: item.totalPrice
            }));
            return {
                _id: factory._id,
                stockTransferDate: factory.stockTransferDate,
                warehouseFromId: factory.warehouseFromId,
                grandTotal: factory.grandTotal,
                productItems: formattedItems,
                status: factory.status,
                createdAt: factory.createdAt,
                updatedAt: factory.updatedAt
            };
        });
        return res.status(200).json({ Warehouse: factoryProductItems, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
};

export const stockTransferToWarehouse = async (req, res) => {
    try {
        const { warehouseToId, warehouseFromId, stockTransferDate, productItems, grandTotal, status } = req.body;
        for (const item of productItems) {
            const sourceProduct = await Warehouse.findOne({
                _id: warehouseFromId,
                'productItems.productId': item.productId,
            });
            if (sourceProduct) {
                const sourceProductItem = sourceProduct.productItems.find(
                    (pItem) => pItem.productId === item.productId);
                if (sourceProductItem) {
                    sourceProductItem.transferQty -= item.transferQty;
                    sourceProductItem.totalPrice -= item.totalPrice;
                    sourceProduct.markModified('productItems');
                    await sourceProduct.save();
                    const destinationProduct = await Warehouse.findOne({
                        _id: warehouseToId,
                        'productItems.productId': item.productId,
                    });
                    if (destinationProduct) {
                        const destinationProductItem = destinationProduct.productItems.find((pItem) => pItem.productId === item.productId);
                        destinationProductItem.transferQty += item.transferQty;
                        destinationProductItem.totalPrice += item.totalPrice;
                        await destinationProduct.save();
                    } else {
                        await Warehouse.updateOne({ _id: warehouseToId, }, { $push: { productItems: item, }, }, { upsert: true });
                    }
                } else {
                    return res.status(400).json({ error: 'Insufficient quantity in the source warehouse or product not found' });
                }
            } else {
                return res.status(400).json({ error: 'Product not found in the source warehouse' });
            }
        }
        const stockTransfer = new StockUpdation({
            warehouseToId,
            warehouseFromId,
            stockTransferDate,
            productItems,
            grandTotal,
            status,
        });
        await stockTransfer.save();
        return res.status(201).json({ message: 'Stock transfer successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const viewWarehouseStock = async (req, res) => {
    try {
        const userId = req.params.userid;
        const adminDetail = await getStockHierarchy(userId);
        // const warehouse = await StockUpdation.find({ warehouseToId: warehouseId });
        if (adminDetail.length > 0) {
            return res.status(200).json({ Warehouse: adminDetail, status: true });
        } else {
            res.status(404).json({ message: 'Warehouse not found', status: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateWarehousetoWarehouse = async (req, res, next) => {
    try {
        const factoryId = req.params.id
        const { grandTotal, status, stockTransferDate, productItems } = req.body;
        const existingFactory = await StockUpdation.findById(factoryId);
        if (!existingFactory) {
            return res.status(404).json({ message: 'Warehouse not found', status: false });
        }
        const factory = await StockUpdation.findByIdAndUpdate(factoryId, req.body, { new: true })
        // existingWarehouse.grandTotal = grandTotal;
        // existingWarehouse.stockTransferDate = stockTransferDate;
        // existingWarehouse.status = status;
        // existingWarehouse.productItems = productItems;
        // await existingWarehouse.save();
        const warehouseId = existingFactory.warehouseToId;
        const existingWarehouse = await Warehouse.findByIdAndUpdate(warehouseId, req.body, { new: true });
        if (!existingWarehouse) {
            return res.status(404).json({ message: 'Warehouse not found', status: false });
        }
        return res.status(200).json({ Warehouse: existingWarehouse, Factory: factory, status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};



