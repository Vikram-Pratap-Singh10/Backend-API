import express from "express";
import { createAccount, deleteCreateAccount, viewCreateAccount,updateAccount, SignIn, verifyOTP, saveAccount, EditProfile, forgetPassword, updatePassword, otpVerify} from "../controller/createAccount.controller.js";
import multer from "multer";
const upload = multer({dest:"public/Images"})

const router = express.Router();
router.get("/createAccount", createAccount);
router.post("/save-account", saveAccount);
router.get("/get-account", viewCreateAccount);
router.get("/delete-account/:id", deleteCreateAccount);
router.post("/update-account/:id", updateAccount);

router.post("/signin",SignIn);
router.post("/verify-otp",verifyOTP)
router.post("/edit-profile/:id",upload.single("file"),EditProfile);

router.post("/forget-password",forgetPassword)
router.post("/otp-verify",otpVerify)
router.post("/update-password/:id",updatePassword)
export default router;