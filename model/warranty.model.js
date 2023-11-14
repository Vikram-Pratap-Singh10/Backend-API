import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var attachmentFile = 'attachmentFile';
var comment = 'Comments'
var id = 'id'

async function createSchema() {
    const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/WarrantyConfig.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[id] = String
    schemaDefinition[attachmentFile] = [{}];
    schemaDefinition[comment] = [{ Role: String, userName: String, comment: String, time: String }, { timestamps: true }];
    if (Array.isArray(jsonData.Warranty.input)) {
        jsonData.Warranty.input.forEach((input, index) => {
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
        const input = jsonData.Warranty.input;
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

    if (Array.isArray(jsonData.Warranty.MyDropDown)) {
        jsonData.Warranty.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.Warranty.MyDropDown.dropdown)) {
            jsonData.Warranty.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.Warranty.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    if (Array.isArray(jsonData.Warranty.CheckBox)) {
        jsonData.Warranty.CheckBox.forEach((inputGroup, index) => {
            if (Array.isArray(inputGroup.input)) {
                inputGroup.input.forEach((input) => {
                    const check = input.name._text;
                    const type = input.type._text;
                    if (type === 'Boolean') {
                        schemaDefinition[check] = Boolean;
                    } else {
                        schemaDefinition[check] = String;
                    }
                });
            } else {
                const input = inputGroup.input;
                const check = input.name._text;
                const type = input.type._text;
                if (type === 'Boolean') {
                    schemaDefinition[check] = Boolean;
                } else {
                    schemaDefinition[check] = String;
                }
            }
        });
    } else {
        if (Array.isArray(jsonData.Warranty.CheckBox.input)) {
            jsonData.Warranty.CheckBox.input.forEach((input) => {
                const check = input.name._text;
                const type = input.type._text;
                if (type === 'Boolean') {
                    schemaDefinition[check] = Boolean;
                } else {
                    schemaDefinition[check] = String;
                }
            });
        } else {
            const input = jsonData.Warranty.CheckBox.input;
            const check = input.name._text;
            const type = input.type._text;
            if (type === 'Boolean') {
                schemaDefinition[check] = Boolean;
            } else {
                schemaDefinition[check] = String;
            }
        }
    }

    if (Array.isArray(jsonData.Warranty.Radiobutton.input)) {
        jsonData.Warranty.Radiobutton.input.forEach((input, index) => {
            const check = input.name._text;
            const type = input.type._text
            schemaDefinition[check] = String
        });
    } else {
        const input = jsonData.Warranty.Radiobutton.input;
        const check = input.name._text;
        schemaDefinition[check] = String
    }
    // --------------------------------------------------------
    if (Array.isArray(jsonData.Warranty.ProductDetails.input)) {
        jsonData.Warranty.ProductDetails.input.forEach((input, index) => {
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
        const input = jsonData.Warranty.ProductDetails.input;
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

    if (Array.isArray(jsonData.Warranty.ProductDetails.MyDropDown)) {
        jsonData.Warranty.ProductDetails.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.Warranty.ProductDetails.MyDropDown.dropdown)) {
            jsonData.Warranty.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.Warranty.ProductDetails.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    // -------------------------------------------------------------------
    if (Array.isArray(jsonData.Warranty.PartDetails.input)) {
        jsonData.Warranty.PartDetails.input.forEach((input, index) => {
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
        const input = jsonData.Warranty.PartDetails.input;
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

    if (Array.isArray(jsonData.Warranty.PartDetails.MyDropDown)) {
        jsonData.Warranty.PartDetails.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.Warranty.PartDetails.MyDropDown.dropdown)) {
            jsonData.Warranty.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.Warranty.PartDetails.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    // --------------------------------------------------
    if (Array.isArray(jsonData.Warranty.WType.input)) {
        jsonData.Warranty.WType.input.forEach((input, index) => {
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
        const input = jsonData.Warranty.WType.input;
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


    if (Array.isArray(jsonData.Warranty.WType.MyDropDown)) {
        jsonData.Warranty.WType.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.Warranty.WType.MyDropDown.dropdown)) {
            jsonData.Warranty.WType.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.Warranty.WType.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    // --------------------------------------------------
    if (Array.isArray(jsonData.Warranty.CurrentStatus.MyDropDown)) {
        jsonData.Warranty.CurrentStatus.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.Warranty.CurrentStatus.MyDropDown.dropdown)) {
            jsonData.Warranty.CurrentStatus.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.Warranty.CurrentStatus.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const warrantySchema = await createSchema();
export const Warranty = mongoose.model('Warranty', warrantySchema);