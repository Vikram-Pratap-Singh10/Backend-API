import express from "express";
import { GoodDispathcXml } from "../controller/goodDispatch.controller.js";

const router = express.Router();

router.get("/get-xml", GoodDispathcXml)

export default router;