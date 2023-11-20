import express from "express";
import { DeleteWarehouse, SaveWarehouse, UpdateWarehouse, ViewWarehouse, WarehouseXml } from "../controller/warehouse.controller.js";

const router = express.Router();

router.get("/get-xml",WarehouseXml);
router.post("/save-warehouse",SaveWarehouse)
router.get("/view-warehouse",ViewWarehouse);
router.get("/delete-warehouse/:id",DeleteWarehouse);
router.post("/update-warehouse/:id",UpdateWarehouse);

export default router;