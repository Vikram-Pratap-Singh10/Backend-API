import { CreditNote } from "../model/creditNote.model.js";

export const viewCreateNote = async (req, res, next) => {
    try {
        const creditNote = await CreditNote.find().sort({ sortorder: -1 }).populate({ path: "userId", model: "user" }).populate({ path: "productItems.productId", model: "product" })
        return creditNote ? res.status(200).json({ CreditNote: creditNote, status: true }) : res.status(400).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
}
export const viewCreditNoteById = async (req, res) => {
    const { orderId, userId, productId } = req.body;
    try {
        const query = { $or: [{ orderId }, { userId }, { 'productItems.productId': productId }] };
        const orderData = await CreditNote.findOne(query).populate({ path: "productItems.productId", model: "product" })
        if (orderData) {
            return res.status(200).json({ CreditNote: orderData, status: true });
        } else {
            return res.status(404).json({ error: 'Order not found', status: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
