import express from "express";
import { OrderXml, createOrder, createOrderHistory, createOrderHistoryByUserId, placeOrder, placeOrderHistory, placeOrderHistoryByUserId } from "../controller/order.controller.js";

const router = express.Router();

router.get("/get-xml", OrderXml);

router.post("/save-place-order", placeOrder);
router.get("/view-place-order", placeOrderHistory);
router.get("/view-place-order-by-id/:id", placeOrderHistoryByUserId)

router.post("/save-create-order", createOrder);
router.get("/view-create-order", createOrderHistory);
router.get("/view-create-order-by-id/:id", createOrderHistoryByUserId)

export default router;