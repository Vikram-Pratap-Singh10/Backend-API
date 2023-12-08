import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var status = 'status'
let created_by = 'created_by';
let rolename = 'rolename';

async function createSchema() {
    const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateSalesmanConfig%5D.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[rolename] = String;
    schemaDefinition[created_by] = String;
    schemaDefinition[status] = String
    if (Array.isArray(jsonData.Createsalesman.input)) {
        jsonData.Createsalesman.input.forEach((input, index) => {
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
        const input = jsonData.Createsalesman.input;
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
    if (jsonData.Createsalesman.MyDropDown) {
        if (Array.isArray(jsonData.Createsalesman.MyDropDown)) {
            jsonData.Createsalesman.MyDropDown.forEach((dropdown) => {
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
            if (Array.isArray(jsonData.Createsalesman.MyDropDown.dropdown)) {
                jsonData.Createsalesman.MyDropDown.dropdown.forEach((item) => {
                    const name = item.name._text;
                    schemaDefinition[name] = String;
                });
            } else {
                const item = jsonData.Createsalesman.MyDropDown.dropdown;
                const name = item.name._text;
                schemaDefinition[name] = String;
            }
        }
    }
    if (jsonData.Createsalesman.CheckBox) {
        if (Array.isArray(jsonData.Createsalesman.CheckBox.input)) {
            jsonData.Createsalesman.CheckBox.input.forEach((input, index) => {
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
            const input = jsonData.Createsalesman.CheckBox.input;
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

    if (jsonData.Createsalesman.Radiobutton) {
        if (Array.isArray(jsonData.Createsalesman.Radiobutton.input)) {
            jsonData.Createsalesman.Radiobutton.input.forEach((input, index) => {
                const check = input.name._text;
                const type = input.type._text
                schemaDefinition[check] = String
            });
        } else {
            const input = jsonData.Createsalesman.Radiobutton.input;
            const check = input.name._text;
            schemaDefinition[check] = String
        }
    }

    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const SalesPersonSchema = await createSchema();
export const SalesPerson = mongoose.model('salesPerson', SalesPersonSchema);
