import dotenv from "dotenv"
import bodyParser from "body-parser";
import express from "express";
import path from "path"
import { fileURLToPath } from "url"
import CreateAccountRouter from "./routes/createAccount.route.js";
import CustomerRegistrationRouter from "./routes/customerRegistration.route.js";
import PartCatalogueRouter from "./routes/partCatalogue.route.js";
import SchedulerTimeRouter from "./routes/schedulerTime.route.js";
import OrderRouter from "./routes/order.route.js";
import SparePartRouter from "./routes/spareParts.route.js";
import CampaignRouter from "./routes/campaign.route.js";
import WarrantyRouter from "./routes/warranty.route.js";
import SupportRouter from "./routes/support.route.js";
// import InspectionRouter from "./routes/inspection.route.js";
import CreateSupplierRouter from "./routes/AddSupplierConfig.route.js";
import WareHouseRouter from "./routes/warehouse.route.js";
import ServicingRouter from "./routes/servicing.route.js";
import CreateWikiRouter from "./routes/createWikiConfig.route.js";
import CreateQuoteRouter from "./routes/createQuoteConfig.route.js";
import CreateWareHouseRouter from "./routes/CreateWareHouseConfig.route.js";
import ProductRegistrationRouter from "./routes/productRegistration.route.js";
import InvoiceBillingRouter from "./routes/invoice.billing.route.js";
import DistributorRouter from "./routes/distributor.route.js";
import DealerRouter from "./routes/dealer.route.js";
import SupplierRouter from "./routes/supplier.route.js";
import ServiceCenterRouter from "./routes/service.center.route.js";
import CartRouter from "./routes/cart.route.js";
import PolicyRouter from "./routes/policies.route.js";
import DeliveryAddressRouter from "./routes/deliveryAddress.route.js";
import ReportRouter from "./routes/report.route.js";
import TicketToolRouter from "./routes/ticketTool.route.js";
import CreateOrderRouter from "./routes/createOrder.route.js";
import ServiceRateRouter from "./routes/serviceRate.route.js";
import AuditRouter from "./routes/auditHistory.route.js"


import mongoose from 'mongoose';
const app = express();
import cors from 'cors'
app.use(cors())
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const publicPath = path.join((path.dirname(fileURLToPath(import.meta.url))), 'public')
app.use(express.static(publicPath))
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/create-account", CreateAccountRouter);
app.use("/customer", CustomerRegistrationRouter);
app.use("/part-catalogue", PartCatalogueRouter);
app.use("/orders", OrderRouter)
app.use("/spare-parts", SparePartRouter)
app.use("/campaign", CampaignRouter)
app.use("/warranty", WarrantyRouter)
// app.use("/inspection",InspectionRouter)
app.use("/support", SupportRouter)
app.use("/scheduler-time", SchedulerTimeRouter);
app.use("/create-supplier", CreateSupplierRouter);
app.use("/warehouse", WareHouseRouter);
app.use('/servicing', ServicingRouter);
app.use("/product-wiki", CreateWikiRouter);
app.use("/create-quote", CreateQuoteRouter);
app.use("/create-warehouse", CreateWareHouseRouter);
app.use("/product-registration", ProductRegistrationRouter);
app.use("/invoice-billing", InvoiceBillingRouter);
app.use("/distributors", DistributorRouter);
app.use("/dealers", DealerRouter);
app.use("/suppliers", SupplierRouter);
app.use("/service-centers", ServiceCenterRouter);
app.use("/cart", CartRouter)
app.use("/policy", PolicyRouter)
app.use("/deliveryAddress", DeliveryAddressRouter)
app.use("/report", ReportRouter)
app.use("/ticket-tool", TicketToolRouter)
app.use("/create-orders", CreateOrderRouter)
app.use("/service-rate", ServiceRateRouter)
app.use("/audit-history",AuditRouter)


mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED SUCCEFULLY");
  })
  .catch((error) => {
    console.log(error);
  });
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port 8000`);
});