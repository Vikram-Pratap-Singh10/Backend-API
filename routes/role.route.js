import express from "express";
import { CreatRole, getRole, updatedRole } from "../controller/role.controller.js";

 const router = express.Router();
 
router.post("/create-role",CreatRole);
router.get("/get-role",getRole);
router.put("/update-role/:id",updatedRole)
 
export default router