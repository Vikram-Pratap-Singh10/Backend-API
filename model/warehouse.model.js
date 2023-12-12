import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var status = 'status';
let rolename = 'rolename';
let created_by = 'created_by';
let stockTransferDate = "stockTransferDate";
let productItems = "productItems";
let grandTotal = "grandTotal";
let exportId = 'exportId';

async function createSchema() {
  const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/Warehouse.xml');
  const xmlFile = ff.data;
  const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
  const schemaDefinition = {};
  schemaDefinition[rolename] = String;
  schemaDefinition[created_by] = String;
  schemaDefinition[exportId] = String;
  if (Array.isArray(jsonData.AddWareHouse.input)) {
    jsonData.AddWareHouse.input.forEach((input, index) => {
      const name = input.name._text;
      // const type = input.type._text;
      const type = input.type._attributes.type;
      if (type === 'text') {
        schemaDefinition[name] = String;
      } else if (type === 'date') {
        schemaDefinition[name] = Date;
      } else if (type === 'number') {
        schemaDefinition[name] = Number;
      } else {
        schemaDefinition[name] = String;
      }
    });
  } else {
    const input = jsonData.AddWareHouse.input;
    const name = input.name._text;
    // const type = input.type._text;
    const type = input.type._attributes.type;
    if (type === 'text') {
      schemaDefinition[name] = String;
    } else if (type === 'date') {
      schemaDefinition[name] = Date;
    } else if (type === 'number') {
      schemaDefinition[name] = Number;
    } else {
      schemaDefinition[name] = String;
    }
  }
  schemaDefinition[stockTransferDate] = String;
  schemaDefinition[productItems] = [{ productId: String, unitType: String, Size: String, transferQty: Number, price: Number, totalPrice: Number }, { timestamps: true }];
  schemaDefinition[grandTotal] = Number
  if (jsonData.AddWareHouse.MyDropdown) {
    if (Array.isArray(jsonData.AddWareHouse.MyDropdown)) {
      jsonData.AddWareHouse.MyDropdown.forEach((dropdown) => {
        if (Array.isArray(dropdown.dropdown)) {
          dropdown.dropdown.forEach((item) => {
            const name = item.name._text;
            schemaDefinition[name] = String;
          });
        } else {
          const item = dropdown.dropdown;
          const name = item.name._text;
          schemaDefinition[name] = String;
        }
      });
    } else {
      if (Array.isArray(jsonData.AddWareHouse.MyDropdown.dropdown)) {
        jsonData.AddWareHouse.MyDropdown.dropdown.forEach((item) => {
          const name = item.name._text;
          schemaDefinition[name] = String;
        });
      } else {
        const item = jsonData.AddWareHouse.MyDropdown.dropdown;
        const name = item.name._text;
        schemaDefinition[name] = String;
      }
    }
  }
  if (jsonData.AddWareHouse.CheckBox) {
    if (Array.isArray(jsonData.AddWareHouse.CheckBox.input)) {
      jsonData.AddWareHouse.CheckBox.input.forEach((input, index) => {
        const check = input.name._text;
        // const type = input.type._text
        const type = input.type._attributes.type;
        if (type === 'Boolean') {
          schemaDefinition[check] = Boolean;
        }
        else {
          schemaDefinition[check] = String
        }
      });
    } else {
      const input = jsonData.AddWareHouse.CheckBox.input;
      const check = input.name._text;
      // const type = input.type._text;
      const type = input.type._attributes.type;
      if (type === 'Boolean') {
        schemaDefinition[check] = Boolean;
      }
      else {
        schemaDefinition[check] = String
      }
    }
  }
  if (jsonData.AddWareHouse.Radiobutton) {
    if (Array.isArray(jsonData.AddWareHouse.Radiobutton.input)) {
      jsonData.AddWareHouse.Radiobutton.input.forEach((input, index) => {
        const check = input.name._text;
        const type = input.type._text
        schemaDefinition[check] = String
      });
    } else {
      const input = jsonData.AddWareHouse.Radiobutton.input;
      const check = input.name._text;
      schemaDefinition[check] = String
    }
  }

  schemaDefinition[status] = String
  return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const WarehouseSchema = await createSchema();
export const Warehouse = mongoose.model('warehouse', WarehouseSchema);
