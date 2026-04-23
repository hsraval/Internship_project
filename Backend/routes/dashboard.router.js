const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const Role = require("../middleware/role.middleware");

const {
  getDashboardStats,
  getMonthlyRevenue,
  downloadRevenuePDF
} = require("../controllers/dashboard.controller");

router.get("/dashboard", getDashboardStats);
router.get("/revenue", getMonthlyRevenue);
router.get("/revenue/download", downloadRevenuePDF);

module.exports = router;