import express from "express"
import { saveOrderAuditHistory, savePolicyAuditHistory, saveWarrantyAuditHistory, viewOrderAuditHistory, viewOrderAuditHistoryById, viewPolicyAuditHistory, viewPolicyAuditHistoryById, viewWarrantyAuditHistory, viewWarrantyAuditHistoryById } from "../controller/auditHistory.controller.js";

const router = express.Router();

router.post("/save-order-audit-history", saveOrderAuditHistory)
router.get("/view-order-audit-history", viewOrderAuditHistory)
router.get("/view-order-audit-history-by-id/:id", viewOrderAuditHistoryById)

router.post("/save-warranty-audit-history", saveWarrantyAuditHistory)
router.get("/view-warranty-audit-history", viewWarrantyAuditHistory)
router.get("/view-warranty-audit-history-by-id/:id", viewWarrantyAuditHistoryById)

router.post("/save-policy-audit-history", savePolicyAuditHistory)
router.get("/view-policy-audit-history", viewPolicyAuditHistory)
router.get("/view-policy-audit-history-by-id/:id", viewPolicyAuditHistoryById)

export default router;