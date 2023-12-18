import { DebitNote } from "../model/debitNote.model.js";
import { findCreditNoteDetails } from "../rolePermission/permission.js";


export const viewDebitNote = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userHierarchy = await findCreditNoteDetails(userId);
        const adminDetail = (userHierarchy[userHierarchy.length - 1])
        const debitNote = await DebitNote.find().sort({ sortorder: -1 }).populate({ path: "userId", model: "user" }).populate({ path: "productItems.productId", model: "product" })
        if (!debitNote || debitNote.length === 0) {
            return res.status(404).json({ message: "No creditNote found", status: false });
        }
        const formattedOrders = debitNote.map(order => {
            const formattedOrderItems = order.productItems.map(item => ({
                product: item.productId,
                qty: item.qty,
                unitQty: item.unitQty,
                price: item.price,
                status: item.status
            }));
            return {
                _id: order._id,
                userId: order.userId,
                purchaseOrderId: order.purchaseOrderId,
                totalAmount: order.totalAmount,
                productItems: formattedOrderItems,
                adminDetail: adminDetail,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            };
        });
        return res.status(200).json({ DebitNote: formattedOrders, status: true })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false })
    }
}
export const viewDebitNoteById = async (req, res) => {
    const { orderId, userId, productId } = req.body;
    try {
        const query = { $or: [{ orderId }, { userId }, { 'productItems.productId': productId }] };
        const orderData = await DebitNote.findOne(query).populate({ path: "userId", model: "user" }).populate({ path: "productItems.productId", model: "product" })
        if (orderData) {
            return res.status(200).json({ DebitNote: orderData, status: true });
        } else {
            return res.status(404).json({ error: 'this DebitNote Order not found', status: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error', status: false });
    }
};


