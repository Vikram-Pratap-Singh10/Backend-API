import mongoose from "mongoose";
import { StockUpdation } from "../model/stockUpdation.model.js";
import { getStockHierarchy } from "../rolePermission/permission.js";
import { User } from "../model/user.model.js";
import { Factory } from "../model/factory.model.js";

export const viewInWardStockToWarehouse = async (req, res, next) => {
    try {
        const factory = await StockUpdation.find({ warehouseToId: req.params.id }).populate({
            path: 'productItems.productId',
            model: 'product'
        }).populate({ path: "warehouseFromId", model: "user" }).populate({ path: "warehouseToId", model: "user" }).exec();
        if (!factory || factory.length === 0) {
            return res.status(404).json({ message: "No warehouse found", status: false });
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
                warehouseToId: factory.warehouseToId,
                grandTotal: factory.grandTotal,
                productItems: formattedItems,
                transferStatus: factory.transferStatus,
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
        }).populate({ path: "warehouseToId", model: "user" }).populate({ path: "warehouseFromId", model: "user" }).exec();
        if (!factory || factory.length === 0) {
            return res.status(404).json({ message: "No warehouse found", status: false });
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
                warehouseToId: factory.warehouseToId,
                grandTotal: factory.grandTotal,
                productItems: formattedItems,
                transferStatus: factory.transferStatus,
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
        const { warehouseToId, warehouseFromId, stockTransferDate, productItems, grandTotal, transferStatus } = req.body;
        for (const item of productItems) {
            const sourceProduct = await User.findOne({
                _id: warehouseFromId,
                'productItems.productId': item.productId,
            });
            if (sourceProduct) {
                const sourceProductItem = sourceProduct.productItems.find(
                    (pItem) => pItem.productId === item.productId);
                if (sourceProductItem) {
                    sourceProductItem.Size -= item.Size;
                    sourceProductItem.currentStock -= (item.transferQty * item.Size);
                    sourceProductItem.totalPrice -= item.totalPrice;
                    sourceProduct.markModified('productItems');
                    await sourceProduct.save();
                    const destinationProduct = await User.findOne({
                        _id: warehouseToId,
                        'productItems.productId': item.productId,
                    });
                    if (destinationProduct) {
                        const destinationProductItem = destinationProduct.productItems.find((pItem) => pItem.productId === item.productId);
                        destinationProductItem.Size += item.Size;
                        sourceProductItem.currentStock += (item.transferQty * item.Size);
                        destinationProductItem.totalPrice += item.totalPrice;
                        await destinationProduct.save();
                    } else {
                        await User.updateOne({ _id: warehouseToId },
                            {
                                $push: { productItems: item },
                                $set: {
                                    stockTransferDate: stockTransferDate,
                                    transferStatus: transferStatus,
                                    grandTotal: grandTotal,
                                    warehouseFromId: warehouseFromId
                                }
                            },
                            { upsert: true });
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
            transferStatus,
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
        console.log(adminDetail)
        // const warehouse = await StockUpdation.find({}).sort({ sortorder: -1 });
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
        const { grandTotal, transferStatus, stockTransferDate, productItems } = req.body;
        const existingFactory = await StockUpdation.findById(factoryId);
        if (!existingFactory) {
            return res.status(404).json({ message: 'Warehouse not found', status: false });
        }
        const factory = await StockUpdation.findByIdAndUpdate(factoryId, req.body, { new: true })
        if (existingFactory.exportId) {
            const id = await existingFactory.exportId;
            await Factory.findByIdAndUpdate(id, req.body, { new: true })
        }
        // existingWarehouse.grandTotal = grandTotal;
        // existingWarehouse.stockTransferDate = stockTransferDate;
        // existingWarehouse.status = status;
        // existingWarehouse.productItems = productItems;
        // await existingWarehouse.save();
        const warehouseId = existingFactory.warehouseToId;
        const existingWarehouse = await User.findByIdAndUpdate(warehouseId, req.body, { new: true });
        if (!existingWarehouse) {
            return res.status(404).json({ message: 'Warehouse not found', status: false });
        }
        return res.status(200).json({ Warehouse: existingWarehouse, Factory: factory, status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
export const viewProductInWarehouse = async (req, res, next) => {
    try {
        const warehouse = await User.findById(req.params.id).populate({ path: "productItems.productId", model: "product" });
        if (!warehouse) {
            return res.status(400).json({ message: "Not Found", status: true });
        }
        const productDetails = warehouse.productItems.map(item => {
            return {
                productId: item.productId._id,
                created_by: item.productId.created_by,
                Product_Title: item.productId.Product_Title,
                Size: item.productId.Size,
                discount: item.productId.discount,
                HSN_Code: item.productId.HSN_Code,
                'GST Rate': item.productId['GST Rate'],
                Product_Desc: item.productId.Product_Desc,
                Product_MRP: item.productId.Product_MRP,
                MIN_stockalert: item.productId.MIN_stockalert,
                category: item.productId.category,
                SubCategory: item.productId.SubCategory,
                Unit: item.productId.Unit,
                Warehouse_name: item.productId.Warehouse_name,
                createdAt: item.productId.createdAt,
                updatedAt: item.productId.updatedAt,
                unitType: item.unitType,
                transferQty: item.transferQty,
                price: item.price,
                totalPrice: item.totalPrice,
                _id: item._id
            };
        });
        return res.status(200).json(productDetails);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}

