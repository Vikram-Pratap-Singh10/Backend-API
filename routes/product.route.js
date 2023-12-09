import express from "express";
import { DeleteProduct, ProductXml, SaveProduct, UpdateProduct, ViewProduct, ViewProductById } from "../controller/product.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/Images/" });

router.get("/get-xml", ProductXml);
router.post("/save-product", upload.single("file"), SaveProduct)
router.get("/view-product/:id", ViewProduct)
router.get("/view-product-by-id/:id", ViewProductById)
router.delete("/delete-product/:id", DeleteProduct)
router.put("/update-product/:id", upload.single("file"), UpdateProduct)

export default router;