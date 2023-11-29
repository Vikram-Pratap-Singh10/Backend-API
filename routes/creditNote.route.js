import express from "express";
import { viewCreateNote } from "../controller/creditNote.controller.js";

const router  = express.Router();

router.get("/view-credit-note", viewCreateNote)

export default router;