import express from "express"
import multer from "multer";
import { saveCampaign, viewCampaign } from "../controller/campaign.controller.js";

const router = express.Router();
const upload = multer({ dest: "public/ExcelFile/" })

router.post("/save-campaign", upload.single('file'), saveCampaign)
router.get("/view-campaign",viewCampaign)

export default router;