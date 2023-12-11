import axios from "axios";
import { TargetCreation } from "../model/targetCreation.model.js";
import { getTargetCreationHierarchy } from "../rolePermission/permission.js";

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
