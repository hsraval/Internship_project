const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  restoreOrder
} = require("../controllers/order.controller");

// const protect = require("../middleware/auth.middleware");
// const authorizeRoles = require("../middleware/role.middleware");

router.post("/", createOrder); // user can create order
router.get("/user",getUserOrders); // specific use can see his orders
router.get("/:id",getOrderById); // user can see specific order
router.get("/",getAllOrders); // admin can see all orders
router.patch("/:id/status",updateOrderStatus); // admin can update status
router.delete("/:id",deleteOrder); // user or admin can delete orders
router.patch("/:id/restore",restoreOrder); // admin can restore order

module.exports = router;