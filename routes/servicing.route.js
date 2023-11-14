import express from "express"
import multer from "multer";
import { saveServicing, viewServicing } from "../controller/servicing.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-servicing", upload.single('file'), saveServicing)
router.get("/view-servicing",viewServicing)

export default router;