import ExcelJS from 'exceljs'
import axios from 'axios';
import { Warranty } from '../model/warranty.model.js';

// export const saveWarranty = async (req, res) => {
//     try {
//         const partType = req.body.partType;
//         if (partType === 'Warranty') {
//             const filePath = await req.file.path;
//             const workbook = new ExcelJS.Workbook();
//             await workbook.xlsx.readFile(filePath);
//             const worksheet = workbook.getWorksheet(1);
//             const headerRow = worksheet.getRow(1);
//             const headings = [];
//             headerRow.eachCell((cell) => {
//                 headings.push(cell.value);
//             });
//             const insertedDocuments = [];
//             for (let rowIndex = 2; rowIndex <= worksheet.actualRowCount; rowIndex++) {
//                 const dataRow = worksheet.getRow(rowIndex);
//                 const document = {};
//                 for (let columnIndex = 1; columnIndex <= headings.length; columnIndex++) {
//                     const heading = headings[columnIndex - 1];
//                     const cellValue = dataRow.getCell(columnIndex).value;
//                     document[heading] = cellValue;
//                 }
//                 const insertedDocument = await Warranty.create(document);
//                 insertedDocuments.push(insertedDocument);
//             }
//             return res.status(200).json({ message: 'Data Inserted Successfully', status: true });
//         }
//         else {
//             return res.status(400).json({ error: "Bad Request", status: false });
//         }

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Internal Server Error', status: false });
//     }
// }
// export const viewWarranty = async (req, res, next) => {
//     try {
//         let warranty = await Warranty.find();
//         return (warranty.length > 0) ? res.status(200).json({ Warranty: warranty, status: true }) : res.status(404).json({ error: "Not Found", status: false })
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(500).json({ error: "Internal Server Error", status: false });
//     }
// };

export const warrantyXml = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/WarrantyConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveWarranty = async (req, res, next) => {
    try {
        // const currentDate = new Date();
        // const startDate = new Date(req.body.warrantyStartDate);
        // const duration = '1 years';
        // const [amount, unit] = duration.split(' ');
        // const endDate = new Date(startDate);
        // if (unit === "years") {
        //     endDate.setFullYear(startDate.getFullYear() + parseInt(amount, 10));
        // } else if (unit === "months") {
        //     endDate.setMonth(startDate.getMonth() + parseInt(amount, 10));
        // }
        // const rTimeMili = endDate - currentDate;
        // const millisecondsInDay = 1000 * 60 * 60 * 24;
        // const millisecondsInMonth = millisecondsInDay * 30.44;
        // const millisecondsInYear = millisecondsInMonth * 12;
        // const rYears = Math.floor(rTimeMili / millisecondsInYear);
        // const rMonths = Math.floor((rTimeMili % millisecondsInYear) / millisecondsInMonth);
        // const rDays = Math.floor((rTimeMili % millisecondsInMonth) / millisecondsInDay);
        // req.body.remainingWarrantyTime = rYears + " years," + rMonths + " months," + rDays + " days";
        // req.body.WarrantyStartDate = format(startDate, 'yyyy-MM-dd');
        // req.body.WarrantyEndDate = format(endDate, 'yyyy-MM-dd');
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
        let warranty = await Warranty.create(req.body);
        if (warranty) {
            return res.status(200).json({ Warranty: warranty, message: "save information successful", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewWarranty = async (req, res, next) => {
    try {
        let warranty = await Warranty.find().sort({ sortorder: -1 })
        return warranty ? res.status(200).json({ Warranty: warranty, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteWarranty = async (req, res, next) => {
    try {
        const warranty = await Warranty.findByIdAndDelete({ _id: req.params.id })
        return (warranty) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const updateWarranty = async (req, res, next) => {
    try {
        const warrantyId = req.params.id;
        const existingWarranty = await Warranty.findById(warrantyId);
        if (!existingWarranty) {
            return res.status(404).json({ error: 'warranty not found', status: false });
        }
        else {
            if (req.files) {
                let images = [];
                req.files.map(file => {
                    images.push(file.filename)
                })
                req.body.attachmentFile = images;
            }
            const updatedWarrantyData = req.body;
            await Warranty.findByIdAndUpdate(warrantyId, updatedWarrantyData, { new: true });
            return res.status(200).json({ message: 'Warranty Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};