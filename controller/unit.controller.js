import axios from "axios";
import { Unit } from "../model/unit.model.js";

export const UnitXml = async (req, res) => {
    const fileUrl = "https://awsxmlfiles.s3.ap-south-1.amazonaws.com/CreateUnit.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveUnit = async (req, res) => {
    try {
        const unit = await Unit.create(req.body)
        return unit ? res.status(200).json({ message: "unit save successfully", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const ViewUnit = async (req, res, next) => {
    try {
        let unit = await Unit.find().sort({ sortorder: -1 })
        return unit ? res.status(200).json({ Unit: unit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const DeleteUnit = async (req, res, next) => {
    try {
        const unit = await Unit.findByIdAndDelete({ _id: req.params.id })
        return (unit) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const UpdateUnit = async (req, res, next) => {
    try {
        const unitId = req.params.id;
        const existingUnit = await Unit.findById(unitId);
        if (!existingUnit) {
            return res.status(404).json({ error: 'unit not found', status: false });
        }
        else {
            const updatedUnit = req.body;
            await Unit.findByIdAndUpdate(unitId, updatedUnit, { new: true });
            return res.status(200).json({ message: 'Unit Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};