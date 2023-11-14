import ExcelJS from 'exceljs'
import { SparePart } from "../model/part.model.js";
import axios from 'axios';

export const sparePartXml = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/SparePartConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveSpareParts = async (req, res) => {
    try {
        const partType = req.body.partType;
        if (partType === 'SpareParts') {
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
            const existingParts = [];
            for (let rowIndex = 2; rowIndex <= worksheet.actualRowCount; rowIndex++) {
                const dataRow = worksheet.getRow(rowIndex);
                const document = {};
                for (let columnIndex = 1; columnIndex <= headings.length; columnIndex++) {
                    const heading = headings[columnIndex - 1];
                    const cellValue = dataRow.getCell(columnIndex).value;
                    document[heading] = cellValue;
                }
                const existingRecord = await SparePart.findOne({
                    Part_Number: document.Part_Number,
                });
                if (!existingRecord) {
                    const insertedDocument = await SparePart.create(document);
                    insertedDocuments.push(insertedDocument);
                } else {
                    existingParts.push(document.Part_Number);
                }
            }
            let time = new Date()
            let message = 'Data Inserted Successfully';
            if (existingParts.length > 0) {
                message = `${existingParts.length} parts already exist: ${existingParts.join(', ')}`;
            }
            return res.status(200).json({ message, time, status: true });
        }
        else {
            return res.status(400).json({ error: "Bad Request", status: false });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
}
export const viewSpareParts = async (req, res, next) => {
    try {
        let spareParts = await SparePart.find();
        return (spareParts.length > 0) ? res.status(200).json({ SparePart: spareParts, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
export const deleteSparePartItem = async (req, res, next) => {
    try {
        const sparePart = await SparePart.findByIdAndDelete({ _id: req.params.id })
        return sparePart ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const getSparePartById = async (req, res, next) => {
    try {
        const sparePart = await SparePart.findById({ _id: req.params.id })
        return sparePart ? res.status(200).json({ SparePart: sparePart, status: true }) : res.status(401).json({ error: "Bad Request", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}