import express from "express"
import multer from "multer";
import { deleteServiceRate, saveServiceRate, viewServiceRate } from "../controller/serviceRate.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-service-rate", upload.single('file'), saveServiceRate)
router.get("/view-service-rate", viewServiceRate)
router.get("/delete-service-rate/:id", deleteServiceRate)

export default router;