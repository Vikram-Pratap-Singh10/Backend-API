import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var attachmentFile = 'attachmentFile';
var comment = 'Comments';
let id = 'id'

async function createSchema() {
    const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/InspectionConfig.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[id]= String
    schemaDefinition[attachmentFile] = [{}];
    schemaDefinition[comment] = [{ Role: String, userName: String, comment: String, time: String }, { timestamps: true }];
    console.log(jsonData)
    if (Array.isArray(jsonData.Inspection.input)) {
        jsonData.Inspection.input.forEach((input, index) => {
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
        const input = jsonData.Inspection.input;
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
    if (Array.isArray(jsonData.Inspection.MyDropDown)) {
        jsonData.Inspection.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.Inspection.MyDropDown.dropdown)) {
            jsonData.Inspection.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.Inspection.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    if (Array.isArray(jsonData.Inspection.CheckBox.input)) {
        jsonData.Inspection.CheckBox.input.forEach((input, index) => {
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
        const input = jsonData.Inspection.CheckBox.input;
        const check = input.name._text;
        const type = input.type._text;
        if (type === 'Boolean') {
            schemaDefinition[check] = Boolean;
        }
        else {
            schemaDefinition[check] = String
        }
    }
    if (Array.isArray(jsonData.Inspection.Radiobutton.input)) {
        jsonData.Inspection.Radiobutton.input.forEach((input, index) => {
            const check = input.name._text;
            const type = input.type._text
            schemaDefinition[check] = String
        });
    } else {
        const input = jsonData.Inspection.Radiobutton.input;
        const check = input.name._text;
        schemaDefinition[check] = String
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const InspectionSchema = await createSchema();
export const Inspection = mongoose.model('Inspection', InspectionSchema);
