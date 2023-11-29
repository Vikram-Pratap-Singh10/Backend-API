import express from "express";
import { viewCreateNote, viewCreditNoteById } from "../controller/creditNote.controller.js";

const router  = express.Router();

router.get("/view-credit-note", viewCreateNote);
router.post("/view-credit-note-by-id",viewCreditNoteById);

export default router;