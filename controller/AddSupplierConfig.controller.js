import dotenv from "dotenv"
import axios from "axios";
import { SupplierAccountCreate } from "../model/AddSupplierConfig.model.js";
dotenv.config();


export const createSupplier = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/AddSupplierConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};
export const saveSupplierAccount = async (req, res, next) => {
    try {
        let account = await SupplierAccountCreate.create(req.body);
        if (account)
            return res.status(200).json({ message: "save information successful", status: true })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}