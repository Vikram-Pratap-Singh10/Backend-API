import express from "express"
import multer from "multer";
import { saveSupport, viewSupport } from "../controller/support.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-support", upload.single('file'), saveSupport)
router.get("/view-support",viewSupport)

export default router;