import express from "express"
import multer from "multer";
import { saveSupplier, viewSupplier } from "../controller/supplier.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-supplier", upload.single('file'), saveSupplier)
router.get("/view-supplier",viewSupplier)

export default router;