import axios from "axios";
import { SalesManager } from "../model/salesManager.model.js";

export const SalesManagerXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/CreateSalesManagerConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveSalesManager = async (req,res,next)=>{
    try{
        const salesManager = await SalesManager.create(req.body);
        return salesManager ? res.status(200).json({message:"Date Save Successfully",status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false});
    }
}
export const viewSalesManager = async (req,res,next)=>{
    try{
        const salesManager = await SalesManager.find().sort({sortorder:-1})
        return salesManager ? res.status(200).json({SalesManager:salesManager,status:true}):res.status(404).json({message:"Not Found",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}
export const deleteSalesManager = async (req,res,next)=>{
    try{
        const salesManager = await SalesManager.findByIdAndDelete({_id:req.params.id})
        return salesManager ? res.status(200).json({message:"Delete Successfully",status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}
export const updateSalesManager = async (req,res,next)=>{
    try{
        const salesManagerId = req.params.id;
        const existingSalesManager = await SalesManager.findById(salesManagerId);
        if(!existingSalesManager){
            return res.status(404).json({message:"SalesManager Not Found",status:false});
        }
        const updatedSalesManager = req.body;
        const updateSalesManager = await SalesManager.findByIdAndUpdate(salesManagerId,updatedSalesManager,{new:true})
        return updateSalesManager ? res.status(200).json({message:"SalesManager Updated Successfully",status:true}):res.status(400).json({message:"Something Went Wrong",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}