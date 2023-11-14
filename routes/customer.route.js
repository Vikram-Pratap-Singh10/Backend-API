import express from "express";
import { CustomerXml, SaveCustomer } from "../controller/customer.controller.js";

const router = express.Router();

router.get("/get-xml",CustomerXml)
router.post("/save-customer",SaveCustomer)

export default router;