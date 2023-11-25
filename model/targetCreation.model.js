import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var status = 'status'

async function createSchema() {
    const ff = await axios.get('https://xmlfile.blr1.cdn.digitaloceanspaces.com/TargetCreation.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};

    if (Array.isArray(jsonData.CreateTarget.input)) {
        jsonData.CreateTarget.input.forEach((input, index) => {
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
        const input = jsonData.CreateTarget.input;
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
    if (jsonData.CreateTarget.MyDropDown) {
        if (Array.isArray(jsonData.CreateTarget.MyDropDown)) {
            jsonData.CreateTarget.MyDropDown.forEach((dropdown) => {
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
            if (Array.isArray(jsonData.CreateTarget.MyDropDown.dropdown)) {
                jsonData.CreateTarget.MyDropDown.dropdown.forEach((item) => {
                    const name = item.name._text;
                    schemaDefinition[name] = String;
                });
            } else {
                const item = jsonData.CreateTarget.MyDropDown.dropdown;
                const name = item.name._text;
                schemaDefinition[name] = String;
            }
        }
    }
    if (jsonData.CreateTarget.CheckBox) {
        if (Array.isArray(jsonData.CreateTarget.CheckBox.input)) {
            jsonData.CreateTarget.CheckBox.input.forEach((input, index) => {
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
            const input = jsonData.CreateTarget.CheckBox.input;
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

    if (jsonData.CreateTarget.Radiobutton) {
        if (Array.isArray(jsonData.CreateTarget.Radiobutton.input)) {
            jsonData.CreateTarget.Radiobutton.input.forEach((input, index) => {
                const check = input.name._text;
                const type = input.type._text
                schemaDefinition[check] = String
            });
        } else {
            const input = jsonData.CreateTarget.Radiobutton.input;
            const check = input.name._text;
            schemaDefinition[check] = String
        }
    }
    schemaDefinition[status] = String;
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const TargetCreationSchema = await createSchema();
export const TargetCreation = mongoose.model('targetCreation', TargetCreationSchema);
