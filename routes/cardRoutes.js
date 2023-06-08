const express = require("express");
const router = express.Router();
const {
  getTotalItems,
  getNthMostTotalItems,
  getPercentageOfDepartmentWiseSoldItems,
  getMonthlySales,
} = require("../controllers/cardController");

router.route("/total_items").get(getTotalItems);
router.route("/nth_most_total_item").get(getNthMostTotalItems);
router
  .route("/percentage_of_department_wise_sold_items")
  .get(getPercentageOfDepartmentWiseSoldItems);
router.route("/monthly_sales").get(getMonthlySales);

module.exports = router;
