import express from "express";
import { deleteSalesManager, saveSalesManager, updateSalesManager, viewSalesManager } from "../controller/salesManager.controller.js";

const router = express.Router();

router.post("/save-sales-manager",saveSalesManager)
router.get("/view-sales-manager",viewSalesManager);
router.delete("/delete-sales-manager/:id",deleteSalesManager);
router.put("/update-sales-manager/:id",updateSalesManager)

export default router;