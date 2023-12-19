import express from "express";
import { stockTransferToWarehouse, updateWarehousetoWarehouse, viewInWardStockToWarehouse, viewOutWardStockToWarehouse, viewProductInWarehouse, viewWarehouseStock } from "../controller/stockUpdation.controller.js";

const router = express.Router();

router.post("/stock-transfer-warehouse", stockTransferToWarehouse)
router.get("/view-in-ward-stock/:id", viewInWardStockToWarehouse)
router.get("/view-out-ward-stock/:id", viewOutWardStockToWarehouse)

router.get("/view-warehouse-stock/:id", viewWarehouseStock)
router.put("/update-warehoue-to-warehouse/:id", updateWarehousetoWarehouse)

router.get("/product-list/:id", viewProductInWarehouse)

export default router;