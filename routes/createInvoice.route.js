import express from "express";
import { SaveInvoiceList, viewInvoiceList } from "../controller/createInvoice.controller.js";

const router = express.Router();

router.get("/save-invoice/:id", SaveInvoiceList);
router.get("/view-invoice", viewInvoiceList)

export default router;