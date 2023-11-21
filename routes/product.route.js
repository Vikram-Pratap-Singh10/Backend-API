import express from "express";
import { ProductXml, SaveProduct, ViewProduct } from "../controller/product.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({dest:"public/Images/"});

router.get("/get-xml",ProductXml);
router.post("/save-product",upload.single("file"),SaveProduct)
router.get("/view-product",ViewProduct)

export default router;