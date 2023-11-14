import express from "express"
import multer from "multer";
import { orderHistory, orderHistoryByUserId, orderXml, payment, placeOrder, saveOrders, viewOrders } from "../controller/order.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.get("/get-xml",orderXml)
router.post("/save-orders", upload.single('file'), saveOrders)
router.get("/view-orders",viewOrders)

router.post("/place-order",placeOrder)
router.get("/view-order-history-by-id/:id",orderHistoryByUserId)
router.get("/view-order-history",orderHistory)
router.post("/payment",payment)

export default router;