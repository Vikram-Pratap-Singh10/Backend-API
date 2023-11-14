import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';
var attachmentFile = 'attachmentFile';
var comment = 'Comments';
var id = 'id';

async function createSchema() {
    const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/createWikiConfig.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[id] = String
    schemaDefinition[attachmentFile] = [{ Role: String, userName: String, time: String, images: [] }];
    schemaDefinition[comment] = [{ Role: String, userName: String, comment: String, time: String }, { timestamps: true }];
    if (Array.isArray(jsonData.createWiki.input)) {
        jsonData.createWiki.input.forEach((input, index) => {
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
        const input = jsonData.createWiki.input;
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
    if (Array.isArray(jsonData.createWiki.MyDropDown)) {
        jsonData.createWiki.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createWiki.MyDropDown.dropdown)) {
            jsonData.createWiki.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createWiki.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    if (Array.isArray(jsonData.createWiki.CheckBox.input)) {
        jsonData.createWiki.CheckBox.input.forEach((input, index) => {
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
        const input = jsonData.createWiki.CheckBox.input;
        const check = input.name._text;
        const type = input.type._text;
        if (type === 'Boolean') {
            schemaDefinition[check] = Boolean;
        }
        else {
            schemaDefinition[check] = String
        }
    }
    if (Array.isArray(jsonData.createWiki.Radiobutton.input)) {
        jsonData.createWiki.Radiobutton.input.forEach((input, index) => {
            const check = input.name._text;
            const type = input.type._text
            schemaDefinition[check] = String
        });
    } else {
        const input = jsonData.createWiki.Radiobutton.input;
        const check = input.name._text;
        schemaDefinition[check] = String
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const WikiSchema = await createSchema();
export const ProductWiKi = mongoose.model('productwiki', WikiSchema);
