import express from "express";
import { CreatRole, getRole } from "../controller/role.controller.js";

 const router = express.Router();
 
router.post("/create-role",CreatRole);
router.get("/get-role",getRole);
 
export default router