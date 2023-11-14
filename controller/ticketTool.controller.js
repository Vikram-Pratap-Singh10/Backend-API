import axios from "axios";
import { TicketTool } from "../model/ticketTool.model.js";

export const  ticketToolXml = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/createTicketConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveTicketTool = async (req, res, next) => {
    try {
        const { Role, userName, time } = req.body;
        if (req.files) {
            let images = []
            req.files.map(file => {
                images.push(file.filename)
            })
            const push = await { Role: Role, userName: userName, time: time, images: images }
            req.body.attachmentFile = await push
        }
        req.body.Comments = JSON.parse(req.body.Comments)
        let ticketTool = await TicketTool.create(req.body);
        if (ticketTool) {
            return res.status(200).json({ TicketTool: ticketTool, message: "save information successful", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewTicketTool = async (req, res, next) => {
    try {
        let ticketTool = await TicketTool.find().sort({ sortorder: -1 })
        return ticketTool ? res.status(200).json({ TicketTool: ticketTool, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteTicketTool = async (req, res, next) => {
    try {
        const ticketTool = await TicketTool.findByIdAndDelete({ _id: req.params.id })
        return (ticketTool) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const updateTicketTool = async (req, res, next) => {
    try {
        const ticketToolId = req.params.id;
        const existingTicketTool = await TicketTool.findById(ticketToolId);
        if (!existingTicketTool) {
            return res.status(404).json({ error: 'ticketTool not found', status: false });
        }
        else {
            const updatedTicketTool = req.body;
            await TicketTool.findByIdAndUpdate(ticketToolId, updatedTicketTool, { new: true });
            return res.status(200).json({ message: 'TicketTool Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};  