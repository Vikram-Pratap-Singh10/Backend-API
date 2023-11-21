import express from "express";

import multer from "multer";
import { UnitXml } from "../controller/unit.controller.js";

const router = express.Router();

const upload = multer({ dest:"public/Images/" });

router.get("/get-xml",UnitXml);


export default router;