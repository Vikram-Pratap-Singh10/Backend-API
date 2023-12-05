import axios from "axios";

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
        if (req.file) {
            req.body.salesInvoice = req.file.filename
        }
        const pdf = await PDF.create(req.body);
        return pdf ? res.status(200).json({ message: "save data successfull", status: true }) : res.status(400).json({ message: "Bad Request", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const updateGoodDispatch = async (req, res) => {
    try {
        const goodDispatchId = req.params.id;
        const existingGoodDispatch = await PDF.findById({ _id: goodDispatchId });
        if (!existingGoodDispatch) {
            return res.status(404).json({ error: 'goodDispatch not found', status: false });
        }
        else {
            if (req.file) {
                req.body.salesInvoice = req.file.filename
            }
            const updatedGoodDispatch = req.body;
            const updateDetails = await PDF.findByIdAndUpdate(goodDispatchId, updatedGoodDispatch, { new: true });
            return updateDetails ? res.status(200).json({ message: 'Data Updated Successfully', status: true }) : res.status(400).json({ message: "Something Went Wrong" })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err, status: false });
    }
}
export const viewGoodDispatch = async (req, res, next) => {
    try {
        let goodDispatch = await PDF.find().sort({ sortorder: -1 })
        return goodDispatch ? res.status(200).json({ GoodDispatch: goodDispatch, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewGoodDispatchById = async (req, res, next) => {
    try {
        let goodDispatch = await PDF.findById({ _id: req.params.id }).sort({ sortorder: -1 })
        return pdf ? res.status(200).json({ GoodDispatch: goodDispatch, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteGoodDispatch = async (req, res, next) => {
    try {
        const goodDispatch = await PDF.findByIdAndDelete({ _id: req.params.id })
        return (goodDispatch) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}