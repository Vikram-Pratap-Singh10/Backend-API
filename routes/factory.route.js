import express from "express";
import { getFactoryData, saveFactorytoWarehouse } from "../controller/factory.controller.js";

const router = express.Router();

router.post("/stock-transfer-FTW", saveFactorytoWarehouse);
router.get("/view-factory-stock", getFactoryData)

export default router;