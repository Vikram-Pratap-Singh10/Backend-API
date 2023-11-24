import axios from "axios";
import { SalesPerson } from "../model/salesPerson.model.js";

export const SalesPersonXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateSalesmanConfig%5D.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveSalesPerson = async (req,res,next)=>{
    try{
        const salesPerson = await SalesPerson.create(req.body);
        return salesPerson ? res.status(200).json({message:"Date Save Successfully",status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false});
    }
}
export const viewSalesPerson = async (req,res,next)=>{
    try{
        const salesPerson = await SalesPerson.find().sort({sortorder:-1})
        return salesPerson ? res.status(200).json({SalesPerson:salesPerson,status:true}):res.status(404).json({message:"Not Found",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}
export const deleteSalesPerson = async (req,res,next)=>{
    try{
        const salesPerson = await SalesPerson.findByIdAndDelete({_id:req.params.id})
        return salesPerson ? res.status(200).json({message:"Delete Successfully",status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}
export const updateSalesPerson = async (req,res,next)=>{
    try{
        const salesPersonId = req.params.id;
        const existingSalesPerson = await SalesPerson.findById(salesPersonId);
        if(!existingSalesPerson){
            return res.status(404).json({message:"SalesPerson Not Found",status:false});
        }
        const updatedSalesPerson = req.body;
        const updateSalesPerson = await SalesPerson.findByIdAndUpdate(salesPersonId,updatedSalesPerson,{new:true})
        return updateSalesPerson ? res.status(200).json({message:"SalesPerson Updated Successfully",status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}