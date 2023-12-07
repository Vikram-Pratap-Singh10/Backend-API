import express from "express";
import { CustomerXml, DeleteCustomer, SaveCustomer, UpdateCustomer, ViewCustomer, ViewCustomerById } from "../controller/customer.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/Images/" })

router.get("/get-xml", CustomerXml);
router.post("/save-customer", upload.any("files"), SaveCustomer);
router.get("/view-customer/:id", ViewCustomer);
router.get("/view-customer-by-id/:id", ViewCustomerById);
router.get("/delete-customer/:id", DeleteCustomer);
router.post("/update-customer/:id", upload.any("files"), UpdateCustomer);

export default router;