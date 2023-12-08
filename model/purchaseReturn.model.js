import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var status = 'status';
let returnItems = "returnItems";
let created_by = 'created_by';
let rolename = 'rolename';

async function createSchema() {
    const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/SalesReturn.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[rolename] = String;
    schemaDefinition[created_by] = String;
    schemaDefinition[status] = String
    if (Array.isArray(jsonData.SalesReturn.input)) {
        jsonData.SalesReturn.input.forEach((input, index) => {
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
        const input = jsonData.SalesReturn.input;
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
    schemaDefinition[returnItems] = []
    if (jsonData.SalesReturn.MyDropDown) {
        if (Array.isArray(jsonData.SalesReturn.MyDropDown)) {
            jsonData.SalesReturn.MyDropDown.forEach((dropdown) => {
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
            if (Array.isArray(jsonData.SalesReturn.MyDropDown.dropdown)) {
                jsonData.SalesReturn.MyDropDown.dropdown.forEach((item) => {
                    const name = item.name._text;
                    schemaDefinition[name] = String;
                });
            } else {
                const item = jsonData.SalesReturn.MyDropDown.dropdown;
                const name = item.name._text;
                schemaDefinition[name] = String;
            }
        }
    }
    if (jsonData.SalesReturn.CheckBox) {
        if (Array.isArray(jsonData.SalesReturn.CheckBox.input)) {
            jsonData.SalesReturn.CheckBox.input.forEach((input, index) => {
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
            const input = jsonData.SalesReturn.CheckBox.input;
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

    if (jsonData.SalesReturn.Radiobutton) {
        if (Array.isArray(jsonData.SalesReturn.Radiobutton.input)) {
            jsonData.SalesReturn.Radiobutton.input.forEach((input, index) => {
                const check = input.name._text;
                const type = input.type._text
                schemaDefinition[check] = String
            });
        } else {
            const input = jsonData.SalesReturn.Radiobutton.input;
            const check = input.name._text;
            schemaDefinition[check] = String
        }
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const PurchaseReturnSchema = await createSchema();
export const PurchaseReturn = mongoose.model('purchaseReturn', PurchaseReturnSchema);
