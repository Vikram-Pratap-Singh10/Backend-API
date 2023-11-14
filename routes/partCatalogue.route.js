import express from "express";
import multer from "multer";
import { getPartCatalogueById, saveParts, viewPartCatalogue, viewParts } from "../controller/partCatalogue.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })


router.post("/save-part-catalogue", upload.single('file'), saveParts)
router.get("/view-parts", viewParts)
router.get("/get-part-catalogue", viewPartCatalogue)
router.get("/getPartCatalogue/:id", getPartCatalogueById)

export default router;