import { orderAuditHistory, policyAuditHistory, warrantyAuditHistory } from "../model/auditHistory.model.js"

export const saveOrderAuditHistory = async (req, res, next) => {
    try {
        const orderAudit = await orderAuditHistory.find({ id: req.body.id });
        if (orderAudit.length > 0) {
            const latestTimestamp = new Date(Math.max(...warrantyAudit.map(item => new Date(item.timestamp))));
            const isStatusDifferent = orderAudit.every(item => item.status !== req.body.status);
            if (isStatusDifferent) {
                req.body.timestamp = new Date();
                // const timestamp = new Date(orderAudit[0].timestamp);
                const currentDate = new Date();
                const timeDifference = currentDate - latestTimestamp;
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                req.body.timeLag = `${days} days, ${hours} hours, ${minutes} minutes`;

                const audit = await orderAuditHistory.create(req.body);
                return audit
                    ? res.status(200).json({ message: "save successfully", AuditHistory: audit, status: true })
                    : res.status(401).json({ error: "something went wrong", status: false });
            } else {
                return res.status(400).json({ message: "Status already exists for one or more entries.", status: false });
            }
        } else {
            req.body.timestamp = new Date();
            const audit = await orderAuditHistory.create(req.body);
            return audit
                ? res.status(200).json({ message: "save successfully", AuditHistory: audit, status: true })
                : res.status(401).json({ error: "something went wrong", status: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewOrderAuditHistory = async (req, res, next) => {
    try {
        const audit = await orderAuditHistory.find().sort({ softorder: -1 })
        return audit ? res.status(200).json({ AuditHistory: audit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const viewOrderAuditHistoryById = async (req, res, next) => {
    try {
        const audit = await orderAuditHistory.find({ id: req.params.id }).sort({ softorder: -1 })
        return audit ? res.status(200).json({ AuditHistory: audit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}

export const saveWarrantyAuditHistory = async (req, res, next) => {
    try {
        const warrantyAudit = await warrantyAuditHistory.find({ id: req.body.id });
        if (warrantyAudit.length > 0) {
            const latestTimestamp = new Date(Math.max(...warrantyAudit.map(item => new Date(item.timestamp))));
            const isStatusDifferent = warrantyAudit.every(item => item.status !== req.body.status);
            if (isStatusDifferent) {
                req.body.timestamp = new Date();
                // const timestamp = new Date(warrantyAudit[0].timestamp);
                const currentDate = new Date();
                const timeDifference = currentDate - latestTimestamp;
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                req.body.timeLag = `${days} days, ${hours} hours, ${minutes} minutes`;

                const audit = await warrantyAuditHistory.create(req.body);
                return audit
                    ? res.status(200).json({ message: "save successfully", AuditHistory: audit, status: true })
                    : res.status(401).json({ error: "something went wrong", status: false });
            } else {
                return res.status(400).json({ message: "Status already exists for one or more entries.", status: false });
            }
        } else {
            req.body.timestamp = new Date();
            const audit = await warrantyAuditHistory.create(req.body);
            return audit
                ? res.status(200).json({ message: "save successfully", AuditHistory: audit, status: true })
                : res.status(401).json({ error: "something went wrong", status: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
export const viewWarrantyAuditHistory = async (req, res, next) => {
    try {
        const audit = await warrantyAuditHistory.find().sort({ softorder: -1 })
        return audit ? res.status(200).json({ AuditHistory: audit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const viewWarrantyAuditHistoryById = async (req, res, next) => {
    try {
        const audit = await warrantyAuditHistory.find({ id: req.params.id }).sort({ softorder: -1 })
        return audit ? res.status(200).json({ AuditHistory: audit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}

export const savePolicyAuditHistory = async (req, res, next) => {
    try {
        const policyAudit = await policyAuditHistory.find({ id: req.body.id });
        if (policyAudit.length > 0) {
            const latestTimestamp = new Date(Math.max(...warrantyAudit.map(item => new Date(item.timestamp))));
            const isStatusDifferent = policyAudit.every(item => item.status !== req.body.status);
            if (isStatusDifferent) {
                req.body.timestamp = new Date();
                // const timestamp = new Date(policyAudit[0].timestamp);
                const currentDate = new Date();
                const timeDifference = currentDate - latestTimestamp;
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                req.body.timeLag = `${days} days, ${hours} hours, ${minutes} minutes`;

                const audit = await policyAuditHistory.create(req.body);
                return audit
                    ? res.status(200).json({ message: "save successfully", AuditHistory: audit, status: true })
                    : res.status(401).json({ error: "something went wrong", status: false });
            } else {
                return res.status(400).json({ message: "Status already exists for one or more entries.", status: false });
            }
        } else {
            req.body.timestamp = new Date();
            const audit = await policyAuditHistory.create(req.body);
            return audit
                ? res.status(200).json({ message: "save successfully", AuditHistory: audit, status: true })
                : res.status(401).json({ error: "something went wrong", status: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewPolicyAuditHistory = async (req, res, next) => {
    try {
        const audit = await policyAuditHistory.find().sort({ softorder: -1 })

        return audit ? res.status(200).json({ AuditHistory: audit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const viewPolicyAuditHistoryById = async (req, res, next) => {
    try {
        const audit = await policyAuditHistory.find({ id: req.params.id }).sort({ softorder: -1 })

        return audit ? res.status(200).json({ AuditHistory: audit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}