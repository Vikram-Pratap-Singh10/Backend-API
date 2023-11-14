import express from "express"
import multer from "multer";
import { deleteWarranty, saveWarranty, updateWarranty, viewWarranty, warrantyXml } from "../controller/warranty.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.get("/get-xml", warrantyXml);
router.post("/save-warranty", upload.any("files"), saveWarranty);
router.get("/view-warranty", viewWarranty);
router.get("/delete-warranty/:id", deleteWarranty);
router.post("/update-warranty/:id", updateWarranty);

export default router;