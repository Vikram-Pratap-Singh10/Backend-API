import mongoose from 'mongoose';
import convert from 'xml-js';
import fs from 'fs';
import axios from 'axios';

// const filePath = "D://sveltose//softnumen-backend//public//PartConfig//customerRegistration.xml"
// const xmlFile = fs.readFileSync(filePath, 'utf8');

// export const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
// function createDynamicSchema(jsonData) {
//     const schemaDefinition = {};
// if (Array.isArray(jsonData.CustomerRegistration.input)) {
//     jsonData.CustomerRegistration.input.forEach((input, index) => {
//         const name = input.name._text;
//         const type = input.type._text;
//         if (type === 'text') {
//             schemaDefinition[name] = String
//         } else if (type == 'date') {
//             schemaDefinition[name] = Date
//         }
//         else if (type == 'number') {
//             schemaDefinition[name] = Number
//         }
//         else {
//             schemaDefinition[name] = String
//             schemaDefinition[drop] = String
//         }
//     });
// } else {
//     const input = jsonData.CustomerRegistration.input;
//     const name = input.name._text;
//     const type = input.type._text;
//     if (type === 'text') {
//         schemaDefinition[name] = String
//     } else if (type == 'date') {
//         schemaDefinition[name] = Date
//     }
//     else if (type == 'number') {
//         schemaDefinition[name] = Number
//     }
//     else {
//         schemaDefinition[name] = String
//     }
// }
// if (Array.isArray(jsonData.CustomerRegistration.MyDropdown.dropdown)) {
//     jsonData.CustomerRegistration.MyDropdown.dropdown.forEach((input, index) => {
//         const drop = input.name._text;
//         schemaDefinition[drop] = String
//     })
// }
// else {
//     const input = jsonData.CustomerRegistration.MyDropdown.dropdown;
//     const drop = input.name._text;
//     schemaDefinition[drop] = String
// }
//     return new mongoose.Schema(schemaDefinition);
// }
// const CustomerSchema = createDynamicSchema(jsonData);
// export const CustomerRegistration = mongoose.model('Customer', CustomerSchema);

async function createSchema() {
    const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/customerRegistration.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));

    const schemaDefinition = {};

    if (Array.isArray(jsonData.CustomerRegistration.input)) {
        jsonData.CustomerRegistration.input.forEach((input, index) => {
            const name = input.name._text;
            const type = input.type._text;
            if (type === 'text') {
                schemaDefinition[name] = String
            } else if (type == 'date') {
                schemaDefinition[name] = Date
            }
            else if (type == 'number') {
                schemaDefinition[name] = Number
            }
            else {
                schemaDefinition[name] = String
                schemaDefinition[drop] = String
            }
        });
    } else {
        const input = jsonData.CustomerRegistration.input;
        const name = input.name._text;
        const type = input.type._text;
        if (type === 'text') {
            schemaDefinition[name] = String
        } else if (type == 'date') {
            schemaDefinition[name] = Date
        }
        else if (type == 'number') {
            schemaDefinition[name] = Number
        }
        else {
            schemaDefinition[name] = String
        }
    }
    if (Array.isArray(jsonData.CustomerRegistration.MyDropdown.dropdown)) {
        jsonData.CustomerRegistration.MyDropdown.dropdown.forEach((input, index) => {
            const drop = input.name._text;
            schemaDefinition[drop] = String
        })
    }
    else {
        const input = jsonData.CustomerRegistration.MyDropdown.dropdown;
        const drop = input.name._text;
        schemaDefinition[drop] = String
    }
    return new mongoose.Schema(schemaDefinition);
}
export const CustomerSchema = await createSchema();
export const CustomerRegistration = mongoose.model('Customer', CustomerSchema);
