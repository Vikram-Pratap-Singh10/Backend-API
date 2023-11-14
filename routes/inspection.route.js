import express from "express"
import multer from "multer";
import { deleteInspection, getInspection, inspectionSave, inspectionXml, saveInspection, updateInspection, viewInspection } from "../controller/inspection.controller.js";

const router = express.Router();
const uploads = multer({ dest: "public/ExcelFile/" })
const upload = multer({ dest: "public/Images/" })

router.get("/get-xml", inspectionXml)
router.post("/save-inspection", uploads.single('file'), saveInspection)
router.get("/view-inspection", viewInspection)

router.post("inspection-save", upload.any("file"), inspectionSave)
router.get("/get-inspection", getInspection)
router.get("/delete-inspection/:id", deleteInspection)
router.post("/update-inspection", updateInspection)

export default router;