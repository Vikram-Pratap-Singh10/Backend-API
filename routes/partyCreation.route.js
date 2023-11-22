import express from "express";
import { PartyXml } from "../controller/partyCreation.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({dest:"public/Images/"})

router.get("/get-xml",PartyXml)

export default router;