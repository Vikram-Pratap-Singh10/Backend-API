import ExcelJS from 'exceljs'
import axios from 'axios';
import { Customer } from '../model/customer.model.js';

export const CustomerXml = async (req, res) => {
    const fileUrl = "https://awsxmlfiles.s3.ap-south-1.amazonaws.com/CreateCustomerConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const SaveCustomer = async (req,res,next)=>{
    try{
       const customer = await Customer.create(req.body)
       return customer ? res.status(200).json({message:"Data Save Successfully",Customer:customer,status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}