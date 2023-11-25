import express from "express";
import { DeleteTargetCreation, SaveTargetCreation, UpdateTargetCreation, ViewTargetCreation, targetCreationXml } from "../controller/targetCreation.controller.js";

const router = express.Router();

router.get("/get-xml", targetCreationXml)
router.post("/save-target-creation", SaveTargetCreation);
router.get("/view-target-creation", ViewTargetCreation);
router.delete("/delete-target-creation/:id", DeleteTargetCreation);
router.put("/update-target-creation/:id", UpdateTargetCreation);

export default router;