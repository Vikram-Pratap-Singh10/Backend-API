import axios from "axios";
import { Policy } from "../model/policies.model.js";
import { format } from "date-fns";

export const policyXml = async (req, res) => {
    const fileUrl = "https://aws-xml-file.s3.ap-south-1.amazonaws.com/PolicyConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};
export const savePolicies = async (req, res, next) => {
    try {
        const { Role, userName, time } = req.body;
        // if (req.body.ReceivedDate) {
        //     const currentDate = new Date();
        //     const startDate = new Date(req.body.ReceivedDate);
        //     const duration = req.body.PolicyDuration;
        //     const [amount, unit] = duration.split(' ');
        //     const endDate = new Date(startDate);
        //     if (unit === "years") {
        //         endDate.setFullYear(startDate.getFullYear() + parseInt(amount, 10));
        //     } else if (unit === "months") {
        //         endDate.setMonth(startDate.getMonth() + parseInt(amount, 10));
        //     }
        //     const rTimeMili = endDate - currentDate;
        //     const millisecondsInDay = 1000 * 60 * 60 * 24;
        //     const millisecondsInMonth = millisecondsInDay * 30.44;
        //     const millisecondsInYear = millisecondsInMonth * 12;
        //     const rYears = Math.floor(rTimeMili / millisecondsInYear);
        //     const rMonths = Math.floor((rTimeMili % millisecondsInYear) / millisecondsInMonth);
        //     const rDays = Math.floor((rTimeMili % millisecondsInMonth) / millisecondsInDay);
        //     req.body.remainingPolicyTime = `${rYears} years, ${rMonths} months, ${rDays} days`;
        //     req.body.PolicyStartDate = format(startDate, 'yyyy-MM-dd');
        //     req.body.PolicyEndDate = format(endDate, 'yyyy-MM-dd');
        // }
        if (req.files) {
            let images = []
            req.files.map(file => {
                images.push(file.filename)
            })
            const push = await { Role: Role, userName: userName, time: time, images: images }
            req.body.attachmentFile = await push;
        }
        req.body.Comments = JSON.parse(req.body.Comments)
        let policy = await Policy.create(req.body);
        if (policy) {
            return res.status(200).json({ Policy: policy, message: "save information successful", status: true })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewPolicies = async (req, res, next) => {
    try {
        let policy = await Policy.find().sort({ sortorder: -1 })
        return policy ? res.status(200).json({ Policy: policy, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deletePolicy = async (req, res, next) => {
    try {
        const policy = await Policy.findByIdAndDelete({ _id: req.params.id })
        return (policy) ? res.status(200).json({ message: "delete successfull", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}
export const updatePolicy = async (req, res, next) => {
    try {
        if (req.files) {
            let images = []
            req.files.map(file => {
                images.push(file.filename)
            })
            req.body.attachmentFile = await images;
        }
        req.body.Comments = JSON.parse(req.body.Comments)
        const policyId = req.params.id;
        const existingPolicy = await Policy.findById(policyId);
        if (!existingPolicy) {
            return res.status(404).json({ error: 'policy not found', status: false });
        }
        else {
            // if (req.body.ReceivedDate) {
            //     const currentDate = new Date();
            //     const startDate = new Date(req.body.ReceivedDate);
            //     const duration = existingPolicy.PolicyDuration;
            //     const [amount, unit] = duration.split(' ');
            //     const endDate = new Date(startDate);
            //     if (unit === "years") {
            //         endDate.setFullYear(startDate.getFullYear() + parseInt(amount, 10));
            //     } else if (unit === "months") {
            //         endDate.setMonth(startDate.getMonth() + parseInt(amount, 10));
            //     }
            //     const rTimeMili = endDate - currentDate;
            //     const millisecondsInDay = 1000 * 60 * 60 * 24;
            //     const millisecondsInMonth = millisecondsInDay * 30.44;
            //     const millisecondsInYear = millisecondsInMonth * 12;
            //     const rYears = Math.floor(rTimeMili / millisecondsInYear);
            //     const rMonths = Math.floor((rTimeMili % millisecondsInYear) / millisecondsInMonth);
            //     const rDays = Math.floor((rTimeMili % millisecondsInMonth) / millisecondsInDay);
            //     req.body.remainingPolicyTime = rYears + " years," + rMonths + " months," + rDays + " days";
            //     req.body.PolicyStartDate = format(startDate, 'yyyy-MM-dd');
            //     req.body.PolicyEndDate = format(endDate, 'yyyy-MM-dd');
            // }
            const updatedPolicyData = req.body;
            await Policy.findByIdAndUpdate(policyId, updatedPolicyData, { new: true });
            return res.status(200).json({ message: 'Policy Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};
export const AddComment = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const addComment = req.body.Comments;
        const existingPolicy = await Policy.findById({ _id: userId });
        if (!existingPolicy) {
            return res.status(400).json({ error: "Policy not found", status: false });
        } else {
            const updatedPolicy = await Policy.findByIdAndUpdate(userId, { $push: { Comments: { $each: addComment } } }, { new: true });
            return updatedPolicy ? res.status(201).json({ message: "Comment added successfully", status: true }) : res.status(401).json({ error: "Something went wrong", status: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};
