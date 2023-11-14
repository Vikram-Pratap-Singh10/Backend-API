import dotenv from "dotenv"
import axios from "axios";
import Jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import transporter from "../service/email.js";
import { AccountCreate } from "../model/createAccount.model.js";
import { AccountsProfile } from "../model/accountsProfile.model.js";
dotenv.config();

export const createAccount = async (req, res) => {
  const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/createAccount.xml";
  try {
    const response = await axios.get(fileUrl);
    const data = response.data;
    return res.status(200).json({ data, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error reading the file");
  }
};
export const saveAccount = async (req, res, next) => {
  try {
    const { UserName, email } = req.body
    // req.body.Password = await bcryptjs.hash(req.body.Password, await bcryptjs.getSalt(10))
    const existingUserName = await AccountCreate.findOne({ UserName });
    const existingEmail = await AccountCreate.findOne({ email });
    if ((existingUserName && existingEmail) || (!existingEmail && existingUserName) || (!existingUserName && existingEmail))
      return res.status(401).json({ error: "This Account Already Exist", status: false })
    let account = await AccountCreate.create(req.body);
    if (account) {
      let user = await AccountsProfile.create({ accountId: account._id, name: req.body.name, email: req.body.email, Password: req.body.Password })
      if (user)
        return res.status(200).json({ Account: account, message: "save information successful", status: true })
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false });
  }
}
export const viewCreateAccount = async (req, res, next) => {
  try {
    let account = await AccountCreate.find().sort({ sortorder: -1 })
    return account ? res.status(200).json({ CreateAccount: account, status: true }) : res.status(404).json({ error: "Not Found", status: false })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false });
  }
}
export const deleteCreateAccount = async (req, res, next) => {
  try {
    const account = await AccountCreate.findByIdAndDelete({ _id: req.params.id })
    const user = await AccountsProfile.findOneAndRemove({ accountId: req.params.id })
    return (account && user) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error", status: false });
  }
}
export const updateAccount = async (req, res, next) => {
  try {
    // req.body.Password = await bcryptjs.hash(req.body.Password ,await bcryptjs.genSalt(10))
    const accountId = req.params.id;
    const updatedAccountData = req.body;
    const existingAccount = await AccountCreate.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found', status: false });
    }
    await AccountCreate.findByIdAndUpdate(accountId, updatedAccountData, { new: true });
    const user = await AccountsProfile.findOne({ accountId: accountId });
    if (user) {
      user.name = req.body.name || user.name;
      user.Password = req.body.Password || user.Password;
      user.email = req.body.email || user.email;
      await user.save();
    }
    // const user = await AccountsProfile.updateMany({name:req.body.name,email:req.body.email,password:req.body.Password})
    return res.status(200).json({ message: 'Account updated successfully', status: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error', status: false });
  }
};
export const getAccountById = async (req, res, next) => {
  try {
    let account = await AccountCreate.findById({ _id: req.body.id })
    return account ? res.status(200).json({ CreateAccountDetail: account, status: true }) : res.status(400).json({ error: "Bad Request", status: false })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false });
  }
};
const otpStore = {};
export const SignIn = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[username] = otp;
    const createAccount = await AccountCreate.findOne({ UserName: username });
    const user1 = await AccountsProfile.findOne({ accountId: createAccount._id })
    // let status = await bcryptjs.compare(password,createAccount.Password)
    if (!createAccount) {
      return res.status(400).json({ message: 'Incorrect Username' });
    }
    else if (createAccount.Password !== password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    else if (createAccount.gmail === true) {
      var mailOptions = {
        from: {
          name: 'SoftNumen',
          address: 'noreply@softnumen'
        },
        to: createAccount.email,
        subject: 'Verification for login',
        html: '<div style={{fontFamily: "Helvetica,Arial,sans-serif",minWidth: 1000,overflow: "auto",lineHeight: 2}}<div style={{ margin: "50px auto", width: "70%", padding: "20px 0" }}><div style={{ borderBottom: "1px solid #eee" }}><a href=""style={{ fontSize: "1.4em",color: "#00466a" textDecoration: "none",fontWeight: 600}}></a></div><p style={{ fontSize: "1.1em" }}>Hi,</p><p>Thank you for choosing Our Company. Use the following OTP to complete your Sign In procedures.</p><h2 value="otp" style={{ background: "#00466a", margin: "0 auto",width: "max-content" padding: "0 10px",color: "#fff",borderRadius: 4}}>' + otp + '</h2><p style={{ fontSize: "0.9em" }}Regards,<br />SoftNumen Software Solutions</p><hr style={{ border: "none", borderTop: "1px solid #eee" }} /></div</div>',
      };
      await transporter.sendMail(mailOptions, (error, info) => {
        (!error) ? res.status(201).json({ user: { ...createAccount.toObject(), password: undefined }, message: "send otp on email", status: true }) : console.log(error) || res.json({ error: "something went wrong" });
      });
      // return res.status(201).json({ user: { ...createAccount.toObject(), password: undefined }, message: "otp send on mail", status: true })
    }
    else {
      let token = await Jwt.sign({ subject: createAccount.email }, "dfdfjdkfdjfkdjf")
      return res.json({ message: 'Login successful', user: { ...createAccount.toObject(), password: undefined, token, user1 }, status: true });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false });
  }
}
export const verifyOTP = async (req, res) => {
  const { username, otp } = req.body;
  try {
    const user = await AccountCreate.findOne({ UserName: username });
    const user1 = await AccountsProfile.findOne({ accountId: user._id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (otp == otpStore[username]) {
      delete otpStore[username];
      let token = await Jwt.sign({ subject: user.email }, "dfdfjdkfdjfkdjf")
      return res.status(200).json({ message: 'Login successful', user: { ...user.toObject(), password: undefined, token, user1 }, status: true });
    }
    else {
      return res.status(400).json({ error: "Invalid otp" })
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export const EditProfile = async (req, res, next) => {
  try {
    // req.body.Password = await bcryptjs.hash(req.body.Password,await bcryptjs.genSalt(10))
    const userId = req.params.id;
    if (req.file) {
      req.body.profileImage = req.file.filename;
    }
    // req.body.profileImage = req.file.filename || null
    const userDetail = req.body;
    const user_first = await AccountCreate.findById(req.params.id);
    const user_second = await AccountsProfile.findById(req.params.id)
    if (!user_first && !user_second) {
      return res.status(404).json({ error: "this account not found", status: false })
    }
    const user = await AccountCreate.findByIdAndUpdate(userId, userDetail, { new: true })
    const user2 = await AccountsProfile.updateMany({ accountId: userId }, userDetail, { new: true })
    const updatedUser = await AccountsProfile.find({ accountId: userId });
    if (user && user2.modifiedCount > 0)
      return res.status(200).json({ updateUser: updatedUser, user: user, message: "successful updated", status: true })
    return res.status(404).json({ error: "something went wrong", status: false })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", status: false })
  }
}
// --------------------------------------------------------
const resetOTP = {};
export const forgetPassword = async (request, response, next) => {
  try {
    const { email } = request.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    resetOTP[email] = otp
    const user = await AccountCreate.findOne({ email });
    const user1 = await AccountsProfile.findOne({ email })
    if (!user && !user1) {
      return response.status(404).json({ message: 'User not found' });
    }
    var mailOptions = {
      from: {
        name: 'SoftNumen',
        address: 'noreply@softnumen'
      },
      to: email,
      subject: 'Password has been reset',
      html: '<div style={{fontFamily: "Helvetica,Arial,sans-serif",minWidth: 1000,overflow: "auto",lineHeight: 2}}<div style={{ margin: "50px auto", width: "70%", padding: "20px 0" }}><div style={{ borderBottom: "1px solid #eee" }}><a href=""style={{ fontSize: "1.4em",color: "#00466a" textDecoration: "none",fontWeight: 600}}></a></div><p style={{ fontSize: "1.1em" }}>Hi,</p><p>The password for your softnumen software solution account has been successfully reset</p><h2 value="otp" style={{ background: "#00466a", margin: "0 auto",width: "max-content" padding: "0 10px",color: "#fff",borderRadius: 4}}>' + otp + '</h2><p style={{ fontSize: "0.9em" }}Regards,<br />SoftNumen Software Solutions</p><hr style={{ border: "none", borderTop: "1px solid #eee" }} /></div</div>',
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      (!error) ? response.status(201).json({ user: user, message: "send otp on email", status: true }) : console.log(error) || response.json({ error: "something went wrong" });
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Internal Server error' });
  }
};
export const otpVerify = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    if (otp == resetOTP[email]) {
      delete resetOTP[email];
      return res.status(201).json({ message: "otp matched successfully", status: true })
    }
    else {
      return res.status(400).json({ error: "Invalid otp", status: false })
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal server error...', status: false });
  }
}
export const updatePassword = async (request, response, next) => {
  try {
    const userId = request.params.id;
    if (request.body.Password !== request.body.ConfirmPassword) {
      return response.status(400).json({ error: "Password don't match", status: false })
    }
    else {
      // request.body.Password = await bcrypt.hash(request.body.Password, await bcrypt.genSalt(15));
      const user = await AccountCreate.updateMany({ _id: userId }, { Password: request.body.Password }, { new: true });
      console.log(user)
      const user1 = await AccountsProfile.updateMany({ accountId: userId }, { Password: request.body.Password }, { new: true });
      console.log(user1)
      if (user1.modifiedCount > 0 && user.modifiedCount > 0)
        return response.status(200).json({ Message: 'Password Updated success', status: true });
      return response.status(400).json({ Message: 'Unauthorized User...', status: false });
    }
  }
  catch (err) {
    console.log(err)
    return response.status(500).json({ Message: 'Internal Server Error...', status: false });
  }
}
