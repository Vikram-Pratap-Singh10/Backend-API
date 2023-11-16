import { Role } from "../model/role.model.js";

export const CreatRole = async (req, res, next) => {
    try {
        const role = await Role.create(req.body);
        return res.status(200).json({ Role: role, message: "Role Creation successful", status: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const getRole = async (req, res, next) => {
    try {
        const getRole = await Role.find()
        return res.status(200).json({ Role:getRole, status: true });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}