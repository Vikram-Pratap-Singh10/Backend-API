import express from "express";
import { createWareHouse  } from "../controller/CreateWareHouseConfig.controller.js";
 
  
const router = express.Router();
router.get("/create-warehouse", createWareHouse);
 

export default router;
