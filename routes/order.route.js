import express from "express";
import { OrderXml, createOrder, createOrderHistory, createOrderHistoryByUserId, placeOrder, placeOrderHistory, placeOrderHistoryByUserId, test, updateCreateOrder, updateCreateOrderStatus, updatePlaceOrder, updatePlaceOrderStatus } from "../controller/order.controller.js";

const router = express.Router();

router.get("/get-xml", OrderXml);

router.post("/save-place-order", placeOrder);
router.get("/view-place-order", placeOrderHistory);
router.get("/view-place-order-by-id/:id", placeOrderHistoryByUserId);
router.put("/update-place-order/:id", updatePlaceOrder);
router.put("/update-place-order-status/:id", updatePlaceOrderStatus);

router.post("/save-create-order", createOrder);
router.get("/view-create-order-history", createOrderHistory);
router.get("/view-create-order-history-by-id/:id", createOrderHistoryByUserId);
router.put("/update-create-order/:id", updateCreateOrder);
router.put("/update-create-order-status/:id", updateCreateOrderStatus);

router.get('/user-hierarchy/:parentId', test)

export default router;