import express from "express";
import { Achievement, DeleteTargetCreation, SaveTargetCreation, UpdateTargetCreation, ViewTargetCreation, ViewTargetCreationById, deleteProductFromTargetCreation, targetCreationXml } from "../controller/targetCreation.controller.js";

const router = express.Router();

router.get("/get-xml", targetCreationXml)
router.post("/save-target-creation", SaveTargetCreation);
router.get("/view-target-creation/:id", ViewTargetCreation);
router.delete("/delete-target-creation/:id", DeleteTargetCreation);
router.put("/update-target-creation/:id", UpdateTargetCreation);
router.get("/view-target-creation-by-id/:id", ViewTargetCreationById)
router.delete('/:targetId/product/:productId', deleteProductFromTargetCreation);

router.get("/target-achieve/:id", Achievement)

export default router;