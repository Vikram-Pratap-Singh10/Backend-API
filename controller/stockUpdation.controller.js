import { StockUpdation } from "../model/stockUpdation.model.js";

export const viewWarehouse = async (req, res, next) => {
    try {
        const factory = await StockUpdation.find({}).populate({
            path: 'productItems.productId',
            model: 'product'
        }).populate({ path: "warehouseFromId", model: "warehouse" }).exec();
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