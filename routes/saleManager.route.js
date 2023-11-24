import express from "express";
import { SalesManagerXml, deleteSalesManager, saveSalesManager, updateSalesManager, viewSalesManager } from "../controller/salesManager.controller.js";

const router = express.Router();

router.get("/get-xml",SalesManagerXml);
router.post("/save-sales-manager",saveSalesManager)
router.get("/view-sales-manager",viewSalesManager);
router.delete("/delete-sales-manager/:id",deleteSalesManager);
router.put("/update-sales-manager/:id",updateSalesManager)

export default router;