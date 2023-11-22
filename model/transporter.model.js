import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

async function createSchema() {
  const ff = await axios.get('https://awsxmlfiles.s3.ap-south-1.amazonaws.com/CreateTransporter.xml');
  const xmlFile = ff.data;
  const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
  const schemaDefinition = {};
  if (Array.isArray(jsonData.CreateTransporter.input)) {
    jsonData.CreateTransporter.input.forEach((input, index) => {
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
    const input = jsonData.CreateTransporter.input;
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
  if (jsonData.CreateTransporter.MyDropdown) {
    if (Array.isArray(jsonData.CreateTransporter.MyDropdown)) {
      jsonData.CreateTransporter.MyDropdown.forEach((dropdown) => {
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
      if (Array.isArray(jsonData.CreateTransporter.MyDropdown.dropdown)) {
        jsonData.CreateTransporter.MyDropdown.dropdown.forEach((item) => {
          const name = item.name._text;
          schemaDefinition[name] = String;
        });
      } else {
        const item = jsonData.CreateTransporter.MyDropdown.dropdown;
        const name = item.name._text;
        schemaDefinition[name] = String;
      }
    }
  }
  if (jsonData.CreateTransporter.CheckBox) {
    if (Array.isArray(jsonData.CreateTransporter.CheckBox.input)) {
      jsonData.CreateTransporter.CheckBox.input.forEach((input, index) => {
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
      const input = jsonData.CreateTransporter.CheckBox.input;
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

  if (jsonData.CreateTransporter.Radiobutton) {
    if (Array.isArray(jsonData.CreateTransporter.Radiobutton.input)) {
      jsonData.CreateTransporter.Radiobutton.input.forEach((input, index) => {
        const check = input.name._text;
        const type = input.type._text
        schemaDefinition[check] = String
      });
    } else {
      const input = jsonData.CreateTransporter.Radiobutton.input;
      const check = input.name._text;
      schemaDefinition[check] = String
    }
  }

  return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const TransporterSchema = await createSchema();
export const Transporter = mongoose.model('transporter', TransporterSchema);
