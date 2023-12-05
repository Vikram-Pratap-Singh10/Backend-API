import express from "express";
import { viewDebitNote, viewDebitNoteById } from "../controller/debitNote.controller.js";

const router = express.Router();

router.get("/view-debit-note", viewDebitNote);
router.get("/view-debit-note-by-id/:id", viewDebitNoteById)

export default router;