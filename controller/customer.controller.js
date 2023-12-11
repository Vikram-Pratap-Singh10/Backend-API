import ExcelJS from 'exceljs'
import axios from 'axios';
import { Customer } from '../model/customer.model.js';
import { findUserDetails, getCustomerHierarchy, getUser, getUserHierarchy } from '../rolePermission/permission.js';
import { User } from '../model/user.model.js';

export const CustomerXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateCustomerConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveCustomer = async (req, res, next) => {
    try {
        if (req.files) {
            let image = [];
            let images = [];
            req.files.map(file => {
                if (file.fieldname === "file") {
                    image.push(file.filename)
                }
                else {
                    images.push(file.filename)
                }
            })
            req.body.Shopphoto = image;
            req.body.photo = images
        }
        const customer = await Customer.create(req.body)
        return customer ? res.status(200).json({ message: "Data Save Successfully", Customer: customer, status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
}
export const ViewCustomer = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const adminDetail = await getCustomerHierarchy(userId);
        // const adminDetail = adminDetails.length === 1 ? adminDetails[0] : adminDetails;
        let customer = await Customer.find().sort({ sortorder: -1 })
        return customer ? res.status(200).json({ Customer: adminDetail, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const ViewCustomerById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const adminDetails = await getCustomerHierarchy(userId);
        const adminDetail = adminDetails.length === 1 ? adminDetails[0] : adminDetails;
        console.log(adminDetail)
        let customer = await Customer.find({ _id: req.params.id }).sort({ sortorder: -1 })
        return customer ? res.status(200).json({ Customer: customer, adminDetail, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const DeleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByIdAndDelete({ _id: req.params.id })
        return (customer) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const UpdateCustomer = async (req, res, next) => {
    try {
        if (req.files) {
            let image = [];
            let images = [];
            req.files.map(file => {
                if (file.fieldname === "file") {
                    image.push(file.filename)
                }
                else {
                    images.push(file.filename)
                }
            })
            req.body.Shopphoto = image;
            req.body.photo = images
        }
        const customerId = req.params.id;
        const existingCustomer = await Customer.findById(customerId);
        if (!existingCustomer) {
            return res.status(404).json({ error: 'user not found', status: false });
        }
        else {
            const updatedCustomer = req.body;
            await Customer.findByIdAndUpdate(customerId, updatedCustomer, { new: true });
            return res.status(200).json({ message: 'Customer Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};