import dotenv from "dotenv"
import bodyParser from "body-parser";
import express from "express";
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url";
import UserRouter from "./routes/user.route.js";
import CustomerRouter from "./routes/customer.route.js";
import RoleRouter from "./routes/role.route.js";
import WarehouseRouter from "./routes/warehouse.route.js";
import CategoryRouter from "./routes/category.route.js";
import OrderRouter from "./routes/order.route.js";
// import TransporterRouter from "./routes/transporter.route.js";
import ProductsRouter from "./routes/product.route.js";
import UnitRouter from "./routes/unit.route.js";
import PartyRouter from "./routes/partyCreation.route.js";
import SalesManagerRouter from "./routes/saleManager.route.js";
import SalesPersonRouter from "./routes/salePerson.js";
import SalesReturnRouter from "./routes/SalesReturn.route.js";
import TargetCreationRouter from "./routes/targerCreation.route.js";
import PurchaseOrderRouter from "./routes/purchaseOrder.route.js";
import CreditNoteRouter from "./routes/creditNote.route.js";
import PurchaseReturnRouter from "./routes/purchaseReturn.route.js";
import DebitNoteRouter from "./routes/debitNote.route.js";
import PromotionRouter from "./routes/promotion.route.js";
import HierarchyRouter from "./routes/createHierarchy.route.js";
import GoodDispatchRouter from "./routes/goodDispatch.route.js";
import AddPrimaryUnitRouter from "./routes/addPrimaryUnit.route.js";
import CompanyDetailsRouter from "./routes/companyDetails.route.js"

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

app.use("/user", UserRouter);
app.use("/customer", CustomerRouter)
app.use("/role", RoleRouter);
app.use("/warehouse", WarehouseRouter);
app.use("/categories", CategoryRouter);
app.use("/order", OrderRouter);
// app.use("/transporter", TransporterRouter);
app.use("/product", ProductsRouter)
app.use("/unit", UnitRouter);
app.use("/party", PartyRouter);
app.use("/sales-manager", SalesManagerRouter);
app.use("/sales-person", SalesPersonRouter);
app.use("/sales-return", SalesReturnRouter);
app.use("/target-creation", TargetCreationRouter);
app.use("/purchase-order", PurchaseOrderRouter);
app.use("/credit-note", CreditNoteRouter);
app.use("/purchase-return", PurchaseReturnRouter);
app.use("/debit-note", DebitNoteRouter);
app.use("/promotion", PromotionRouter);
app.use("/hierarchy", HierarchyRouter);
app.use("/good-dispatch", GoodDispatchRouter)
app.use("/primary-unit", AddPrimaryUnitRouter)
app.use("/company-detail", CompanyDetailsRouter)

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  console.log("DB CONNECTED SUCCEFULLY");
})
  .catch((error) => {
    console.log(error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});