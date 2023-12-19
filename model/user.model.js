import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var status = 'status';
let rolename = 'rolename';
let created_by = 'created_by';
let latitude = "latitude";
let longitude = "longitude";
let currentAddress = "currentAddress";

let stockTransferDate = "stockTransferDate";
let productItems = "productItems";
let grandTotal = "grandTotal";
let currentStock = "currentStock";
let transferStatus = "transferStatus";
let warehouseFromId = "warehouseFromId";
let otpVerify = "otpVerify"

async function createSchema() {
  const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/Createuser.xml');
  const xmlFile = ff.data;
  const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
  const schemaDefinition = {};
  schemaDefinition[rolename] = String;
  schemaDefinition[created_by] = String;
  schemaDefinition[status] = String;
  schemaDefinition[stockTransferDate] = String;
  schemaDefinition[productItems] = [{ productId: String, unitType: String, Size: Number, currentStock: Number, transferQty: Number, price: Number, totalPrice: Number }, { timestamps: true }];
  schemaDefinition[warehouseFromId] = String
  schemaDefinition[grandTotal] = Number;
  schemaDefinition[transferStatus] = String;
  if (Array.isArray(jsonData.CreateUser.input)) {
    jsonData.CreateUser.input.forEach((input, index) => {
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
    const input = jsonData.CreateUser.input;
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
  schemaDefinition[latitude] = Number;
  schemaDefinition[longitude] = Number;
  schemaDefinition[currentAddress] = String;
  if (jsonData.CreateUser.MyDropdown) {
    if (Array.isArray(jsonData.CreateUser.MyDropdown)) {
      jsonData.CreateUser.MyDropdown.forEach((dropdown) => {
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
      if (Array.isArray(jsonData.CreateUser.MyDropdown.dropdown)) {
        jsonData.CreateUser.MyDropdown.dropdown.forEach((item) => {
          const name = item.name._text;
          schemaDefinition[name] = String;
        });
      } else {
        const item = jsonData.CreateUser.MyDropdown.dropdown;
        const name = item.name._text;
        schemaDefinition[name] = String;
      }
    }
  }
  if (jsonData.CreateUser.CheckBox) {
    if (Array.isArray(jsonData.CreateUser.CheckBox.input)) {
      jsonData.CreateUser.CheckBox.input.forEach((input, index) => {
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
      const input = jsonData.CreateUser.CheckBox.input;
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

  if (jsonData.CreateUser.Radiobutton) {
    if (Array.isArray(jsonData.CreateUser.Radiobutton.input)) {
      jsonData.CreateUser.Radiobutton.input.forEach((input, index) => {
        const check = input.name._text;
        const type = input.type._text
        schemaDefinition[check] = String
      });
    } else {
      const input = jsonData.CreateUser.Radiobutton.input;
      const check = input.name._text;
      schemaDefinition[check] = String
    }
  }
  schemaDefinition[otpVerify] = Number;
  return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const UserSchema = await createSchema();
export const User = mongoose.model('user', UserSchema);
