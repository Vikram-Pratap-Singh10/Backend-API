import mongoose from "mongoose";

const AuditHistorySchema = new mongoose.Schema({
    id: {
        type: String
    },
    status: {
        type: String
    },
    userName: {
        type: String
    },
    Role: {
        type: String
    },
    timestamp: {
        type: String
    },
    timeLag: {
        type: String
    }
}, { timestamps: true })

export const orderAuditHistory = mongoose.model("orderAuditHistory", AuditHistorySchema)
export const warrantyAuditHistory = mongoose.model("warrantyAuditHistory", AuditHistorySchema)
export const policyAuditHistory = mongoose.model("policyAuditHistory", AuditHistorySchema)
