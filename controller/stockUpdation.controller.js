import mongoose from "mongoose";
import { StockUpdation } from "../model/stockUpdation.model.js";
import { getStockHierarchy } from "../rolePermission/permission.js";

export const viewWarehouse = async (req, res, next) => {
    try {
        const factory = await StockUpdation.find({}).populate({
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
        return res.status(200).json({ StockUpdation: factoryProductItems, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
};
export const stockTransferToWarehouse = async (req, res) => {
    try {
        const { warehouseToId, warehouseFromId, stockTransferDate, productItems, grandTotal, status } = req.body;
        for (const item of productItems) {
            const sourceProduct = await StockUpdation.findOne({
                warehouseToId: warehouseFromId,
                'productItems.productId': item.productId,
            });
            if (sourceProduct) {
                const sourceProductItem = sourceProduct.productItems.find(
                    (pItem) => pItem.productId.equals(new mongoose.Types.ObjectId(item.productId))
                );
                if (sourceProductItem) {
                    sourceProductItem.transferQty -= item.transferQty;
                    sourceProductItem.totalPrice -= item.totalPrice;
                    sourceProduct.markModified('productItems');

                    await sourceProduct.save();

                    const destinationProduct = await StockUpdation.findOne({
                        warehouseToId,
                        'productItems.productId': item.productId,
                    });

                    if (destinationProduct) {
                        const destinationProductItem = destinationProduct.productItems.find((pItem) => pItem.productId.equals(new mongoose.Types.ObjectId(item.productId))
                        );

                        destinationProductItem.transferQty += item.transferQty;
                        destinationProductItem.totalPrice += item.totalPrice;

                        await destinationProduct.save();
                    } else {
                        await StockUpdation.updateOne(
                            {
                                warehouseToId,
                            },
                            {
                                $push: {
                                    productItems: item,
                                },
                            },
                            { upsert: true }
                        );
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
        res.status(201).json({ message: 'Stock transfer successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const viewWarehouseStock = async (req, res) => {
    const warehouseId = req.params.id;
    try {
        const userId = req.params.userid;
        const adminDetail = await getStockHierarchy(userId);
        // const warehouse = await StockUpdation.find({ warehouseToId: warehouseId });
        if (adminDetail.length>0) {
            return res.status(200).json({ Warehouse: adminDetail, status: true });
        } else {
            res.status(404).json({ message: 'Warehouse not found', status: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



