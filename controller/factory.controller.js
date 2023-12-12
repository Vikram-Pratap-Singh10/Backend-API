import { Factory } from "../model/factory.model.js";
import { StockUpdation } from "../model/stockUpdation.model.js";
import { Warehouse } from "../model/warehouse.model.js";

export const saveFactorytoWarehouse = async (req, res, next) => {
    try {
        const { warehouseToId, grandTotal, status, stockTransferDate, productItems } = req.body;
        const existingWarehouse = await Warehouse.findById(warehouseToId);
        if (!existingWarehouse) {
            return res.status(404).json({ message: 'Warehouse not found', status: false });
        }
        const factory = await Factory.create(req.body);
        const stock = await StockUpdation.create(req.body)
        existingWarehouse.grandTotal = grandTotal;
        existingWarehouse.stockTransferDate = stockTransferDate;
        existingWarehouse.status = status;
        existingWarehouse.exportId = factory._id;
        productItems.forEach(item => {
            existingWarehouse.productItems.push(item);
        });
        await existingWarehouse.save();
        return res.status(200).json({ Factory: factory, Warehouse: existingWarehouse, status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};

export const getFactoryData = async (req, res, next) => {
    try {
        const factory = await Factory.find({}).populate({
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
                warehouseToId: factory.warehouseToId,
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

// export const updateStatus = async (req, res) => {
//     try {
//         const warehouseToId = req.params.id;
//         const { status } = req.body;
//         const order = await Factory.findOne({ warehouseToId: warehouseToId }).sort({ sortorder: -1 });
//         if (!order) {
//             return res.status(404).json({ message: 'Place order not found' });
//         }
//         order.status = status;
//         await order.save();
//         // if (status === 'completed') {
//         //     req.body.totalAmount = order.grandTotal;
//         //     req.body.productItems = order.orderItem;
//         //     req.body.userId = order.userId;
//         //     req.body.orderId = order._id;
//         //     await CreditNote.create(req.body)
//         // }
//         return res.status(200).json({ Order: order, status: true });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error, status: false });
//     }
// }


// export const updateFactoryInWarehouse = async (req, res, next) => {
//     try {
//         const { warehouseToId } = req.params;
//         const { grandTotal, status, stockTransferDate, productItems } = req.body;
//         const existingWarehouse = await Warehouse.findById(warehouseToId);
//         if (!existingWarehouse) {
//             return res.status(404).json({ message: 'Warehouse not found', status: false });
//         }
//         existingWarehouse.grandTotal = grandTotal;
//         existingWarehouse.stockTransferDate = stockTransferDate;
//         existingWarehouse.status = status;
//         existingWarehouse.productItems = productItems;
//         await existingWarehouse.save();

//         return res.status(200).json({ Warehouse: existingWarehouse, status: true });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal Server Error', status: false });
//     }
// };

export const updateFactorytoWarehouse = async (req, res, next) => {
    try {
        const factoryId = req.params.id
        const { grandTotal, status, stockTransferDate, productItems } = req.body;
        const existingFactory = await Factory.findById(factoryId);
        if (!existingFactory) {
            return res.status(404).json({ message: 'Factory not found', status: false });
        }
        const factory = await Factory.findByIdAndUpdate(factoryId, req.body, { new: true })
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
