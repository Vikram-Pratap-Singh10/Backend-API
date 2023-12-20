import axios from "axios";
import { GoodDispatch } from "../model/goodDispatch.model.js";
import { Order } from "../model/order.model.js";
import { CreateOrder } from "../model/createOrder.model.js";
import transporter from "../service/email.js";
import { User } from "../model/user.model.js";

export const GoodDispathcXml = async (req, res) => {
    const fileUrl = "https://xmlfile.blr1.cdn.digitaloceanspaces.com/GoodDispatchConfig.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};

export const saveGoodDispatch = async (req, res) => {
    try {
        const order = await Order.findById({ _id: req.body.orderId })
        const orders = await CreateOrder.findById({ _id: req.body.orderId })
        if (!order && !orders) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        if (orders) {
            orders.status = req.body.status;
            await orders.save();
        }
        if (order) {
            order.status = req.body.status;
            await order.save();
        }
        req.body.orderItems = JSON.parse(req.body.orderItems)
        if (req.files) {
            let image = null;
            let images = null;
            req.files.map(file => {
                if (file.fieldname === "invoice") {
                    image = file.filename;
                }
                else {
                    images = file.filename
                }
            })
            req.body.FetchSalesInvoice = image;
            req.body.CNUpload = images
        }
        const goodDispatch = await GoodDispatch.create(req.body);
        return goodDispatch ? res.status(200).json({ message: "save data successfull", status: true }) : res.status(400).json({ message: "Bad Request", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
export const updateGoodDispatch = async (req, res) => {
    try {
        const goodDispatchId = req.params.id;
        const existingGoodDispatch = await GoodDispatch.findById({ _id: goodDispatchId });
        if (!existingGoodDispatch) {
            return res.status(404).json({ error: 'goodDispatch not found', status: false });
        }
        else {
            if (req.file) {
                req.body.salesInvoice = req.file.filename
            }
            const updatedGoodDispatch = req.body;
            const updateDetails = await GoodDispatch.findByIdAndUpdate(goodDispatchId, updatedGoodDispatch, { new: true });
            return updateDetails ? res.status(200).json({ message: 'Data Updated Successfully', status: true }) : res.status(400).json({ message: "Something Went Wrong" })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err, status: false });
    }
}
export const viewGoodDispatch = async (req, res, next) => {
    try {
        let goodDispatch = await GoodDispatch.find().sort({ sortorder: -1 })
        return goodDispatch ? res.status(200).json({ GoodDispatch: goodDispatch, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const viewGoodDispatchById = async (req, res, next) => {
    try {
        let goodDispatch = await GoodDispatch.findById({ _id: req.params.id }).sort({ sortorder: -1 })
        return goodDispatch ? res.status(200).json({ GoodDispatch: goodDispatch, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const deleteGoodDispatch = async (req, res, next) => {
    try {
        const goodDispatch = await GoodDispatch.findByIdAndDelete({ _id: req.params.id })
        return (goodDispatch) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const viewOrderForDeliveryBoy = async (req, res, next) => {
    try {
        let goodDispatch = await GoodDispatch.find({ AssignDeliveryBoy: req.params.id }).sort({ sortorder: -1 }).populate({ path: "orderItems.productId", model: "product" }).populate({ path: "userId", model: "user" })
        return (goodDispatch.length > 0) ? res.status(200).json({ OrderList: goodDispatch, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const updateOrderStatusByDeliveryBoy = async (req, res) => {
    try {
        const goodDispatchId = req.params.id;
        const { status, otp } = req.body;
        const user = await User.findById({ _id: req.body.userId })
        const order = await Order.findById({ _id: req.body.orderId })
        const orders = await CreateOrder.findById({ _id: req.body.orderId })
        const goodDispatch = await GoodDispatch.findById({ _id: goodDispatchId });
        if (!order && !orders && !goodDispatch) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        if (user.otpVerify == otp) {
            if (orders) {
                orders.status = req.body.status;
                await orders.save();
            }
            if (order) {
                order.status = req.body.status;
                await order.save();
            }
            if (goodDispatch) {
                goodDispatch.status = req.body.status;
                await goodDispatch.save();
            }
            return res.status(200).json({ message: "status updated successfully", status: true });
        }
        else {
            return res.status(400).json({ message: "something went wrong", status: false });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}
export const sendOtp = async (req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const user = await User.findById({ _id: req.params.id })
        if (!user) {
            return res.status(404).json({ message: "user not found", status: false });
        }
        var mailOptions = {
            from: 'vikramsveltose022@gmail.com',
            to: `${user.email}`,
            subject: 'Delivery Verification OTP',
            html: '<div style={{fontFamily: "Helvetica,Arial,sans-serif",minWidth: 1000,overflow: "auto",lineHeight: 2}}<div style={{ margin: "50px auto", width: "70%", padding: "20px 0" }}><div style={{ borderBottom: "1px solid #eee" }}><a href=""style={{ fontSize: "1.4em",color: "#00466a" textDecoration: "none",fontWeight: 600}}></a></div><p style={{ fontSize: "1.1em" }}>Hi,</p><p>otp</p><h2 value="otp" style={{ background: "#00466a", margin: "0 auto",width: "max-content" padding: "0 10px",color: "#fff",borderRadius: 4}}>' + otp + '</h2><p style={{ fontSize: "0.9em" }}Regards,<br />Distribution Management System</p><hr style={{ border: "none", borderTop: "1px solid #eee" }} /></div</div>',
        };
        user.otpVerify = otp;
        await user.save();
        await transporter.sendMail(mailOptions, (error, info) => {
            (!error) ? response.status(201).json({ message: "otp send successfull", status: true }) : console.log(error) || response.status(400).json({ error: "Something Went Wrong", status: false });
        });
        return res.status(200).json({ message: "otp send successful", status: true })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}