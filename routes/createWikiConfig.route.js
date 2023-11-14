import express from "express";
import { AddComment, createWiki, deleteProductWiki, saveProductWiKi, updateProductWiki, viewComments, viewProductWiki } from "../controller/createWikiConfig.controller.js";

import multer from "multer";
const uploada = multer({ dest: "public/Images" })

const router = express.Router();

router.get("/createWiki", createWiki);
router.post("/save-product-wiki", uploada.any("file"), saveProductWiKi);
router.get("/view-product-wiki", viewProductWiki);
router.get("/delete-product-wiki/:id", deleteProductWiki);
router.post("/update-product-wiki", updateProductWiki);
router.post("/comment-add/:id", AddComment)
router.get("/view-comments/:id", viewComments)

export default router;
