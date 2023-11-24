import express from "express";
import { SalesPersonXml, deleteSalesPerson, saveSalesPerson, updateSalesPerson, viewSalesPerson } from "../controller/salesPerson.controller.js";

const router = express.Router();

router.get("/get-xml",SalesPersonXml)
router.post("/save-sales-person",saveSalesPerson)
router.get("/view-sales-person",viewSalesPerson);
router.delete("/delete-sales-person/:id",deleteSalesPerson);
router.put("/update-sales-person/:id",updateSalesPerson)

export default router;