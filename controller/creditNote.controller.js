import { CreditNote } from "../model/creditNote.model.js";

export const viewCreateNote = async (req, res, next) => {
    try {
        const creditNote = await CreditNote.find().sort({ sortorder: -1 })
        return creditNote ? res.status(200).json({ CreditNote: creditNote, status: true }) : res.status(400).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
}