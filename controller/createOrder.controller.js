import { createOrder } from "../model/createOrder.model.js"

export const saveOrder = async (req, res, next) => {
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
        let order = await createOrder.create(req.body);
        if (order) {
            return res.status(200).json({ Order: order, message: "save information successfull", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const viewOrder = async (req, res, next) => {
    try {
        const order = await createOrder.find().sort({ sortorder: -1 })
        return (order.length) ? res.status(200).json({ Order: order }) : res.status(404).json({ error: "Not found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const AddComment = async (req, res, next) => {
    try {
        const createOrderId = req.params.id;
        const addComment = req.body.Comments;
        const existingPolicy = await createOrder.findById({ _id: createOrderId });
        if (!existingPolicy) {
            return res.status(400).json({ error: "order not found", status: false });
        } else {
            const updatedOrder = await createOrder.findByIdAndUpdate(createOrderId, { $push: { Comments: { $each: addComment } } }, { new: true });
            return updatedOrder ? res.status(201).json({ message: "Comment added successfully", status: true }) : res.status(401).json({ error: "Something went wrong", status: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
export const viewComments = async (req, res, next) => {
    try {
        let comment = await createOrder.findById({ _id: req.params.id }).sort({ sortorder: -1 })
        return comment ? res.status(200).json({ Comments: comment.Comments, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const orderHistory = async (req, res, next) => {
    try {

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}