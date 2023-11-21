import axios from "axios";
import { Product } from "../model/product.model.js";

export const ProductXml = async (req, res) => {
    const fileUrl = "https://awsxmlfiles.s3.ap-south-1.amazonaws.com/CreateProduct.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};
export const SaveProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.Product_image = req.file.filename
        }
        if (req.files) {
            let images = [];
            let thumb = null;
            req.files.map(file => {
                if (file.filename != 'file')
                    images.push(file.filename)
                else {
                    thumb = file.filename
                }
            })
            req.body.thumbnail = thumb;
            req.body.images = images;
        }
        const product = await Product.create(req.body)
        return product ? res.status(200).json({ message: "product save successfully", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const ViewProduct = async (req, res, next) => {
    try {
        let product = await Product.find().sort({ sortorder: -1 })
        return product ? res.status(200).json({Product: product, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}