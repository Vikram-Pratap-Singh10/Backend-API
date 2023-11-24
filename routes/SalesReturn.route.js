import express from "express";
import { saveSalesReturnOrder } from "../controller/SalesReturn.controller.js";

const router = express.Router();

router.post("/save-sales-return",saveSalesReturnOrder)

export default router;