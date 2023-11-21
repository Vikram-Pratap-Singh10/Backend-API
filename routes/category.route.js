import express from "express";
import { DeleteCategory, UpdateCategory, ViewCategory, deleteSubCategory, saveCategory, saveSubCategory, updateSubCategory } from "../controller/category.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest:"public/Images/" });

router.post("/save-category", upload.single("file"), saveCategory);
router.get("/view-category",ViewCategory);
router.get("/delete-category/:id",DeleteCategory)
router.put("/update-category/:id",upload.single("file"),UpdateCategory)
router.post("/save-subcategory",upload.single("file"),saveSubCategory);
router.put("/update-categories/:categoryId/subcategories/:subcategoryId",upload.single("file"),updateSubCategory)
router.delete("/delete-categories/:categoryId/subcategories/:subcategoryId",deleteSubCategory);

export default router;
