import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Items are required" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ scuccess: false, message: "Product Not Found!" });
    }
    console.log("product: ", product);

    if (product.stock < quantity) {
      return res.status(400).json({
        scuccess: false,
        message: `Product is out of stock, Only ${product.stock} items available!`,
      });
    }
    const price = product.price;
    const total_price = product.price * quantity;

    const invvoice_no = Date.now();


    const requesterId = req.user.id;
console.log("requesterId", req.user);
    const order = await Order.create({
      invvoice_no,
      status: "created",
      productId,
      userId: requesterId,
      quantity,
      price,
      total_price,
    });

    product.stock = product.stock - quantity;
    if (product.stock === 0) {
      product.status = "inactive";
    }
    await product.save();

    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("productId").populate("userId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!", error: err.message });
  }
};

//get my orders
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user.id;

    const orders = await Order.find({ userId }).populate("productId");

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error!", error: error.message });
  }
};

// Delete order - restore product stock
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('productId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found!' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this order!' });
    }

    const product = await Product.findById(item._id);
    if (product) {
      product.stock += order.quantity;
      if (product.stock > 0) {
        product.status = 'active';
      }
      await product.save();
    }

    await Order.deleteOne({ _id: id });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
};

// Update order 
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, status } = req.body;
    
    const order = await Order.findById(id).populate('productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found!' });
    }


    if( order.userId.toString() !==req.user.id){
        return res.status(403).json({
            message: "You are not allowed to update this order!"
        })
    }

    if (quantity !== undefined && quantity !== order.quantity) {
      const diff = order.quantity - quantity; 
      const product = await Product.findById(order.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found!' });
      }


      if (diff < 0 && product.stock < Math.abs(diff)) {
        return res.status(400).json({ message: 'Insufficient stock!' });
      }

      product.stock += diff;
      if (product.stock <= 0) {
        product.status = 'inactive';
      } else if (product.stock > 0) {
        product.status = 'active';
      }
      await product.save();

      order.quantity = quantity;
      order.total_price = order.price * quantity;
    }

    if (status !== undefined) {
      order.status = status;
    }

    const updated = await order.save();
    res.status(200).json({ message: 'Order updated successfully', order: updated });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
};