import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

async function createSchema() {
  const ff = await axios.get('https://awsxmlfiles.s3.ap-south-1.amazonaws.com/AddWarehouseConfig.xml');
  const xmlFile = ff.data;
  const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
  const schemaDefinition = {};
  if (Array.isArray(jsonData.AddWareHouse.input)) {
    jsonData.AddWareHouse.input.forEach((input, index) => {
      const name = input.name._text;
      const type = input.type._text;
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
    const type = input.type._text;
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
  if (jsonData.AddWareHouse.MyDropdown) {
    if (Array.isArray(jsonData.AddWareHouse.MyDropdown.dropdown)) {
      jsonData.AddWareHouse.MyDropdown.dropdown.forEach((input, index) => {
        const drop = input.name._text;
        schemaDefinition[drop] = String;
      });
    } else {
      const input = jsonData.AddWareHouse.MyDropdown.dropdown;
      const drop = input.name._text;
      schemaDefinition[drop] = String;
    }
    if (jsonData.AddWareHouse.CheckBox) {
      if (Array.isArray(jsonData.AddWareHouse.CheckBox.input)) {
        jsonData.AddWareHouse.CheckBox.input.forEach((input, index) => {
          const check = input.name._text;
          const type = input.type._text
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
        const type = input.type._text;
        if (type === 'Boolean') {
          schemaDefinition[check] = Boolean;
        }
        else {
          schemaDefinition[check] = String
        }
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

  return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const WarehouseSchema = await createSchema();
export const Warehouse = mongoose.model('warehouse', WarehouseSchema);
