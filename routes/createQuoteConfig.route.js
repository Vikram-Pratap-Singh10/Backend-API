import express from "express";
import { createQuote  } from "../controller/createQuoteConfig.controller.js";
 
  
const router = express.Router();
router.get("/create-quote", createQuote);
 

export default router;
