import express from "express";
import { cashBookOrder, placeOrderHistoryByUserId } from "../controller/cashBook.controller.js";

const router = express.Router();

router.post("/cashbook-order", cashBookOrder);
router.get("/view-cashbook/:id", placeOrderHistoryByUserId)

export default router;