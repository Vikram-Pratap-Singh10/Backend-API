import axios from "axios";
import { Transporter } from "../model/transporter.model.js";

export const TransporterXml = async (req, res) => {
    const fileUrl = "https://awsxmlfiles.s3.ap-south-1.amazonaws.com/CreateTransporter.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveTransporter = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.filename
        }
        const transporter = await Transporter.create(req.body)
        return transporter ? res.status(200).json({ message: "transporter save successfully", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const ViewTransporter = async (req, res, next) => {
    try {
        let transporter = await Transporter.find().sort({ sortorder: -1 })
        return transporter ? res.status(200).json({ Transporter: transporter, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const DeleteTransporter = async (req, res, next) => {
    try {
        const transporter = await Transporter.findByIdAndDelete({ _id: req.params.id })
        return (transporter) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const UpdateTransporter = async (req, res, next) => {
    try {
        const transporterId = req.params.id;
        const existingTransporter = await Transporter.findById(transporterId);
        if (!existingTransporter) {
            return res.status(404).json({ error: 'transporter not found', status: false });
        }
        else {
            const updatedTransporter = req.body;
            await Transporter.findByIdAndUpdate(transporterId, updatedTransporter, { new: true });
            return res.status(200).json({ message: 'Transporter Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};