import { Factory } from "../model/factory.model.js";
import { StockUpdation } from "../model/stockUpdation.model.js";

export const saveFactorytoWarehouse = async (req, res, next) => {
    try {
        const factory = await Factory.create(req.body)
        const stockUpdation = await StockUpdation.create(req.body)
        return (factory && stockUpdation) ? res.status(200).json({ Factory: factory, stockUpdation, status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return req.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const getFactoryData = async (req, res, next) => {
    try {
        const factory = await Factory.find({}).populate({
            path: 'productItems.productId',
            model: 'product'
        }).exec();
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
        return res.status(200).json({ Factory: factoryProductItems, status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
};