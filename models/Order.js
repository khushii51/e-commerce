import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    invvoice_no: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["created", "pending", "paid", "completed", "cancelled"],
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
},{timestamps: true})

const Order = mongoose.model("Order", orderSchema);
export default Order;