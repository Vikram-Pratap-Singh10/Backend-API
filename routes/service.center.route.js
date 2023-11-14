import express from "express"
import multer from "multer";
import { saveServiceCenter, viewServiceCenter } from "../controller/serviceCenter.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-service-center", upload.single('file'), saveServiceCenter)
router.get("/view-service-center",viewServiceCenter)

export default router;