import express from "express";
import { stockTransferToWarehouse, viewWarehouse } from "../controller/stockUpdation.controller.js";

const router = express.Router();

router.post("/stock-transfer-warehouse",stockTransferToWarehouse)
router.get("/view-warehouse-stock", viewWarehouse)

export default router;