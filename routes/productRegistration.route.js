import express from "express"
import multer from "multer";
import { saveProductRegistration, viewProductRegistration } from "../controller/productRegistration.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-product-registration", upload.single('file'), saveProductRegistration)
router.get("/view-product-registration",viewProductRegistration)

export default router;