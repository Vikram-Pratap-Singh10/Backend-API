import axios from "axios";
import { GoodDispatch } from "../model/goodDispatch.model.js";

export const GoodDispathcXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/GoodDispatch.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveGoodDispatch = async (req, res) => {
    try {
        if (req.files) {
            let image = null;
            let images = null;
            req.files.map(file => {
                if (file.fieldname === "invoice") {
                    image = file.filename;
                }
                else {
                    images = file.filename
                }
            })
            req.body.FetchSalesInvoice = image;
            req.body.CNUpload = images
        }
        const goodDispatch = await GoodDispatch.create(req.body);
        return goodDispatch ? res.status(200).json({ message: "save data successfull", status: true }) : res.status(400).json({ message: "Bad Request", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const updateGoodDispatch = async (req, res) => {
    try {
        const goodDispatchId = req.params.id;
        const existingGoodDispatch = await GoodDispatch.findById({ _id: goodDispatchId });
        if (!existingGoodDispatch) {
            return res.status(404).json({ error: 'goodDispatch not found', status: false });
        }
        else {
            if (req.file) {
                req.body.salesInvoice = req.file.filename
            }
            const updatedGoodDispatch = req.body;
            const updateDetails = await GoodDispatch.findByIdAndUpdate(goodDispatchId, updatedGoodDispatch, { new: true });
            return updateDetails ? res.status(200).json({ message: 'Data Updated Successfully', status: true }) : res.status(400).json({ message: "Something Went Wrong" })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err, status: false });
    }
}
export const viewGoodDispatch = async (req, res, next) => {
    try {
        let goodDispatch = await GoodDispatch.find().sort({ sortorder: -1 })
        return goodDispatch ? res.status(200).json({ GoodDispatch: goodDispatch, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewGoodDispatchById = async (req, res, next) => {
    try {
        let goodDispatch = await GoodDispatch.findById({ _id: req.params.id }).sort({ sortorder: -1 })
        return goodDispatch ? res.status(200).json({ GoodDispatch: goodDispatch, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteGoodDispatch = async (req, res, next) => {
    try {
        const goodDispatch = await GoodDispatch.findByIdAndDelete({ _id: req.params.id })
        return (goodDispatch) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}