import express from "express";
import { CustomerXml, DeleteCustomer, SaveCustomer, UpdateCustomer, ViewCustomer } from "../controller/customer.controller.js";

const router = express.Router();

router.get("/get-xml",CustomerXml);
router.post("/save-customer",SaveCustomer);
router.get("/view-customer",ViewCustomer);
router.get("/delete-customer/:id",DeleteCustomer);
router.post("/update-customer/:id",UpdateCustomer);

export default router;