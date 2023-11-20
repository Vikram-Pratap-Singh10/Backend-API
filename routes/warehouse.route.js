import express from "express";
import { WarehouseXml } from "../controller/warehouse.controller.js";

const router = express.Router();

router.get("/get-xml",WarehouseXml);

export default router;