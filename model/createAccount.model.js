import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

async function createSchema() {
  const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/createAccount.xml');
  const xmlFile = ff.data;
  const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
  const schemaDefinition = {};

  if (Array.isArray(jsonData.CreateAccount.input)) {
    jsonData.CreateAccount.input.forEach((input, index) => {
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
    const input = jsonData.CreateAccount.input;
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

  if (Array.isArray(jsonData.CreateAccount.MyDropdown.dropdown)) {
    jsonData.CreateAccount.MyDropdown.dropdown.forEach((input, index) => {
      const drop = input.name._text;
      schemaDefinition[drop] = String;
    });
  } else {
    const input = jsonData.CreateAccount.MyDropdown.dropdown;
    const drop = input.name._text;
    schemaDefinition[drop] = String;
  }

  if (Array.isArray(jsonData.CreateAccount.CheckBox.input)) {
    jsonData.CreateAccount.CheckBox.input.forEach((input, index) => {
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
    const input = jsonData.CreateAccount.CheckBox.input;
    const check = input.name._text;
    const type = input.type._text;
    if (type === 'Boolean') {
      schemaDefinition[check] = Boolean;
    }
    else {
      schemaDefinition[check] = String
    }
  }
  if (Array.isArray(jsonData.CreateAccount.Radiobutton.input)) {
    jsonData.CreateAccount.Radiobutton.input.forEach((input, index) => {
      const check = input.name._text;
      const type = input.type._text
      schemaDefinition[check] = String
    });
  } else {
    const input = jsonData.CreateAccount.Radiobutton.input;
    const check = input.name._text;
    schemaDefinition[check] = String
  }

  return new mongoose.Schema(schemaDefinition,{timestamps:true});
}

export const createAccountSchema = await createSchema();
export const AccountCreate = mongoose.model('CreateAccount', createAccountSchema);
