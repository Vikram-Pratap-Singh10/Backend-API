import express from "express";
import { OrderHistory, cashBookOrder, placeOrderHistoryByUserId } from "../controller/cashBook.controller.js";

const router = express.Router();

router.post("/cashbook-order", cashBookOrder);
router.get("/view-cashbook/:id", placeOrderHistoryByUserId)
router.get("/view-order-list/:id", OrderHistory)

export default router;