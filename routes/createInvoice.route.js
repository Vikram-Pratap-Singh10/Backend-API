import express from "express";
import { SaveInvoiceList, updateOrderInvoiceStatus, viewInvoiceList } from "../controller/createInvoice.controller.js";

const router = express.Router();

router.get("/save-invoice/:id", SaveInvoiceList);
router.get("/view-invoice", viewInvoiceList);
router.put("/update-status/:id", updateOrderInvoiceStatus)

export default router;