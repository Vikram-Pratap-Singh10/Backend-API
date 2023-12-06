import { PrimaryUnit } from "../model/addPrimaryUnit.model.js";

export const SavePrimaryUnit = async (req, res) => {
    try {
        const unit = await PrimaryUnit.create(req.body)
        return unit ? res.status(200).json({ message: "primary unit save successfully", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const ViewPrimaryUnit = async (req, res, next) => {
    try {
        let unit = await PrimaryUnit.find().sort({ sortorder: -1 })
        return unit ? res.status(200).json({ PrimaryUnit: unit, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}