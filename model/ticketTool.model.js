import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var attachmentFile = 'attachmentFile';
var comment = 'Comments';
let id = 'id'

async function createSchema() {
    const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/createTicketConfig.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[id] = String
    schemaDefinition[attachmentFile] = [{}];
    schemaDefinition[comment] = [{ Role: String, userName: String, comment: String, time: String }, { timestamps: true }];
    if (Array.isArray(jsonData.createTicket.input)) {
        jsonData.createTicket.input.forEach((input, index) => {
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
        const input = jsonData.createTicket.input;
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
    if (Array.isArray(jsonData.createTicket.MyDropDown)) {
        jsonData.createTicket.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createTicket.MyDropDown.dropdown)) {
            jsonData.Inspection.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createTicket.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    if (Array.isArray(jsonData.createTicket.CheckBox.input)) {
        jsonData.createTicket.CheckBox.input.forEach((input, index) => {
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
        const input = jsonData.createTicket.CheckBox.input;
        const check = input.name._text;
        const type = input.type._text;
        if (type === 'Boolean') {
            schemaDefinition[check] = Boolean;
        }
        else {
            schemaDefinition[check] = String
        }
    }
    if (Array.isArray(jsonData.createTicket.Radiobutton.input)) {
        jsonData.createTicket.Radiobutton.input.forEach((input, index) => {
            const check = input.name._text;
            const type = input.type._text
            schemaDefinition[check] = String
        });
    } else {
        const input = jsonData.createTicket.Radiobutton.input;
        const check = input.name._text;
        schemaDefinition[check] = String
    }
    // ------------------------------------------------------------------
    if (Array.isArray(jsonData.createTicket.Product.input)) {
        jsonData.createTicket.Product.input.forEach((input, index) => {
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
        const input = jsonData.createTicket.Product.input;
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
    if (Array.isArray(jsonData.createTicket.Product.MyDropDown)) {
        jsonData.createTicket.Product.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createTicket.Product.MyDropDown.dropdown)) {
            jsonData.createTicket.Product.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createTicket.Product.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    // -----------------------------------------------------------------
    if (Array.isArray(jsonData.createTicket.Parts.input)) {
        jsonData.createTicket.Parts.input.forEach((input, index) => {
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
        const input = jsonData.createTicket.Parts.input;
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
    if (Array.isArray(jsonData.createTicket.Parts.MyDropDown)) {
        jsonData.createTicket.Parts.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createTicket.Parts.MyDropDown.dropdown)) {
            jsonData.createTicket.Parts.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createTicket.Parts.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    // ----------------------------------------------------------
    if (Array.isArray(jsonData.createTicket.CurrentStatus.MyDropDown)) {
        jsonData.createTicket.CurrentStatus.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createTicket.CurrentStatus.MyDropDown.dropdown)) {
            jsonData.createTicket.CurrentStatus.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createTicket.CurrentStatus.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const TicketToolSchema = await createSchema();
export const TicketTool = mongoose.model('TicketTool', TicketToolSchema);
