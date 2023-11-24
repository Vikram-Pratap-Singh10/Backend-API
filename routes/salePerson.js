import express from "express";
import { deleteSalesPerson, saveSalesPerson, updateSalesPerson, viewSalesPerson } from "../controller/salesPerson.controller.js";

const router = express.Router();

router.post("/save-sales-person",saveSalesPerson)
router.get("/view-sales-person",viewSalesPerson);
router.delete("/delete-sales-person/:id",deleteSalesPerson);
router.put("/update-sales-person/:id",updateSalesPerson)

export default router;