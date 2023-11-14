import express from "express"
import multer from "multer";
import { saveDealer, viewDealer } from "../controller/dealer.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-dealer", upload.single('file'), saveDealer)
router.get("/view-dealer",viewDealer)

export default router;