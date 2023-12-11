import express from "express";
import { stockTransferToWarehouse, viewWarehouse, viewWarehouseStock } from "../controller/stockUpdation.controller.js";

const router = express.Router();

router.post("/stock-transfer-warehouse", stockTransferToWarehouse)
router.get("/view-warehouse-stock", viewWarehouse)

router.get("/view-warehouse-stock/:userid/:id", viewWarehouseStock)

export default router;