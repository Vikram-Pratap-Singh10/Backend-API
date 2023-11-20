import dotenv from "dotenv"
import bodyParser from "body-parser";
import express from "express";
import path from "path"
import { fileURLToPath } from "url"
import CreateAccountRouter from "./routes/createAccount.route.js";
// -----------------------------------------------------------
import UserRouter from "./routes/user.route.js";
import CustomerRouter from "./routes/customer.route.js";
import RoleRouter from "./routes/role.route.js"
import WarehouseRouter from "./routes/warehouse.route.js"


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
// ---------------------------------------
app.use("/user",UserRouter);
app.use("/customer",CustomerRouter)
app.use("/role",RoleRouter);
app.use("/warehouse",WarehouseRouter);

mongoose.connect(process.env.DATABASE_URL,{
  useUnifiedTopology:true,
  useNewUrlParser: true
}).then(() => {
    console.log("DB CONNECTED SUCCEFULLY");
  })
.catch((error) => {
    console.log(error);
  });
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port 8000`);
});