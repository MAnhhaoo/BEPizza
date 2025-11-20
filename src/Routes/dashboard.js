const express = require("express");
const router = express.Router();
const DashboardController = require("../Controller/DashboardController");

router.get("/das", DashboardController.getDashboard.bind(DashboardController));

module.exports = router; 
