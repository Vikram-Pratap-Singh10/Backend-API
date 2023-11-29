import express from "express";
import { SalesReturnXml, deleteSalesReturn, saveSalesReturnOrder, updateSalesReturn, viewSalesReturn, viewSalesReturnById } from "../controller/SalesReturn.controller.js";

const router = express.Router();

router.get("/get-xml", SalesReturnXml);
router.post("/save-sales-return", saveSalesReturnOrder)
router.get("/view-sales-return", viewSalesReturn);
router.get("/view-sales-return-by-id/:id",viewSalesReturnById)
router.delete("/delete-sales-return/:id", deleteSalesReturn);
router.put("/update-sales-return/:id", updateSalesReturn);

export default router;