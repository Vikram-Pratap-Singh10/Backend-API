import express from "express";
import { DeleteCategory, ViewCategory, saveCategory, saveSubCategory } from "../controller/category.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest:"public/Images/" });

router.post("/save-category", upload.single("file"), saveCategory);
router.get("/view-category",ViewCategory);
router.get("/delete-category/:id",DeleteCategory)
router.post("/save-subcategory",upload.single("file"),saveSubCategory);

export default router;
