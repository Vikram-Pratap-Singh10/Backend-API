import ExcelJS from 'exceljs'
import axios from 'axios';
import { User } from '../model/user.model.js';
import Jwt from "jsonwebtoken";

export const UserXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/Createuser.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        return user ? res.status(200).json({ message: "Data Save Successfully", User: user, status: true }) : res.status(400).json({ message: "Something Went Wrong", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const ViewUser = async (req, res, next) => {
    try {
        let user = await User.find().sort({ sortorder: -1 }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" })
        return user ? res.status(200).json({ User: user, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const ViewUserById = async (req, res, next) => {
    try {
        let user = await User.findById({_id:req.params.id}).sort({ sortorder: -1 }).populate({ path: "rolename", model: "role" }).populate({ path: "created_by", model: "user" })
        return user ? res.status(200).json({ User: user, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const DeleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete({ _id: req.params.id })
        return (user) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const UpdateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found', status: false });
        }
        else {
            const updatedUser = req.body;
            await User.findByIdAndUpdate(userId, updatedUser, { new: true });
            return res.status(200).json({ message: 'User Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
// -----------------------------------------------
const otpStore = {};
export const SignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = otp;
        const createAccount = await User.findOne({ email: email }).populate({ path: "rolename", model: "role" });;
        // let status = await bcryptjs.compare(password,createAccount.password)
        if (!createAccount) {
            return res.status(400).json({ message: 'Incorrect email' });
        }
        else if (createAccount.password !== password) {
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
            return res.json({ message: 'Login successful', user: { ...createAccount.toObject(), password: undefined, token }, status: true });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (otp == otpStore[email]) {
            delete otpStore[email];
            let token = await Jwt.sign({ subject: user.email }, "dfdfjdkfdjfkdjf")
            return res.status(200).json({ message: 'Login successful', user: { ...user.toObject(), password: undefined, token }, status: true });
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
        // req.body.password = await bcryptjs.hash(req.body.password,await bcryptjs.genSalt(10))
        const userId = req.params.id;
        if (req.file) {
            req.body.profileImage = req.file.filename;
        }
        // req.body.profileImage = req.file.filename || null
        const userDetail = req.body;
        const user_first = await User.findById(req.params.id);
        if (!user_first) {
            return res.status(404).json({ error: "this user not found", status: false })
        }
        const user = await User.findByIdAndUpdate(userId, userDetail, { new: true })
        if (user)
            return res.status(200).json({ User: user, message: "successful updated", status: true })
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
        const user = await User.findOne({ email });
        if (!user) {
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
        if (request.body.password !== request.body.confirmPassword) {
            return response.status(400).json({ error: "Password don't match", status: false })
        }
        else {
            // request.body.password = await bcrypt.hash(request.body.password, await bcrypt.genSalt(15));
            const user = await User.updateMany({ _id: userId }, { password: request.body.password }, { new: true });
            if (user.modifiedCount > 0)
                return response.status(200).json({ Message: 'Password Updated success', status: true });
            return response.status(400).json({ Message: 'Unauthorized User...', status: false });
        }
    }
    catch (err) {
        console.log(err)
        return response.status(500).json({ Message: 'Internal Server Error...', status: false });
    }
}