import express from "express";
import multer from "multer";
import { SchedulerTime } from "../controller/schedulerTime.controller.js";

const router = express.Router();
const upload = multer({dest:"public/ExcelFile/"})

router.post("/scheduler-time",SchedulerTime);
 
export default router;
