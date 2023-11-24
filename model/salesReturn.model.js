import fs from 'fs';
import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

const status = 'status';

async function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function createSchema() {
    const filePath = 'D://Backend-API//public//ExcelFile//SalesReturn.xml';

    try {
        const xmlFile = await readFileAsync(filePath);
        const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
        const schemaDefinition = {};
        // ... (rest of your code remains the same)
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
    } catch (error) {
        console.error('Error reading or parsing the file:', error);
        throw error;
    }
}

const SalesReturnSchema = await createSchema();
export const SalesReturn = mongoose.model('salesReturn', SalesReturnSchema);
