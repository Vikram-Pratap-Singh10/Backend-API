import express from "express";
import { DeleteUser, EditProfile, SaveUser, SignIn, UpdateUser, UserXml, ViewUser, ViewUserById, ViewWarehouse, forgetPassword, otpVerify, updatePassword, verifyOTP } from "../controller/user.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "public/Images" })

router.get("/get-xml", UserXml)
router.post("/save-user", SaveUser)
router.get("/view-user/:id", ViewUser);
router.get("/view-user-by-id/:id", ViewUserById)
router.get("/delete-user/:id", DeleteUser);
router.post("/update-user/:id", UpdateUser);

router.post("/signin", SignIn);
router.post("/verify-otp", verifyOTP)
router.post("/edit-profile/:id", upload.single("file"), EditProfile);

router.post("/forget-password", forgetPassword)
router.post("/otp-verify", otpVerify)
router.post("/update-password/:id", updatePassword)

router.get("/view-warehouse/:id", ViewWarehouse);

export default router;