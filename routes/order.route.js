import express from "express";
import { OrderXml } from "../controller/order.controller.js";

const router = express.Router();

router.get("/get-xml",OrderXml);

export default router;