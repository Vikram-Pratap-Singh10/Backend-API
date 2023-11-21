import express from "express";
import { DeleteTransporter, SaveTransporter, TransporterXml, UpdateTransporter, ViewTransporter } from "../controller/transporter.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest:"public/Images/" });

router.get("/get-xml",TransporterXml);

router.post("/save-transporter", SaveTransporter);
router.get("/view-transporter",ViewTransporter);
router.delete("/delete-transporter/:id",DeleteTransporter)
router.put("/update-transporter/:id",UpdateTransporter)

export default router;