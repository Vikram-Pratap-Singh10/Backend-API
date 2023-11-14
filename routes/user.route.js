import express from "express";
import { SaveUser, UserXml } from "../controller/user.controller.js";

const router = express.Router();

router.get("/get-xml",UserXml)
router.post("/save-user",SaveUser)

export default router;