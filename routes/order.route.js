import express from "express";
import { OrderXml, placeOrder, placeOrderHistory, placeOrderHistoryByUserId } from "../controller/order.controller.js";

const router = express.Router();

router.get("/get-xml", OrderXml);

router.post("/save-place-order", placeOrder);
router.get("/view-place-order", placeOrderHistory);
router.get("/view-place-order-by-id/:id", placeOrderHistoryByUserId)

export default router;