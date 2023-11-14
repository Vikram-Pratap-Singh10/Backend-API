import express from "express";
import { customerRegistration, deleteCustomerRegistration, saveCustomerDate, saveCustomerRegistration, updateCustomerRegistration, viewCustomerData, viewCustomerRegistration} from "../controller/customerRegistration.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.get("/customer-registration", customerRegistration);
router.post("/save-customer", saveCustomerRegistration);
router.get("/get-customer", viewCustomerRegistration);
router.get("/delete-customer/:id", deleteCustomerRegistration);
router.post("/update-customer/:id", updateCustomerRegistration);
// -------------------------------------------------------------
router.post("/save-customer-data", upload.single('file'), saveCustomerDate)
router.get("/view-customer-data",viewCustomerData)

export default router;
