import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

let status = 'status';

async function createSchema() {
    const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/GoodDispatch.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    if (Array.isArray(jsonData.GoodDispatch.input)) {
        jsonData.GoodDispatch.input.forEach((input, index) => {
            const name = input.name._text;
            const type = input.type._attributes.type;
            if (type === 'text') {
                schemaDefinition[name] = String;
            } else if (type === 'date') {
                schemaDefinition[name] = Date;
            } else if (type === 'number') {
                schemaDefinition[name] = Number;
            } else if (type === 'file') {
                schemaDefinition[name] = String;
            } else {
                schemaDefinition[name] = String;
            }
        });
    } else {
        const input = jsonData.GoodDispatch.input;
        const name = input.name._text;
        const type = input.type._attributes.type;
        if (type === 'text') {
            schemaDefinition[name] = String;
        } else if (type === 'date') {
            schemaDefinition[name] = Date;
        } else if (type === 'number') {
            schemaDefinition[name] = Number;
        } else if (type === 'file') {
            schemaDefinition[name] = String;
        } else {
            schemaDefinition[name] = String;
        }
    }
    if (jsonData.GoodDispatch.MyDropdown) {
        if (Array.isArray(jsonData.GoodDispatch.MyDropdown)) {
            jsonData.GoodDispatch.MyDropdown.forEach((dropdown) => {
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
            if (Array.isArray(jsonData.GoodDispatch.MyDropdown.dropdown)) {
                jsonData.GoodDispatch.MyDropdown.dropdown.forEach((item) => {
                    const name = item.name._text;
                    schemaDefinition[name] = String;
                });
            } else {
                const item = jsonData.GoodDispatch.MyDropdown.dropdown;
                const name = item.name._text;
                schemaDefinition[name] = String;
            }
        }
    }
    if (jsonData.GoodDispatch.CheckBox) {
        if (Array.isArray(jsonData.GoodDispatch.CheckBox.input)) {
            jsonData.GoodDispatch.CheckBox.input.forEach((input, index) => {
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
            const input = jsonData.GoodDispatch.CheckBox.input;
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
    if (jsonData.GoodDispatch.Radiobutton) {
        if (Array.isArray(jsonData.GoodDispatch.Radiobutton.input)) {
            jsonData.GoodDispatch.Radiobutton.input.forEach((input, index) => {
                const check = input.name._text;
                const type = input.type._text
                schemaDefinition[check] = String
            });
        } else {
            const input = jsonData.GoodDispatch.Radiobutton.input;
            const check = input.name._text;
            schemaDefinition[check] = String
        }
    }
    schemaDefinition[status] = String;
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const GoodDispatchSchema = await createSchema();
export const GoodDispatch = mongoose.model('goodDispatch', GoodDispatchSchema);
