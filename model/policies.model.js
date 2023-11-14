import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var attachmentFile = 'attachmentFile';
var comment = 'Comments'
var id = 'id'
var remainingPolicyTime = 'remainingPolicyTime'

async function createSchema() {
    const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/PolicyConfig.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[id] = String
    schemaDefinition[remainingPolicyTime] = String;
    schemaDefinition[attachmentFile] = [{ Role: String, userName: String, time: String, images: [] }];
    schemaDefinition[comment] = [{ Role: String, userName: String, comment: String, time: String }, { timestamps: true }];
    if (Array.isArray(jsonData.Policy.input)) {
        jsonData.Policy.input.forEach((input, index) => {
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
        const input = jsonData.Policy.input;
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
    if (Array.isArray(jsonData.Policy.MyDropDown)) {
        jsonData.Policy.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.Policy.MyDropDown.dropdown)) {
            jsonData.Policy.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.Policy.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }


    if (Array.isArray(jsonData.Policy.Radiobutton.input)) {
        jsonData.Policy.Radiobutton.input.forEach((input, index) => {
            const check = input.name._text;
            const type = input.type._text
            schemaDefinition[check] = String
        });
    } else {
        const input = jsonData.Policy.Radiobutton.input;
        const check = input.name._text;
        schemaDefinition[check] = String
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const policySchema = await createSchema();
export const Policy = mongoose.model('policy', policySchema);
