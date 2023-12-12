import express from "express";
import { getFactoryData, saveFactorytoWarehouse, updateFactorytoWarehouse } from "../controller/factory.controller.js";

const router = express.Router();

router.post("/stock-transfer-FTW", saveFactorytoWarehouse);
router.get("/view-factory-stock", getFactoryData);
router.put("/update-factory-warehouse/:id", updateFactorytoWarehouse)

export default router;