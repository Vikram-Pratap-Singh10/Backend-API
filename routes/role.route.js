import express from "express";
import { CreatRole, getRole, getRoleById, updatedRole } from "../controller/role.controller.js";

const router = express.Router();

router.post("/create-role", CreatRole);
router.get("/get-role", getRole);
router.get("/get-role-by-id/:id", getRoleById)
router.put("/update-role/:id", updatedRole)

export default router