import express from "express"
import multer from "multer";
import { saveWareHouse, viewWareHouse } from "../controller/warehouse.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-warehouse", upload.single('file'), saveWareHouse)
router.get("/view-warehouse",viewWareHouse)

export default router;