import express from "express";
import { stockTransferToWarehouse, updateWarehousetoWarehouse, viewInWardStockToWarehouse, viewOutWardStockToWarehouse, viewWarehouseStock } from "../controller/stockUpdation.controller.js";

const router = express.Router();

router.post("/stock-transfer-warehouse", stockTransferToWarehouse)
router.get("/view-in-ward-stock/:id", viewInWardStockToWarehouse)
router.get("/view-out-ward-stock/:id", viewOutWardStockToWarehouse)

router.get("/view-warehouse-stock/:id", viewWarehouseStock)
router.put("/update-warehoue-to-warehouse/:id", updateWarehousetoWarehouse)

export default router;