import axios from "axios";
import { Warranty } from "../model/warranty.model.js";

export const reportXml = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/reportwarrantyConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const warrantyReport = async (req, res, next) => {
    try {
        if (req.body.role === 'warranty') {
            const warranty = await Warranty.findOne({ _id: req.body.id })
            const currentDate = new Date();
            const warrantyCreationDate = new Date(warranty.createdAt);
            const createDate = currentDate - warrantyCreationDate;
            const milliSecDay = 1000 * 60 * 60 * 24;
            const milliSeMonths = milliSecDay * 30.44
            const milliSeYears = milliSeMonths * 12
            const years = Math.floor(createDate / milliSeYears)
            const months = Math.floor((createDate % milliSeYears) / milliSeMonths)
            const days = Math.floor((createDate % milliSeMonths) / milliSecDay)
            const age = `${years} years, ${months} months, ${days} days`
            console.log(age)
            if (req.files) {
                let images = [];
                req.files.map(file => {
                    images.push(file.filename)
                })
                req.body.attachmentFile = images;
            }
            // const report = await Warranty.create(req.body)
            // return res.status(200).json({ message: "Information Save Successfully", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}