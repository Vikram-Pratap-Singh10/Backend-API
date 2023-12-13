import { Category } from "../model/category.model.js";
import { CompanyDetails } from "../model/companyDetails.model.js";
import { Customer } from "../model/customer.model.js";
import { Product } from "../model/product.model.js";
import { Promotion } from "../model/promotion.model.js";
import { TargetCreation } from "../model/targetCreation.model.js";
import { Unit } from "../model/unit.model.js";
import { User } from "../model/user.model.js";
import { Warehouse } from "../model/warehouse.model.js";
let check = 'User';

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
// export const getUserHierarchy1 = async function getUserHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "rolename", model: "role" })
//             .populate({ path: "created_by", model: "user" });
//         const customers = await Customer.find({ created_by: parentId, status: 'Active' }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" });
//         let results = customers.concat(users);
//         for (const user of users) {
//             const subResults = await getUserHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getUserHierarchy:', error);
//         throw error;
//     }
// };

// export const getCustomerHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "rolename", model: "role" })
//             .populate({ path: "created_by", model: "user" });
//         const customers = await Customer.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "rolename", model: "role" })
//             .populate({ path: "created_by", model: "user" });
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };

// export const getUnitHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//         const customers = await Unit.find({ created_by: parentId })
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };
export const getUnitHierarchy = async function getUnitHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, units] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }).lean(),
            Unit.find({ created_by: parentId }).lean()
        ]);
        let results = units;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getUnitHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getUnitHierarchy:', error);
        throw error;
    }
};

// export const getCategoryHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "created_by", model: "user" });
//         const customers = await Category.find({ created_by: parentId, status: 'Active' }).populate({ path: "created_by", model: "user" });
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };
export const getCategoryHierarchy = async function getCategoryHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, categories] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }).lean(),
            Category.find({ created_by: parentId, status: 'Active' }).lean()
        ]);
        let results = categories;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getCategoryHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getCategoryHierarchy:', error);
        throw error;
    }
};


// export const getCompanyDetailHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "created_by", model: "user" });
//         const customers = await CompanyDetails.find({ created_by: parentId }).populate({ path: "created_by", model: "user" });
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };

export const getCompanyDetailHierarchy = async function getCompanyDetailHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, companyDetails] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }).lean(),
            CompanyDetails.find({ created_by: parentId }).lean()
        ]);
        let results = companyDetails;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getCompanyDetailHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getCompanyDetailHierarchy:', error);
        throw error;
    }
};


// export const getWarehouseHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "created_by", model: "user" });
//         const customers = await Warehouse.find({ created_by: parentId }).populate({ path: "created_by", model: "user" });
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };



// export const getPromotionHierarchy1 = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//         const customers = await Promotion.find({ created_by: parentId })
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };

// export const getProductHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "created_by", model: "user" });
//         const customers = await Product.find({ created_by: parentId }).populate({ path: "created_by", model: "user" });
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };

// export const getTargetCreationHierarchy = async function getCustomerHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const users = await User.find({ created_by: parentId, status: 'Active' })
//             .populate({ path: "created_by", model: "user" });
//         const customers = await TargetCreation.find({ created_by: parentId }).populate({ path: 'salesPersonId', model: 'user' })
//             .populate({ path: "products.productId", model: "product" });
//         let results = customers;
//         for (const user of users) {
//             const subResults = await getCustomerHierarchy(user._id, processedIds);
//             results = results.concat(subResults);
//         }
//         for (const customer of customers) {
//             const subResults = await getCustomerHierarchy(customer._id, processedIds);
//             results = results.concat(subResults);
//         }
//         return results;
//     } catch (error) {
//         console.error('Error in getCustomerHierarchy:', error);
//         throw error;
//     }
// };



export const getWarehouseHierarchy = async function getWarehouseHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, warehouses] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }).lean(),
            Warehouse.find({ created_by: parentId }).lean()
        ]);
        let results = warehouses;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getWarehouseHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getWarehouseHierarchy:', error);
        throw error;
    }
};

// export const getWarehouseHierarchy = async function getWarehouseHierarchy(warehouseId, userId, processedIds = new Set()) {
//     try {
//         if (!warehouseId && !userId) {
//             throw new Error('Either warehouseId or userId must be provided.');
//         }

//         if (processedIds.has(warehouseId || userId)) {
//             return [];
//         }

//         processedIds.add(warehouseId || userId);

//         let users = [];
//         let warehouses = [];

//         if (userId) {
//             users = await User.find({ created_by: userId, status: 'Active' }).lean();
//         }

//         if (warehouseId || userId) {
//             warehouses = await Warehouse.find({ _: warehouseId || userId }).lean();
//         }

//         let results = warehouses;

//         if (userId) {
//             const subUserIds = users.map(user => user._id);
//             const subResultsPromises = subUserIds.map(subUserId => getWarehouseHierarchy(null, subUserId, processedIds));
//             const subResults = await Promise.all(subResultsPromises);
//             results = results.concat(subResults.flat());
//         }

//         return results;
//     } catch (error) {
//         console.error('Error in getWarehouseHierarchy:', error);
//         throw error;
//     }
// };






export const getProductHierarchy = async function getProductHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, products] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }).lean(),
            Product.find({ created_by: parentId }).lean()
        ]);
        let results = products;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getProductHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getProductHierarchy:', error);
        throw error;
    }
};


export const getTargetCreationHierarchy = async function getTargetCreationHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, targetCreations] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }).lean(),
            TargetCreation.find({ created_by: parentId })
                .populate({ path: 'salesPersonId', model: 'user' })
                .populate({ path: 'products.productId', model: 'product' })
                .lean()
        ]);
        let results = targetCreations;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getTargetCreationHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getTargetCreationHierarchy:', error);
        throw error;
    }
};



export const getPromotionHierarchy = async function getPromotionHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, promotions] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }),
            Promotion.find({ created_by: parentId })
        ]);
        const subResultsPromises = [];
        for (const user of users) {
            subResultsPromises.push(getPromotionHierarchy(user._id, processedIds));
        }
        for (const promotion of promotions) {
            subResultsPromises.push(getPromotionHierarchy(promotion._id, processedIds));
        }
        const subResults = await Promise.all(subResultsPromises);
        return [...promotions, ...subResults.flat()];
    } catch (error) {
        console.error('Error in getPromotionHierarchy:', error);
        throw error;
    }
};

// export const getUserHierarchy = async function getUserHierarchy(parentId, processedIds = new Set()) {
//     try {
//         if (processedIds.has(parentId)) {
//             return [];
//         }
//         processedIds.add(parentId);
//         const [users, customers] = await Promise.all([
//             User.find({ created_by: parentId, status: 'Active' }).lean(),
//             Customer.find({ created_by: parentId, status: 'Active' }).lean()
//         ]);
//         let results = customers.concat(users);
//         const subUserIds = users.map(user => user._id);
//         const subResultsPromises = subUserIds.map(userId => getUserHierarchy(userId, processedIds));
//         const subResults = await Promise.all(subResultsPromises);
//         return results.concat(subResults.flat());
//     } catch (error) {
//         console.error('Error in getUserHierarchy:', error);
//         throw error;
//     }
// };

export const getUserHierarchy = async function getUserHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId }).lean();
        console.log(users)
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getUserHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return users.concat(subResults.flat());
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
        const [users, customers] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' })
                .populate({ path: "created_by", model: "user" })
                .lean(),
            Customer.find({ created_by: parentId, status: 'Active' })
                .populate({ path: "created_by", model: "user" })
                .lean()
        ]);
        let results = customers;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getCustomerHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getCustomerHierarchy:', error);
        throw error;
    }
};

export const getStockHierarchy = async function getUnitHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const [users, units] = await Promise.all([
            User.find({ created_by: parentId, status: 'Active' }).lean(),
            Warehouse.find({ created_by: parentId }).lean()
        ]);
        let results = units;
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getUnitHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return results.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getUnitHierarchy:', error);
        throw error;
    }
};


export const getUserWarehouseHierarchy = async function getUserHierarchy(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return [];
        }
        processedIds.add(parentId);
        const users = await User.find({ created_by: parentId, status: 'Active' }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" }).lean();
        const subUserIds = users.map(user => user._id);
        const subResultsPromises = subUserIds.map(userId => getUserHierarchy(userId, processedIds));
        const subResults = await Promise.all(subResultsPromises);
        return users.concat(subResults.flat());
    } catch (error) {
        console.error('Error in getUserHierarchy:', error);
        throw error;
    }
};



export const getUserHierarchyWithProducts = async function getUserHierarchyWithProducts(parentId, processedIds = new Set()) {
    try {
        if (processedIds.has(parentId)) {
            return { user: null, products: [] };
        }
        processedIds.add(parentId);
        const [user, products] = await Promise.all([
            User.findOne({ _id: parentId, status: 'Active' }).lean(),
            Product.find({ created_by: parentId }).lean()
        ]);
        if (!user) {
            return { user: null, products: [] };
        }
        const subResultsPromises = products.map(product =>
            getUserHierarchyWithProducts(product._id, processedIds)
        );
        const subResults = await Promise.all(subResultsPromises);
        return {
            user,
            products: products.concat(subResults.map(result => result.products).flat())
        };
    } catch (error) {
        console.error('Error in getUserHierarchyWithProducts:', error);
        throw error;
    }
};
