import express from "express";
import { OrderXml, SalesOrderList, autoBillingLock, createOrder, createOrderHistory, createOrderHistoryByUserId, placeOrder, placeOrderHistory, placeOrderHistoryByUserId, updateCreateOrder, updateCreateOrderStatus, updatePlaceOrder, updatePlaceOrderStatus } from "../controller/order.controller.js";

const router = express.Router();

router.get("/get-xml", OrderXml);

router.post("/save-place-order", placeOrder);
router.get("/view-place-order/:id", placeOrderHistory);
router.get("/view-place-order-by-id/:id", placeOrderHistoryByUserId);
router.put("/update-place-order/:id", updatePlaceOrder);
router.put("/update-place-order-status/:id", updatePlaceOrderStatus);

router.post("/save-create-order", createOrder);
router.get("/view-create-order-history/:id", createOrderHistory);
router.get("/view-create-order-history-by-id/:id", createOrderHistoryByUserId);
router.put("/update-create-order/:id", updateCreateOrder);
router.put("/update-create-order-status/:id", updateCreateOrderStatus);

router.get("/billing/:id", autoBillingLock)
router.get("/view-sales-order/:id", SalesOrderList);

export default router;