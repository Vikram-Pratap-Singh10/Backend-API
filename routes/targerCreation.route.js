import express from "express";
import { targetCreationXml } from "../controller/targetCreation.controller.js";

const router = express.Router();

router.get("/get-xml",targetCreationXml)

export default router;