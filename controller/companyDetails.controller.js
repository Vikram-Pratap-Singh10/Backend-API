import { CompanyDetails } from "../model/companyDetails.model.js";

export const saveCompanyDetails = async (req, res, next) => {
    try {
        const companyDetail = await CompanyDetails.find().sort({ sortorder: -1 })
        if (companyDetail.length === 0) {
            if (req.file) {
                req.body.logo = req.file.filename
            }
            const companyDetail = await CompanyDetails.create(req.body)
            console.log(companyDetail)
            return companyDetail ? res.status(200).json({ message: "data save successfull", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
        }
        else {
            const id = companyDetail[0]._id
            const companyId = id;
            const existingDetails = await CompanyDetails.findById({ _id: companyId });
            if (!existingDetails) {
                return res.status(404).json({ error: 'goodDispatch not found', status: false });
            }
            else {
                if (req.file) {
                    req.body.logo = req.file.filename
                }
                const companyDetails = req.body;
                const updateDetails = await CompanyDetails.findByIdAndUpdate(companyId, companyDetails, { new: true });
                return updateDetails ? res.status(200).json({ message: 'Data Updated Successfully', status: true }) : res.status(400).json({ message: "Something Went Wrong" })
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const viewCompanyDetails = async (req, res, next) => {
    try {
        const companyDetail = await CompanyDetails.find().sort({ sortorder: -1 })
        return companyDetail ? res.status(200).json({ CompanyDetail: companyDetail, status: true }) : res.status(400).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}