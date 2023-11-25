import axios from "axios";
import { SalesReturn } from "../model/salesReturn.model.js";

export const SalesReturnXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/SalesReturn.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveSalesReturnOrder = async (req, res, next) => {
    try {
        
        const salesReturn = await SalesReturn.create(req.body);
        return salesReturn ? res.status(200).json({ message: "Data Save Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Errro", status: false })
    }
}
export const viewSalesReturn = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.find().sort({ sortorder: -1 })
        return salesReturn ? res.status(200).json({ SalesReturn: salesReturn, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const deleteSalesReturn = async (req, res, next) => {
    try {
        const salesReturn = await SalesReturn.findByIdAndDelete({ _id: req.params.id })
        return salesReturn ? res.status(200).json({ message: "Delete Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const updateSalesReturn = async (req, res, next) => {
    try {
        const salesReturnId = req.params.id;
        const existingSalesReturn = await SalesReturn.findById(salesReturnId);
        if (!existingSalesReturn) {
            return res.status(404).json({ message: "SalesReturn Not Found", status: false });
        }
        const updatedSalesReturn = req.body;
        const updateSalesReturn = await SalesReturn.findByIdAndUpdate(salesReturnId, updatedSalesReturn, { new: true })
        return updateSalesReturn ? res.status(200).json({ message: "SalesReturn Updated Successfully", status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}