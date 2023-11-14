import express from "express";
import { AddComment, deletePolicy, policyXml, savePolicies, updatePolicy, viewPolicies } from "../controller/policies.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/Images" })

router.get("/get-xml", policyXml)
router.post("/save-policy", upload.any("files"), savePolicies)
router.get("/view-policies", viewPolicies)
router.get("/delete-policy/:id", deletePolicy)
router.post("/update-policy/:id", upload.any("files"), updatePolicy)
router.post("/comment-add/:id", AddComment)

export default router;