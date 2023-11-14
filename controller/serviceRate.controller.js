import ExcelJS from 'exceljs'
import { ServiceRate } from '../model/part.model.js';

export const saveServiceRate = async (req, res) => {
    try {
        const partType = req.body.partType;
        if (partType === 'ServiceRate') {
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
                const existingRecord = await ServiceRate.findOne({
                    SerialNo: document.SerialNo,
                });
                if (!existingRecord) {
                    const insertedDocument = await ServiceRate.create(document);
                    insertedDocuments.push(insertedDocument);
                } else {
                    existingParts.push(document.SerialNo);
                }
            }
            let time = new Date()
            let message = 'Data Inserted Successfully';
            if (existingParts.length > 0) {
                message = `${existingParts.length} record already exist: ${existingParts.join(', ')}`;
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
export const viewServiceRate = async (req, res, next) => {
    try {
        let servicing = await ServiceRate.find();
        return (servicing.length > 0) ? res.status(200).json({ Servicing: servicing, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
export const deleteServiceRate = async (req, res, next) => {
    try {
        const sparePart = await ServiceRate.findByIdAndDelete({ _id: req.params.id })
        return sparePart ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}