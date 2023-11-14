import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({

},
    {timestamps:true, strict: false }
)

export const SupplierAccountCreate = mongoose.model('Supplier', SupplierSchema);

