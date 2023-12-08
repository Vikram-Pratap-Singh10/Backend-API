import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    email: {
        type: String
    },
    name: {
        type: String
    },
    gstNo: {
        type: String
    },
    address: {
        type: String
    },
    mobileNo: {
        type: String
    },
    logo: {
        type: String
    },
    signature: {
        type: String
    }
})
export const CompanyDetails = mongoose.model("companyDetail", CompanySchema)