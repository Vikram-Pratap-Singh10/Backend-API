import express from "express";
import multer from "multer";
import { DeleteUnit, SaveUnit, UnitXml, UpdateUnit, ViewUnit } from "../controller/unit.controller.js";

const router = express.Router();
const upload = multer({ dest:"public/Images/" });

router.get("/get-xml",UnitXml);

router.post("/save-unit", SaveUnit);
router.get("/view-unit",ViewUnit);
router.delete("/delete-unit/:id",DeleteUnit)
router.put("/update-unit/:id",UpdateUnit)

export default router;