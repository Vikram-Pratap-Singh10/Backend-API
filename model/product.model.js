import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var status = 'status'
let rolename = 'rolename';
let created_by = 'created_by';

async function createSchema() {
    const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateProduct.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[rolename] = String;
    schemaDefinition[created_by] = String;
    schemaDefinition[status] = String
    if (Array.isArray(jsonData.createProduct.input)) {
        jsonData.createProduct.input.forEach((input, index) => {
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
        const input = jsonData.createProduct.input;
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
    if (jsonData.createProduct.MyDropDown) {
        if (Array.isArray(jsonData.createProduct.MyDropDown)) {
            jsonData.createProduct.MyDropDown.forEach((dropdown) => {
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
            if (Array.isArray(jsonData.createProduct.MyDropDown.dropdown)) {
                jsonData.createProduct.MyDropDown.dropdown.forEach((item) => {
                    const name = item.name._text;
                    schemaDefinition[name] = String;
                });
            } else {
                const item = jsonData.createProduct.MyDropDown.dropdown;
                const name = item.name._text;
                schemaDefinition[name] = String;
            }
        }
    }
    if (jsonData.createProduct.CheckBox) {
        if (Array.isArray(jsonData.createProduct.CheckBox.input)) {
            jsonData.createProduct.CheckBox.input.forEach((input, index) => {
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
            const input = jsonData.createProduct.CheckBox.input;
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

    if (jsonData.createProduct.Radiobutton) {
        if (Array.isArray(jsonData.createProduct.Radiobutton.input)) {
            jsonData.createProduct.Radiobutton.input.forEach((input, index) => {
                const check = input.name._text;
                const type = input.type._text
                schemaDefinition[check] = String
            });
        } else {
            const input = jsonData.createProduct.Radiobutton.input;
            const check = input.name._text;
            schemaDefinition[check] = String
        }
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const ProductSchema = await createSchema();
export const Product = mongoose.model('product', ProductSchema);
