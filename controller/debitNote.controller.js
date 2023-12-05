import { DebitNote } from "../model/debitNote.model.js";


export const viewDebitNote = async (req, res, next) => {
    try {
        const debitNote = await DebitNote.find().sort({ sortorder: -1 })
        return debitNote ? res.status(200).json({ DebitNote: debitNote, status: true }) : res.status(400).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
}
export const viewDebitNoteById = async (req, res) => {
    const { orderId, userId, productId } = req.body;
    try {
        const query = { $or: [{ orderId }, { userId }, { 'productItems.productId': productId }] };
        const orderData = await DebitNote.findOne(query).populate({ path: "productItems.productId", model: "product" })
        if (orderData) {
            return res.status(200).json({ DebitNote: orderData, status: true });
        } else {
            return res.status(404).json({ error: 'this DebitNote Order not found', status: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
import axios from "axios";
export const pincode = async (req, res) => {
    const pincodeAPIUrl = 'https://vikram-pratap-singh10.github.io/pincodeAPI/output.json';
    const pincodeValue = req.params.pincode;
    try {
        const response = await axios.get(pincodeAPIUrl);
        const data = response.data;
        const result = data.find(entry => entry.Pincode === pincodeValue);
        console.log(result)
        if (result) {
            res.json({ state: result.StateName, city: result.District });
        } else {
            res.status(404).json({ message: 'Pincode not found' });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

