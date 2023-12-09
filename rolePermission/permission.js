import { Category } from "../model/category.model.js";
import { CompanyDetails } from "../model/companyDetails.model.js";
import { Customer } from "../model/customer.model.js";
import { Promotion } from "../model/promotion.model.js";
import { Unit } from "../model/unit.model.js";
import { User } from "../model/user.model.js";
import { Warehouse } from "../model/warehouse.model.js";
let check = 'User'

export const getUser = async function getUserHierarchy(parentId, model) {
    try {
        let U = (check === model) ? User : Customer
        const users = await U.find({ created_by: parentId, status: 'Active' }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" });
        let results = [];
        for (const user of users) {
            results.push(user);
            const subUsers = await getUserHierarchy(user._id, model);
            results = results.concat(subUsers);
        }
        return results;
    } catch (error) {
        console.error('Error in getUserHierarchy:', error);
        throw error;
    }
}
export const findUserDetails = async function findUserDetails(userId) {
    try {
        // let U = (check === model) ? User : Customer
        const user = await User.findOne({ _id: userId, status: 'Active' }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" });
        if (!user) {
            return null;
        }
        const results = [user];
        if (user.created_by) {
            const createdById = user.created_by.toString();
            const subUsers = await findUserDetails(createdById);
            if (Array.isArray(subUsers)) {
                results.push(...subUsers);
            }
        }
        return results;
    } catch (error) {
        console.error('Error in findUserDetails:', error);
        throw error;
    }
}
export const getUserHierarchy = async function getUserHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        const customers = await Customer.find({ created_by: parentId, status: 'Active' }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" });
        let results = customers.concat(users);
        for (const user of users) {
            const subResults = await getUserHierarchy(user._id, processedIds);
            results = results.concat(subResults);
        }
        return results;
    } catch (error) {
        console.error('Error in getUserHierarchy:', error);
        throw error;
    }
};

export const getCustomerHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        const customers = await Customer.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        let results = customers;
        for (const user of users) {
            const subResults = await getCustomerHierarchy(user._id, processedIds);
            results = results.concat(subResults);
        }
        for (const customer of customers) {
            const subResults = await getCustomerHierarchy(customer._id, processedIds);
            results = results.concat(subResults);
        }
        return results;
    } catch (error) {
        console.error('Error in getCustomerHierarchy:', error);
        throw error;
    }
};

export const getUnitHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        const customers = await Unit.find({ created_by: parentId }).populate({ path: "created_by", model: "user" });
        let results = customers;
        for (const user of users) {
            const subResults = await getCustomerHierarchy(user._id, processedIds);
            results = results.concat(subResults);
        }
        for (const customer of customers) {
            const subResults = await getCustomerHierarchy(customer._id, processedIds);
            results = results.concat(subResults);
        }
        return results;
    } catch (error) {
        console.error('Error in getCustomerHierarchy:', error);
        throw error;
    }
};

export const getCategoryHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        const customers = await Category.find({ created_by: parentId, status: 'Active' }).populate({ path: "created_by", model: "user" });
        let results = customers;
        for (const user of users) {
            const subResults = await getCustomerHierarchy(user._id, processedIds);
            results = results.concat(subResults);
        }
        for (const customer of customers) {
            const subResults = await getCustomerHierarchy(customer._id, processedIds);
            results = results.concat(subResults);
        }
        return results;
    } catch (error) {
        console.error('Error in getCustomerHierarchy:', error);
        throw error;
    }
};

export const getCompanyDetailHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        const customers = await CompanyDetails.find({ created_by: parentId }).populate({ path: "created_by", model: "user" });
        let results = customers;
        for (const user of users) {
            const subResults = await getCustomerHierarchy(user._id, processedIds);
            results = results.concat(subResults);
        }
        for (const customer of customers) {
            const subResults = await getCustomerHierarchy(customer._id, processedIds);
            results = results.concat(subResults);
        }
        return results;
    } catch (error) {
        console.error('Error in getCustomerHierarchy:', error);
        throw error;
    }
};

export const getWarehouseHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        const customers = await Warehouse.find({ created_by: parentId }).populate({ path: "created_by", model: "user" });
        let results = customers;
        for (const user of users) {
            const subResults = await getCustomerHierarchy(user._id, processedIds);
            results = results.concat(subResults);
        }
        for (const customer of customers) {
            const subResults = await getCustomerHierarchy(customer._id, processedIds);
            results = results.concat(subResults);
        }
        return results;
    } catch (error) {
        console.error('Error in getCustomerHierarchy:', error);
        throw error;
    }
};

export const getPromotionHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });
        const customers = await Promotion.find({ created_by: parentId }).populate({ path: "created_by", model: "user" });
        let results = customers;
        for (const user of users) {
            const subResults = await getCustomerHierarchy(user._id, processedIds);
            results = results.concat(subResults);
        }
        for (const customer of customers) {
            const subResults = await getCustomerHierarchy(customer._id, processedIds);
            results = results.concat(subResults);
        }
        return results;
    } catch (error) {
        console.error('Error in getCustomerHierarchy:', error);
        throw error;
    }
};
