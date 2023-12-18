import { Order } from "../model/order.model.js";
import { InvoiceList } from "../model/createInvoice.model.js";

export const SaveInvoiceList = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        const { userId, orderItem, partyId, DateofDelivery, fullName, address, MobileNo, country, state, city, landMark, pincode, grandTotal, discount, taxAmount, shippingCost, status, latitude, longitude, currentAddress, paymentId, paymentMode } = order;

        const invoiceListData = {
            userId: userId,
            orderItems: orderItem,
            partyId: partyId,
            DateofDelivery: DateofDelivery,
            fullName: fullName,
            address: address,
            MobileNo: MobileNo,
            country: country,
            state: state,
            city: city,
            landMark: landMark,
            pincode: pincode,
            grandTotal: grandTotal,
            discount: discount,
            taxAmount: taxAmount,
            shippingCost: shippingCost,
            status: status,
            latitude: latitude,
            longitude: longitude,
            currentAddress: currentAddress,
            paymentId: paymentId,
            paymentId: paymentMode

        };

        const invoiceList = await InvoiceList.create(invoiceListData);

        console.log(invoiceList);

        return res.status(201).json({ message: "InvoiceList created successfully", status: true, data: invoiceList });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};

export const viewInvoiceList = async (req, res, next) => {
    try {
        const invoice = await InvoiceList.find({}).sort({ sortorder: -1 }).populate({
            path: 'orderItems.productId',
            model: 'product'
        })
        return invoice.length > 0 ? res.status(200).json({ Invoice: invoice, status: true }) : res.status(404).json({ message: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false })
    }
}
