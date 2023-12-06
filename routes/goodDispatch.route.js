import express from "express";
import { GoodDispathcXml, deleteGoodDispatch, saveGoodDispatch, updateGoodDispatch, viewGoodDispatch, viewGoodDispatchById } from "../controller/goodDispatch.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/Images/" })

router.get("/get-xml", GoodDispathcXml)
router.post("/save-good-dispatch", upload.any("files"), saveGoodDispatch)
router.get("/view-good-dispatch", viewGoodDispatch);
router.get("/view-good-dispatch/:id", viewGoodDispatchById);
router.delete("/delete-good-dispatch/:id", deleteGoodDispatch);
router.put("/update-good-dispatch/:id", upload.any("files"), updateGoodDispatch)

export default router;