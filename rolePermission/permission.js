import { Customer } from "../model/customer.model.js";
import { User } from "../model/user.model.js";
let check = 'User'

export const getUserHierarchy = async function getUserHierarchy(parentId, model) {
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
export const findUserDetails = async function findUserDetails(userId, model) {
    try {
        let U = (check === model) ? User : Customer
        const user = await U.findOne({ _id: userId, status: 'Active' }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" });
        if (!user) {
            return null;
        }
        const results = [user];
        if (user.created_by) {
            const createdById = user.created_by.toString();
            const subUsers = await findUserDetails(createdById, model);
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
export const getUser = async function getUserHierarchy(parentId, model) {
    try {
        let U;
        if (model === 'User') {
            U = User;
        } else if (model === 'Customer') {
            U = Customer;
        } else {
            throw new Error('Invalid model specified');
        }
        const users = await U.find({ created_by: parentId, status: 'Active' })
            .populate({ path: "rolename", model: "role" })
            .populate({ path: "created_by", model: "user" });

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
};
// const adminDetails = await getUserHierarchy(userId, 'Customer')