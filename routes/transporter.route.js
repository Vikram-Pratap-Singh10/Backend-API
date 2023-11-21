import express from "express";
import { TransporterXml } from "../controller/transporter.controller.js";

const router = express.Router();

router.get("/get-xml",TransporterXml);

export default router;