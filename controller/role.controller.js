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
        const roles = await Role.find().populate({ path: "createdBy", model: "role" });
        return res.status(200).json({ Role: roles, status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
};
export const getRoleById = async (req, res, next) => {
    try {
        const getRole = await Role.findById({ _id: req.params.id }).populate({ path: "createdBy", model: "role" });
        return res.status(200).json({ Role: getRole, status: true });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const updatedRole = async (req, res, next) => {
    try {
        const roleId = req.params.id;
        const existingAccount = await Role.findById(roleId);
        if (!existingAccount) {
            return res.status(404).json({ error: 'role not found', status: false });
        }
        if (req.body.position) {
            return res.status(400).json({ message: "this is not valid request", status: false })
        }
        const role = await Role.findOne({ _id: roleId });
        if (role) {
            role.createdBy = req.body.createdBy || role.createdBy
            role.roleName = req.body.roleName || role.roleName;
            role.desc = req.body.desc || role.desc;
            role.rolePermission = req.body.rolePermission || role.rolePermission;
            await role.save();
        }
        return res.status(200).json({ message: 'Account updated successfully', status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};