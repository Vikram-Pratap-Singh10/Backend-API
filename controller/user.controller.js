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