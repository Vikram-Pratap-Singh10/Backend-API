import express from "express";
import { AddComment, saveOrder, viewComments, viewOrder } from "../controller/createOrder.controller.js";

const router = express.Router();

router.post("/save-create-order",saveOrder)
router.get("/view-comments/:id",viewComments)
router.post("/comment-add/:id", AddComment)
router.get("/view-create-order", viewOrder)

export default router;