import express from "express";
import { createSupplier, saveSupplierAccount } from "../controller/AddSupplierConfig.controller.js";
import multer from "multer";
const uploda = multer({ dest: "public/Images" })

const router = express.Router();
router.get("/createSupplier", createSupplier);
router.post("/save-supplier-account", saveSupplierAccount);

export default router;
