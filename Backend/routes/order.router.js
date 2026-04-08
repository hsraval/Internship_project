const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  restoreOrder,
  updateOrderDetail,
  cancleOrder
} = require("../controllers/order.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.post("/",protect,createOrder); // user can create order
router.get("/user",protect,getUserOrders); // specific use can see his orders
router.get("/:id",protect,getOrderById); // user can see specific order

router.get("/",protect,authorizeRoles('admin'),getAllOrders); // admin can see all orders
router.patch("/:id/status",protect,authorizeRoles('admin'),updateOrderStatus); // admin can update status
router.delete("/:id",protect,authorizeRoles('admin'),deleteOrder); // admin can delete orders
router.patch("/:id/restore",protect,authorizeRoles('admin'),restoreOrder); // admin can restore order

router.patch("/:id",protect,updateOrderDetail) // user update order detail only before pending
router.post('/:id',protect,cancleOrder) // user can cancle order before pending

module.exports = router;