import mongoose from "mongoose";

const PartsSchema = new mongoose.Schema(
  {
    PartName: {
      type: String,
    },
    PartNumber: {
      type: String,
    },
    PartImage: {
      type: String,
    },
    PartAvailableQuantity: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);


export const PartCatalogue = mongoose.model('PartCatalogue', PartsSchema);
// export const Order = mongoose.model('Order', PartsSchema);
export const SparePart = mongoose.model('SparePart', PartsSchema);
export const Campaign = mongoose.model('Campaign', PartsSchema);
// export const Inspections = mongoose.model('Inspections',PartsSchema);
export const Support = mongoose.model('Support', PartsSchema);
export const WareHouse = mongoose.model('Warehouse', PartsSchema);
export const Servicing = mongoose.model('Servicing', PartsSchema)
export const Invoice = mongoose.model("Invoice_Billing", PartsSchema);
export const ProductRegistration = mongoose.model("ProductRegistration", PartsSchema);
export const Distributors = mongoose.model("Distributor", PartsSchema);
export const Dealer = mongoose.model("Dealer", PartsSchema);
// export const Supplier = mongoose.model("Supplier",PartsSchema);
export const ServiceCenter = mongoose.model("ServiceCenter", PartsSchema);
export const CustomerData = mongoose.model("CustomerData", PartsSchema);
export const ServiceRate = mongoose.model("servicerate", PartsSchema)
