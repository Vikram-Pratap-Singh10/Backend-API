import axios from "axios";
import { Warehouse } from "../model/warehouse.model.js";
import { getWarehouseHierarchy } from "../rolePermission/permission.js";
import { Factory } from "../model/factory.model.js";

export const WarehouseXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/Warehouse.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveWarehouse = async (req, res, next) => {
    try {
        const warehouse = await Warehouse.create(req.body)
        return warehouse ? res.status(200).json({ message: "Data Save Successfully", Warehouse: warehouse, status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const ViewWarehouse = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const adminDetail = await getWarehouseHierarchy(userId);
        // const adminDetail = adminDetails.length === 1 ? adminDetails[0] : adminDetails;
        let warehouse = await Warehouse.find().sort({ sortorder: -1 })
        return warehouse ? res.status(200).json({ Warehouse: adminDetail, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const ViewWarehouseList = async (req, res, next) => {
    try {
        let warehouse = await Warehouse.find().sort({ sortorder: -1 })
        return warehouse ? res.status(200).json({ Warehouse: warehouse, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const ViewWarehouseById = async (req, res, next) => {
    try {
        let warehouse = await Warehouse.findById({ _id: req.params.id }).sort({ sortorder: -1 }).populate({
            path: 'productItems.productId',
            model: 'product'
        })
        return warehouse ? res.status(200).json({ Warehouse: warehouse, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const DeleteWarehouse = async (req, res, next) => {
    try {
        const warehouse = await Warehouse.findByIdAndDelete({ _id: req.params.id })
        return (warehouse) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const UpdateWarehouse = async (req, res, next) => {
    try {
        const warehouseId = req.params.id;
        const existingWarehouse = await Warehouse.findById(warehouseId);
        if (!existingWarehouse) {
            return res.status(404).json({ error: 'warehouse not found', status: false });
        }
        else {
            const updatedWarehouse = req.body;
            await Warehouse.findByIdAndUpdate(warehouseId, updatedWarehouse, { new: true });
            return res.status(200).json({ message: 'Warehouse Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};

export const getWarehouseData = async (req, res, next) => {
    try {
        const factory = await Factory.find({ warehouseToId: req.params.id }).populate({
            path: 'productItems.productId',
            model: 'product'
        }).populate({ path: "warehouseToId", model: "warehouse" }).exec();
        if (!factory || factory.length === 0) {
            return res.status(404).json({ message: "No Warehouse found", status: false });
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