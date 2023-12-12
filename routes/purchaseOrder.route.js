import express from "express";
import multer from "multer";
import { purchaseOrder, purchaseOrderHistory, purchaseOrderHistoryByUserId, updatePurchaseOrder, updatePurchaseOrderStatus } from "../controller/purchageOrder.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/Images/" })

router.post("/save-purchase-order", purchaseOrder)
router.get("/view-purchase-order-history/:id", purchaseOrderHistory)
router.get("/view-purchase-order-history-by-id/:id", purchaseOrderHistoryByUserId);
router.put("/update-purchase-order/:id", updatePurchaseOrder);
router.put("/update-purchase-order-status/:id", updatePurchaseOrderStatus);

export default router;