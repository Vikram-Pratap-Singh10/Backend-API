import mongoose from 'mongoose';
import convert from 'xml-js';
import axios from 'axios';

var attachmentFile = 'attachmentFile';
var comment = 'Comments'
var id = 'id'

async function createSchema() {
    const ff = await axios.get('https://aws-xml-file.s3.ap-south-1.amazonaws.com/CreateOrderConfig.xml');
    const xmlFile = ff.data;
    const jsonData = JSON.parse(convert.xml2json(xmlFile, { compact: true, spaces: 2 }));
    const schemaDefinition = {};
    schemaDefinition[id] = String
    schemaDefinition[attachmentFile] = [{}];
    schemaDefinition[comment] = [{ Role: String, userName: String, comment: String, time: String }, { timestamps: true }];
    schemaDefinition.ProductDetail = [{}];
    schemaDefinition.PartDetail = [{}];
    if (Array.isArray(jsonData.createOrder.input)) {
        jsonData.createOrder.input.forEach((input, index) => {
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
        const input = jsonData.createOrder.input;
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

    if (Array.isArray(jsonData.createOrder.MyDropDown)) {
        jsonData.createOrder.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createOrder.MyDropDown.dropdown)) {
            jsonData.createOrder.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createOrder.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    if (Array.isArray(jsonData.createOrder.CheckBox)) {
        jsonData.createOrder.CheckBox.forEach((inputGroup, index) => {
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
        if (Array.isArray(jsonData.createOrder.CheckBox.input)) {
            jsonData.createOrder.CheckBox.input.forEach((input) => {
                const check = input.name._text;
                const type = input.type._text;
                if (type === 'Boolean') {
                    schemaDefinition[check] = Boolean;
                } else {
                    schemaDefinition[check] = String;
                }
            });
        } else {
            const input = jsonData.createOrder.CheckBox.input;
            const check = input.name._text;
            const type = input.type._text;
            if (type === 'Boolean') {
                schemaDefinition[check] = Boolean;
            } else {
                schemaDefinition[check] = String;
            }
        }
    }

    if (jsonData.createOrder.Radiobutton) {
        if (Array.isArray(jsonData.createOrder.Radiobutton.input)) {
            jsonData.createOrder.Radiobutton.input.forEach((input, index) => {
                const check = input.name._text;
                const type = input.type._text
                schemaDefinition[check] = String
            });
        } else {
            const input = jsonData.createOrder.Radiobutton.input;
            const check = input.name._text;
            schemaDefinition[check] = String
        }
    }
    // --------------------------------------------------------
    if (Array.isArray(jsonData.createOrder.ProductDetails.input)) {
        jsonData.createOrder.ProductDetails.input.forEach((input, index) => {
            const name = input.name._text;
            const type = input.type._text;
            if (type === 'text') {
                schemaDefinition.ProductDetail[name] = String;
            } else if (type === 'date') {
                schemaDefinition.ProductDetail[name] = Date;
            } else if (type === 'number') {
                schemaDefinition.ProductDetail[name] = Number;
            } else {
                schemaDefinition.ProductDetail[name] = String;
            }
        });
    } else {
        const input = jsonData.createOrder.ProductDetails.input;
        const name = input.name._text;
        const type = input.type._text;
        if (type === 'text') {
            schemaDefinition.ProductDetail[name] = String;
        } else if (type === 'date') {
            schemaDefinition.ProductDetail[name] = Date;
        } else if (type === 'number') {
            schemaDefinition.ProductDetail[name] = Number;
        } else {
            schemaDefinition.ProductDetail[name] = String;
        }
    }

    if (Array.isArray(jsonData.createOrder.ProductDetails.MyDropDown)) {
        jsonData.createOrder.ProductDetails.MyDropDown.forEach((dropdown) => {
            if (Array.isArray(dropdown.dropdown)) {
                dropdown.dropdown.forEach((item) => {
                    const name = item.name._text;
                    schemaDefinition.ProductDetail[name] = String;
                });
            } else {
                const item = dropdown.dropdown;
                const name = item.name._text;
                schemaDefinition.ProductDetail[name] = String;
            }
        });
    } else {
        if (Array.isArray(jsonData.createOrder.ProductDetails.MyDropDown.dropdown)) {
            jsonData.createOrder.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition.ProductDetail[name] = String;
            });
        } else {
            const item = jsonData.createOrder.ProductDetails.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition.ProductDetail[name] = String;
        }
    }
    // -------------------------------------------------------------------
    if (Array.isArray(jsonData.createOrder.PartDetails.input)) {
        jsonData.createOrder.PartDetails.input.forEach((input, index) => {
            const name = input.name._text;
            const type = input.type._text;
            if (type === 'text') {
                schemaDefinition.PartDetail[name] = String;
            } else if (type === 'date') {
                schemaDefinition.PartDetail[name] = Date;
            } else if (type === 'number') {
                schemaDefinition.PartDetail[name] = Number;
            } else {
                schemaDefinition.PartDetail[name] = String;
            }
        });
    } else {
        const input = jsonData.createOrder.PartDetails.input;
        const name = input.name._text;
        const type = input.type._text;
        if (type === 'text') {
            schemaDefinition.PartDetail[name] = String;
        } else if (type === 'date') {
            schemaDefinition.PartDetail[name] = Date;
        } else if (type === 'number') {
            schemaDefinition.PartDetail[name] = Number;
        } else {
            schemaDefinition.PartDetail[name] = String;
        }
    }
    if (jsonData.createOrder.PartDetails.MyDropDown) {
        if (Array.isArray(jsonData.createOrder.PartDetails.MyDropDown)) {
            jsonData.createOrder.PartDetails.MyDropDown.forEach((dropdown) => {
                if (Array.isArray(dropdown.dropdown)) {
                    dropdown.dropdown.forEach((item) => {
                        const name = item.name._text;
                        schemaDefinition.PartDetail[name] = String;
                    });
                } else {
                    const item = dropdown.dropdown;
                    const name = item.name._text;
                    schemaDefinition.PartDetail[name] = String;
                }
            });
        } else {
            if (Array.isArray(jsonData.createOrder.PartDetails.MyDropDown.dropdown)) {
                jsonData.createOrder.MyDropDown.dropdown.forEach((item) => {
                    const name = item.name._text;
                    schemaDefinition.PartDetail[name] = String;
                });
            } else {
                const item = jsonData.createOrder.PartDetails.MyDropDown.dropdown;
                const name = item.name._text;
                schemaDefinition.PartDetail[name] = String;
            }
        }
    }
    // --------------------------------------------------
    if (Array.isArray(jsonData.createOrder.OType.input)) {
        jsonData.createOrder.OType.input.forEach((input, index) => {
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
        const input = jsonData.createOrder.OType.input;
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


    if (Array.isArray(jsonData.createOrder.OType.MyDropDown)) {
        jsonData.createOrder.OType.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createOrder.OType.MyDropDown.dropdown)) {
            jsonData.createOrder.OType.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createOrder.OType.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    // --------------------------------------------------
    if (Array.isArray(jsonData.createOrder.CurrentStatus.MyDropDown)) {
        jsonData.createOrder.CurrentStatus.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createOrder.CurrentStatus.MyDropDown.dropdown)) {
            jsonData.createOrder.CurrentStatus.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createOrder.CurrentStatus.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    // --------------------------------------------------------
    if (Array.isArray(jsonData.createOrder.OType.SuppliedBy.MyDropDown)) {
        jsonData.createOrder.OType.SuppliedBy.MyDropDown.forEach((dropdown) => {
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
        if (Array.isArray(jsonData.createOrder.OType.SuppliedBy.MyDropDown.dropdown)) {
            jsonData.createOrder.OType.SuppliedBy.MyDropDown.dropdown.forEach((item) => {
                const name = item.name._text;
                schemaDefinition[name] = String;
            });
        } else {
            const item = jsonData.createOrder.OType.SuppliedBy.MyDropDown.dropdown;
            const name = item.name._text;
            schemaDefinition[name] = String;
        }
    }
    return new mongoose.Schema(schemaDefinition, { timestamps: true });
}

export const createOrderSchema = await createSchema();
export const createOrder = mongoose.model('createOrder', createOrderSchema);