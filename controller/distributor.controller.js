import ExcelJS from 'exceljs'
import { Distributors } from "../model/part.model.js";

export const saveDistributor = async (req, res) => {
    try {
        const partType = req.body.partType;
        if (partType === 'Distributors') {
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
              const insertedDocument = await Distributors.create(document);
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
export const viewDistributor = async (req, res, next) => {
    try {
        let distributor = await Distributors.find();
        return (distributor.length >0) ? res.status(200).json({Distributor: distributor, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};