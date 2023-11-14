import express from "express"
import multer from "multer";
import { deleteTicketTool, saveTicketTool, ticketToolXml, viewTicketTool } from "../controller/ticketTool.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/Images/" })

router.get("/get-xml", ticketToolXml);
router.post("/save-ticket-tool", upload.any("file"), saveTicketTool)
router.get("/view-ticket-tool", viewTicketTool)
router.get("/delete-ticket-tool/:id",deleteTicketTool)

export default router;