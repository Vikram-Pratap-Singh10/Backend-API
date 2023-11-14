import dotenv from "dotenv"
import axios from "axios";
import mongoose from 'mongoose';
// import { SupplierAccountCreate } from "../model/AddSupplierConfig.model.js";
// dotenv.config();


export const createWareHouse = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/createWareHouseConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

