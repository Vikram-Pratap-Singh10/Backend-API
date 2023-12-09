import express from "express";
import { viewWarehouse } from "../controller/stockUpdation.controller.js";

const router = express.Router();

router.get("/view-warehouse-stock", viewWarehouse)

export default router;