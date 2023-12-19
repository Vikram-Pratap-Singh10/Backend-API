import express from "express";
import { GoodDispathcXml, deleteGoodDispatch, saveGoodDispatch, updateGoodDispatch, viewGoodDispatch, viewGoodDispatchById, viewOrderForDeliveryBoy } from "../controller/goodDispatch.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/Images/" })

router.get("/get-xml", GoodDispathcXml)
router.post("/save-good-dispatch", upload.any("files"), saveGoodDispatch)
router.get("/view-good-dispatch", viewGoodDispatch);
router.get("/view-good-dispatch/:id", viewGoodDispatchById);
router.delete("/delete-good-dispatch/:id", deleteGoodDispatch);
router.put("/update-good-dispatch/:id", upload.any("files"), updateGoodDispatch)

router.get("/view-order-list/:id", viewOrderForDeliveryBoy)

export default router;