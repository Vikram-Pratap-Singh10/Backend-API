import { Promotion } from "../model/promotion.model.js";

export const SavePromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.create(req.body);
        return promotion ? res.status(200).json({ Promotion: promotion, status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
}
export const ViewPromotion = async (req, res, next) => {
    try {
        const promotion = await Promotion.find().sort({ sortorder: -1 })
        return (promotion.length > 0) ? res.status(200).json({ Promotion: promotion, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
}