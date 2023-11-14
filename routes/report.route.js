import express from "express"
import { reportXml, warrantyReport } from "../controller/report.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({dest:"public/Images"})

router.get("/get-xml",reportXml)
router.post("/warranty-report",upload.any("files"),warrantyReport)

export default router;