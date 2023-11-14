import express from "express";
import { SaveDeliveryAddress, deleteDeliveryAddress, getDeliveryAddress } from "../controller/deliveryAddress.controller.js";

const router = express.Router();

router.post("/save-delivery-address",SaveDeliveryAddress)
router.get("/get-delivery-address/:id",getDeliveryAddress)
router.get("/delete-delivery-address/:id",deleteDeliveryAddress)

export default router;