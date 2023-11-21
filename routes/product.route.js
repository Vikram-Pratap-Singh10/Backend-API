import express from "express";
import { ProductXml } from "../controller/product.controller.js";

const router = express.Router();

router.get("/get-xml",ProductXml);

export default router;