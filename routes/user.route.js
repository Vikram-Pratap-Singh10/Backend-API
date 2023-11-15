import express from "express";
import { DeleteUser, SaveUser, UpdateUser, UserXml, ViewUser } from "../controller/user.controller.js";

const router = express.Router();

router.get("/get-xml",UserXml)
router.post("/save-user",SaveUser)
router.get("/view-user",ViewUser);
router.get("/delete-user/:id",DeleteUser);
router.post("/update-user/:id",UpdateUser);

export default router;