import axios from "axios";
import { TargetCreation } from "../model/targetCreation.model.js";
import { getTargetCreationHierarchy } from "../rolePermission/permission.js";
import { Order } from "../model/order.model.js";

export const targetCreationXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/TargetCreation.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveTargetCreation = async (req, res) => {
    try {
        const target = await TargetCreation.create(req.body)
        return target ? res.status(200).json({ message: "Target save successfully", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const DeleteTargetCreation = async (req, res, next) => {
    try {
        const target = await TargetCreation.findByIdAndDelete({ _id: req.params.id })
        return (target) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const UpdateTargetCreation = async (req, res, next) => {
    try {
        const targetId = req.params.id;
        const existingTarget = await TargetCreation.findById(targetId);
        if (!existingTarget) {
            return res.status(404).json({ error: 'Target not found', status: false });
        }
        else {
            const updatedTarget = req.body;
            await TargetCreation.findByIdAndUpdate(targetId, updatedTarget, { new: true });
            return res.status(200).json({ message: 'Target Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
export const ViewTargetCreation = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const adminDetail = await getTargetCreationHierarchy(userId);
        // const adminDetail = adminDetails.length === 1 ? adminDetails[0] : adminDetails;
        // let target = await TargetCreation.find().sort({ sortorder: -1 })
        //     .populate({ path: 'salesPersonId', model: 'salesPerson' })
        //     .populate({ path: "products.productId", model: "product" });
        return (adminDetail.length > 0) ? res.status(200).json({ TargetCreation: adminDetail, status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const ViewTargetCreationById = async (req, res, next) => {
    try {
        let target = await TargetCreation.findOne({ _id: req.params.id })
            .populate({ path: 'salesPersonId', model: 'salesPerson' })
            .populate({ path: "products.productId", model: "product" });
        return target ? res.status(200).json({ TargetCreation: target, status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteProductFromTargetCreation = async (req, res, next) => {
    const targetId = req.params.targetId;
    const productIdToDelete = req.params.productId;
    try {
        const target = await TargetCreation.findById(targetId);
        const productPrice = target.products.reduce((total, item) => {
            if (item.productId.toString().toLowerCase() === productIdToDelete.toLowerCase()) {
                return total + item.price * item.qtyAssign;
            }
            return total;
        }, 0);
        const updatedTarget = await TargetCreation.findByIdAndUpdate(
            targetId,
            { $pull: { products: { productId: productIdToDelete } } },
            { new: true }
        );
        if (updatedTarget) {
            const grandTotal = updatedTarget.grandTotal - productPrice;
            const updatedTargetWithGrandTotal = await TargetCreation.findByIdAndUpdate(
                targetId,
                { grandTotal: grandTotal },
                { new: true }
            );
            return res.status(200).json({ TargetCreation: updatedTargetWithGrandTotal, status: true });
        } else {
            return res.status(404).json({ error: "Not Found", status: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
};



export const Achievement = async (req, res) => {
    try {
        const salespersonId = req.params.id;
        const targets1 = await TargetCreation.findOne({ salesPersonId: salespersonId })
        const startDate = new Date(targets1.startDate);
        const endDate = new Date(targets1.endDate);

        // Fetch targets within the date range from the database
        const targets = await TargetCreation.findOne({
            salesPersonId: salespersonId,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        });
        console.log(targets)
        if (!targets) {
            return res.status(404).json({ error: 'Targets not found', status: false });
        }

        // Assuming orders is your dummy order data
        const orders = [
            {
                fullName: "vikram",
                grandTotal: 31.98,
                orderItem: [
                    {
                        "salesPersonId": "656f112403940932515551c5",
                        "productId": "65742de03b6e254dd2162c8a",
                        "quantity": 2,
                        "totalPrice": 31.98,
                        "orderDate": "2023-12-15T12:00:00.000Z"
                    }
                ]
            },
            {
                fullName: "vikram",
                grandTotal: 31.98,
                orderItem: [{
                    "salesPersonId": "656f112403940932515551c5",
                    "productId": "65742de03b6e254dd2162c8a",
                    "quantity": 2,
                    "totalPrice": 31.98,
                    "orderDate": "2023-12-20T15:30:00.000Z"
                }]
            },
            {
                fullName: "vikram",
                grandTotal: 31.98,
                orderItem: [{
                    "salesPersonId": "656f112403940932515551c5",
                    "productId": "6574312fae0b864e8563020e",
                    "quantity": 2,
                    "totalPrice": 49.98,
                    "orderDate": "2023-12-10T10:45:00.000Z"
                }]
            }
            // Add more orders as needed
        ];

        // Calculate achievements for each product
        const achievements = targets.products.flatMap(targetProduct => {
            const matchingOrder = orders.find(order => order.orderItem[0].productId === targetProduct.productId);
            if (matchingOrder) {
                return {
                    productId: targetProduct.productId,
                    targetQuantity: targetProduct.qtyAssign,
                    actualQuantity: matchingOrder.orderItem[0].quantity,
                    achievementPercentage: (matchingOrder.orderItem[0].quantity / targetProduct.qtyAssign) * 100,
                    targetTotalPrice: targetProduct.totalPrice,
                    actualTotalPrice: matchingOrder.orderItem[0].totalPrice
                };
            } else {
                return null; // No matching order for this targetProduct
            }
        }).filter(Boolean); // Remove null values

        // Calculate overall achievement
        const overallTargetQuantity = targets.products.reduce((total, targetProduct) => total + targetProduct.qtyAssign, 0);
        const overallActualQuantity = achievements.reduce((total, achievement) => total + achievement.actualQuantity, 0);
        const overallAchievementPercentage = (overallActualQuantity / overallTargetQuantity) * 100;

        res.json({ achievements, overallAchievementPercentage });
    } catch (error) {
        console.error('Error calculating achievements:', error);
        res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
