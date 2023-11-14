import dotenv from "dotenv"
import axios from "axios";
import { ProductWiKi } from "../model/createWikiConfig.model.js";
dotenv.config();


export const createWiki = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/createWikiConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};
export const saveProductWiKi = async (req, res, next) => {
    try {
        const { Role, userName, time } = req.body;
        if (req.files) {
            let images = []
            req.files.map(file => {
                images.push(file.filename)
            })
            const push = await { Role: Role, userName: userName, time: time, images: images }
            req.body.attachmentFile = await push
        }
        req.body.Comments = JSON.parse(req.body.Comments)
        // if (req.body.comment) {
        //     const push = await { Role: Role, userName: userName, time: time, comment: req.body.comment }
        //     req.body.Comments = await push;
        // }
        let productWiKi = await ProductWiKi.create(req.body);
        if (productWiKi) {
            return res.status(200).json({ ProductWiKi: productWiKi, message: "save information successful", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewProductWiki = async (req, res, next) => {
    try {
        let productWiki = await ProductWiKi.find().sort({ sortorder: -1 })
        return productWiki ? res.status(200).json({ ProductWiki: productWiki, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteProductWiki = async (req, res, next) => {
    try {
        const productWiki = await ProductWiKi.findByIdAndDelete({ _id: req.params.id })
        return (productWiki) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const updateProductWiki = async (req, res, next) => {
    try {
        if (req.files) {
            let images = []
            req.files.map(file => {
                images.push(file.filename)
            })
            const { Role, userName, time } = req.body;
            const push = await { Role: Role, userName: userName, time: time, images: images }
            req.body.attachmentFile = await push
        }
        const wikiId = req.params.id;
        const updatedWikiData = req.body;
        const existingAccount = await ProductWiKi.findById(wikiId);
        if (!existingAccount) {
            return res.status(404).json({ error: 'ProductWiki not found', status: false });
        }
        await ProductWiKi.findByIdAndUpdate(wikiId, updatedWikiData, { new: true });
        return res.status(200).json({ message: 'ProductWiki Updated Successfully', status: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};

export const AddComment = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const addComment = req.body.Comments;
        const existingPolicy = await ProductWiKi.findById({ _id: userId });
        if (!existingPolicy) {
            return res.status(400).json({ error: "ProductWiki not found", status: false });
        } else {
            const updatedProductWiki = await ProductWiKi.findByIdAndUpdate(userId, { $push: { Comments: { $each: addComment } } }, { new: true });
            return updatedProductWiki ? res.status(201).json({ message: "Comment added successfully", status: true }) : res.status(401).json({ error: "Something went wrong", status: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
export const viewComments = async (req, res, next) => {
    try {
        let comment = await ProductWiKi.findById({ _id: req.params.id }).sort({ sortorder: -1 })
        return comment ? res.status(200).json({ Comments: comment.Comments, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
