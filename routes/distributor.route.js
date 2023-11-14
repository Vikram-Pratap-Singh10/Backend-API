import express from "express"
import multer from "multer";
import { saveDistributor, viewDistributor } from "../controller/distributor.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-distributor", upload.single('file'), saveDistributor)
router.get("/view-distributor",viewDistributor)

export default router;