import { deliveryAddress } from "../model/deliveryAddress.model.js";

export const SaveDeliveryAddress = async (req,res,next)=>{
    try{
        const address = await deliveryAddress.create(req.body)
        return address ? res.status(200).json({Address:address,status:true}) : res.status(400).json({error:"Bad Request",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}
export const getDeliveryAddress = async (req,res,next)=>{
    try{
        const address = await deliveryAddress.find({userId:req.params.id})
        return address ? res.status(200).json({Address:address,status:true}):res.status(404).json({error:"Not Fount",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}
export const deleteDeliveryAddress = async (req,res,next)=>{
    try{
        const address = await deliveryAddress.deleteOne({userId:req.params.id})
        return (address.deletedCount>0) ? res.status(200).json({message:"delete successful",status:true}):res.status(404).json({error:"Not Found",status:false})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"Internal Server Error",status:false})
    }
}