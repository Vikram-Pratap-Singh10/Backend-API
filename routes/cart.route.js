import express from "express";
import { AddToCart, removeCart, removeCartItem, viewCartItems } from "../controller/cart.controller.js";

const router = express.Router();

router.post("/add-to-cart", AddToCart)
router.get("/get-cart-items/:id", viewCartItems)
router.post("/remove-cart-item", removeCartItem)
router.get("/delete-cart/:id", removeCart)

export default router;