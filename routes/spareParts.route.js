import express from "express"
import multer from "multer";
import { deleteSparePartItem, getSparePartById, saveSpareParts, sparePartXml, viewSpareParts } from "../controller/spareParts.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.get("/get-xml", sparePartXml);
router.post("/save-spare-parts", upload.single('file'), saveSpareParts)
router.get("/view-spare-parts", viewSpareParts)
router.get("/delete-spare-parts/:id", deleteSparePartItem)
router.get("/get-spare-part-by-Id/:id", getSparePartById)

export default router;