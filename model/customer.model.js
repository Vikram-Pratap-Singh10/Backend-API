import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

async function createSchema() {
  const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateCustomerConfig.xml');
  const xmlFile = ff.data;
  const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
  const schemaDefinition = {};
  if (Array.isArray(jsonData.CreateCustomer.input)) {
    jsonData.CreateCustomer.input.forEach((input, index) => {
      const name = input.name._text;
      const type = input.type._attributes.type;
      if (type === 'text') {
        schemaDefinition[name] = String;
      } else if (type === 'date') {
        schemaDefinition[name] = Date;
      } else if (type === 'number') {
        schemaDefinition[name] = Number;
      } else if (type === 'file') {
        schemaDefinition[name] = [];
      } else {
        schemaDefinition[name] = String;
      }
    });
  } else {
    const input = jsonData.CreateCustomer.input;
    const name = input.name._text;
    const type = input.type._attributes.type;
    if (type === 'text') {
      schemaDefinition[name] = String;
    } else if (type === 'date') {
      schemaDefinition[name] = Date;
    } else if (type === 'number') {
      schemaDefinition[name] = Number;
    } else if (type === 'file') {
      schemaDefinition[name] = [];
    } else {
      schemaDefinition[name] = String;
    }
  }
  if (jsonData.CreateCustomer.MyDropdown) {
    if (Array.isArray(jsonData.CreateCustomer.MyDropdown)) {
      jsonData.CreateCustomer.MyDropdown.forEach((dropdown) => {
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
      if (Array.isArray(jsonData.CreateCustomer.MyDropdown.dropdown)) {
        jsonData.CreateCustomer.MyDropdown.dropdown.forEach((item) => {
          const name = item.name._text;
          schemaDefinition[name] = String;
        });
      } else {
        const item = jsonData.CreateCustomer.MyDropdown.dropdown;
        const name = item.name._text;
        schemaDefinition[name] = String;
      }
    }
  }
  if (jsonData.CreateCustomer.CheckBox) {
    if (Array.isArray(jsonData.CreateCustomer.CheckBox.input)) {
      jsonData.CreateCustomer.CheckBox.input.forEach((input, index) => {
        const check = input.name._text;
        const type = input.type._attributes.type
        if (type === 'Boolean') {
          schemaDefinition[check] = Boolean;
        }
        else {
          schemaDefinition[check] = String
        }
      });
    } else {
      const input = jsonData.CreateCustomer.CheckBox.input;
      const check = input.name._text;
      const type = input.type._attributes.type;
      if (type === 'Boolean') {
        schemaDefinition[check] = Boolean;
      }
      else {
        schemaDefinition[check] = String
      }
    }
  }

  if (jsonData.CreateCustomer.Radiobutton) {
    if (Array.isArray(jsonData.CreateCustomer.Radiobutton.input)) {
      jsonData.CreateCustomer.Radiobutton.input.forEach((input, index) => {
        const check = input.name._text;
        const type = input.type._text
        schemaDefinition[check] = String
      });
    } else {
      const input = jsonData.CreateCustomer.Radiobutton.input;
      const check = input.name._text;
      schemaDefinition[check] = String
    }
  }

  return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const CustomerSchema = await createSchema();
export const Customer = mongoose.model('customer', CustomerSchema);
