import ExcelJS from 'exceljs'
import axios from 'axios';
import { User } from '../model/user.model.js';

export const UserXml = async (req, res) => {
    const fileUrl = "https://awsxmlfiles.s3.ap-south-1.amazonaws.com/Createuserconfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveUser = async (req,res,next)=>{
    try{
       const user = await User.create(req.body)
       return user ? res.status(200).json({message:"Data Save Successfully",User:user,status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}
export const ViewUser = async (req, res, next) => {
    try {
        let user = await User.find().sort({ sortorder: -1 })
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