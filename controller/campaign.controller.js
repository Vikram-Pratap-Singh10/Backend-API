import ExcelJS from 'exceljs'
import { Campaign } from "../model/part.model.js";

export const saveCampaign = async (req, res) => {
    try {
        const partType = req.body.partType;
        if (partType === 'Campaigns') {
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
                const insertedDocument = await Campaign.create(document);
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
export const viewCampaign = async (req, res, next) => {
    try {
        let campaign = await Campaign.find();
        return (campaign.length > 0) ? res.status(200).json({ Campaign: campaign, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};