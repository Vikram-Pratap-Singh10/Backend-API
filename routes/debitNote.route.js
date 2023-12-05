import express from "express";
import { pincode, viewDebitNote, viewDebitNoteById } from "../controller/debitNote.controller.js";

const router = express.Router();

router.get("/view-debit-note", viewDebitNote);
router.get("/view-debit-note-by-id/:id", viewDebitNoteById)
router.get("/get-pincode/:pincode", pincode)

export default router;