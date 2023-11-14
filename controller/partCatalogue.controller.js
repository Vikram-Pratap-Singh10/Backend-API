import ExcelJS from 'exceljs'
import { PartCatalogue, ServiceRate } from "../model/part.model.js"

export const saveParts = async (req, res) => {
  try {
    const partType = req.body.partType;
    if (partType === 'PartsCatalogue') {
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
        const existingRecord = await PartCatalogue.findOne({
          Part_Number: document.Part_Number,
        });
        if (!existingRecord) {
          const insertedDocument = await PartCatalogue.create(document);
          insertedDocuments.push(insertedDocument);
        } else {
          existingParts.push(document.Part_Number);
        }
      }
      let message = 'Data Inserted Successfully';
      if (existingParts.length > 0) {
        message = `Some parts already exist: ${existingParts.join(', ')}`;
      }
      return res.status(200).json({ message, status: true });
    }
    else {
      return res.status(400).json({ error: "Bad Request", status: false });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error', status: false });
  }
}
export const viewParts = async (req, res, next) => {
  try {
    let front = await PartCatalogue.find();
    const Parts_Catalogue = {};
    front.forEach((part) => {
      if (part.Part_Catalogue === "Table1- FRONT AXLE SUBASSEMBLY") {
        if (!Parts_Catalogue.frontAxleSubassembly) {
          Parts_Catalogue.frontAxleSubassembly = [];
        }
        Parts_Catalogue.frontAxleSubassembly.push(part);
      } else if (part.Part_Catalogue === "Table2- BACK AXLE SUBASSEMBLY") {
        if (!Parts_Catalogue.backAxleSubassembly) {
          Parts_Catalogue.backAxleSubassembly = [];
        }
        Parts_Catalogue.backAxleSubassembly.push(part);
      }
      else if (part.Part_Catalogue === "Table3- LEFT SIDE AXLE SUBASSEMBLY") {
        if (!Parts_Catalogue.leftAxleSubassembly) {
          Parts_Catalogue.leftAxleSubassembly = [];
        }
        Parts_Catalogue.leftAxleSubassembly.push(part);
      }
    });
    return front ? res.status(200).json({ Parts_Catalogue, status: true }) : res.status(404).json({ error: "Not Found", status: false })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false });
  }
};
export const viewPartCatalogue = async (req, res, next) => {
  try {
    let parts = await PartCatalogue.find();
    return (parts.length > 0) ? res.status(200).json({ Parts: parts, status: true }) : res.status(404).json({ error: "Not Found", status: false })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false });
  }
};
export const getPartCatalogueById = async (req, res, next) => {
  try {

    const partCatalogue = await PartCatalogue.findById({ _id: req.params.id })
    if (!partCatalogue) {
      return res.status(404).json({ message: 'Not Found', status: false })
    }
    const serviceRate = await ServiceRate.findOne({ SerialNo: partCatalogue.Part_Number })
    return partCatalogue ? res.status(200).json({ PartCatalogue: partCatalogue, serviceRate, status: true }) : res.status(401).json({ error: "Bad Request", status: false })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false })
  }
}