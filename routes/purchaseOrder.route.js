import express from "express";
import multer from "multer";
import { purchaseOrder, purchaseOrderHistory, purchaseOrderHistoryByUserId } from "../controller/purchageOrder.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/Images/" })

router.post("/save-purchase-order", purchaseOrder)
router.get("/view-purchase-order-history", purchaseOrderHistory)
router.get("/view-purchase-order-history-by-id/:id", purchaseOrderHistoryByUserId)

export default router;