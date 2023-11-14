import axios from "axios";
import { CustomerRegistration } from "../model/customerRegistration.model.js";
import ExcelJS from 'exceljs'
import { CustomerData } from '../model/part.model.js';

export const customerRegistration = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/customerRegistration.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};
export const saveCustomerRegistration = async (req, res, next) => {
    try {
        let customer = await CustomerRegistration.create(req.body);
        if (customer)
            return res.status(200).json({ message: "save successful", status: true })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewCustomerRegistration = async (req, res, next) => {
    try {
        let customer = await CustomerRegistration.find().sort({ sortorder: -1 })
        return customer ? res.status(200).json({ CustomerDetail: customer, status: true }) : res.status(400).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteCustomerRegistration = async (req, res, next) => {
    try {
        const customer = await CustomerRegistration.findByIdAndDelete({ _id: req.params.id })
        return customer ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Customer Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const updateCustomerRegistration = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateCustomerDetail = req.body;
        const existingAccount = await CustomerRegistration.findById(id);
        if (!existingAccount) {
            return res.status(404).json({ error: 'Account not found', status: false });
        }
        await CustomerRegistration.findByIdAndUpdate(id, updateCustomerDetail, { new: true });
        return res.status(200).json({ message: 'Account updated successfully', status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
// -----------------------------------------------------------------------

export const saveCustomerDate = async (req, res) => {
    try {
        const partType = req.body.partType;
        if (partType === 'CustomerData') {
            const filePath = await req.file.path;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(1);
            const headerRow = worksheet.getRow(1);
            const headings = [];
            headerRow.eachCell((cell) => {
                headings.push(cell.value);
            });
            const insertedDocuments = [];
            for (let rowIndex = 2; rowIndex <= worksheet.actualRowCount; rowIndex++) {
                const dataRow = worksheet.getRow(rowIndex);
                const document = {};
                for (let columnIndex = 1; columnIndex <= headings.length; columnIndex++) {
                    const heading = headings[columnIndex - 1];
                    const cellValue = dataRow.getCell(columnIndex).value;
                    document[heading] = cellValue;
                }
                const insertedDocument = await CustomerData.create(document);
                insertedDocuments.push(insertedDocument);
            }
            return res.status(200).json({ message: 'Data Inserted Successfully', status: true });
        }
        else {
            return res.status(400).json({ error: "Bad Request", status: false });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
}
export const viewCustomerData = async (req, res, next) => {
    try {
        let customerdata = await CustomerData.find();
        return (customerdata.length > 0) ? res.status(200).json({CustomerData:customerdata, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
