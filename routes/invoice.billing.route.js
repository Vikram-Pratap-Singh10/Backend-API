import express from "express"
import multer from "multer";
import { saveInvoiceBilling, viewInvoiceBilling } from "../controller/invoice.billing.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-invoice-billing", upload.single('file'), saveInvoiceBilling)
router.get("/view-invoice-billing",viewInvoiceBilling)

export default router;