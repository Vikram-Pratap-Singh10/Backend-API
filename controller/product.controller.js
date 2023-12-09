import axios from "axios";
import { Product } from "../model/product.model.js";
import { getProductHierarchy } from "../rolePermission/permission.js";

export const ProductXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateProduct.xml";
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
        const userId = req.params.id;
        const adminDetails = await getProductHierarchy(userId);
        const adminDetail = adminDetails.length === 1 ? adminDetails[0] : adminDetails;
        let product = await Product.find().sort({ sortorder: -1 })
        return product ? res.status(200).json({ Product: adminDetail, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const ViewProductById = async (req, res, next) => {
    try {
        let product = await Product.findById({ _id: req.params.id }).sort({ sortorder: -1 })
        return product ? res.status(200).json({ Product: product, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const DeleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete({ _id: req.params.id })
        return (product) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const UpdateProduct = async (req, res, next) => {
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
        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: 'product not found', status: false });
        }
        else {
            const updatedProduct = req.body;
            await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
            return res.status(200).json({ message: 'Product Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};