import ExcelJS from 'exceljs'
import axios from "axios";
import { Inspection } from '../model/inspection.model.js';

export const inspectionXml = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/InspectionConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveInspection = async (req, res) => {
    try {
        const partType = req.body.partType;
        if (partType === "Scrutiny" || "Inspections") {
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
                const insertedDocument = await Inspection.create(document);
                insertedDocuments.push(insertedDocument);
            }
            res.status(200).json({ message: 'Data Inserted Successfully', status: true });
        }
        else {
            return res.status(400).json({ error: "Bad Request", status: false });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
}
export const viewInspection = async (req, res, next) => {
    try {
        let inspection = await Inspection.find();
        return (inspection.length > 0) ? res.status(200).json({ Inspections: inspection, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
// -------------------------------------------------------
export const inspectionSave = async (req, res, next) => {
    try {
        const { Role, userName, time } = req.body;
        if (req.files) {
            let images = []
            req.files.map(file => {
                images.push(file.filename)
            })
            const push = await { Role: Role, userName: userName, time: time, images: images }
            req.body.attachmentFile = await push
        }
        req.body.Comments = JSON.parse(req.body.Comments)
        let inspection = await Inspection.create(req.body);
        if (inspection) {
            return res.status(200).json({ Inspection: inspection, message: "save information successful", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const getInspection = async (req, res, next) => {
    try {
        let inspection = await Inspection.find().sort({ sortorder: -1 })
        return inspection ? res.status(200).json({ Inspection: inspection, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteInspection = async (req, res, next) => {
    try {
        const inspection = await Inspection.findByIdAndDelete({ _id: req.params.id })
        return (inspection) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const updateInspection = async (req, res, next) => {
    try {
        const inspectionId = req.params.id;
        const existingInspection = await Inspection.findById(inspectionId);
        if (!existingInspection) {
            return res.status(404).json({ error: 'inspection not found', status: false });
        }
        else {
            const updatedInspectionData = req.body;
            await Inspectiondb.findByIdAndUpdate(inspectionId, updatedInspectionData, { new: true });
            return res.status(200).json({ message: 'Inspection Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};  