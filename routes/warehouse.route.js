import express from "express";
import { DeleteWarehouse, SaveWarehouse, UpdateWarehouse, ViewWarehouse, ViewWarehouseById, ViewWarehouseList, WarehouseXml, getWarehouseData } from "../controller/warehouse.controller.js";

const router = express.Router();

router.get("/get-xml", WarehouseXml);
router.post("/save-warehouse", SaveWarehouse);
router.get("/view-warehouse/:id", ViewWarehouse);
router.get("/view-warehouse-by-id/:id", ViewWarehouseById);
router.get("/view-warehouse-list", ViewWarehouseList);
router.get("/delete-warehouse/:id", DeleteWarehouse);
router.post("/update-warehouse/:id", UpdateWarehouse);

router.get("/view-warehouse-stock/:id", getWarehouseData)

export default router;