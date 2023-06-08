const asyncHandler = require("express-async-handler");
const Card = require("../models/cardModel");

//@desc Get Total item sold in Marketting for last in q3 of the year
//@route GET /api/total_items
//@access public
//@parameter (parameters: start_date, end_date, department):
// example:- {
//              "start_date": "2022-10-10T04:11:28.000+00:00",
//              "end_date": "2023-04-21T13:13:21.000+00:00",
//              "department": "Marketting"
//           }
const getTotalItems = asyncHandler(async (req, res) => {
  console.log(new Date(req.body.start_date));
  const totalItems = await Card.aggregate([
    {
      $match: {
        department: req.body.department, // department name
        date: {
          $gte: new Date(req.body.start_date), // start date of Q3
          $lte: new Date(req.body.end_date), // end date of Q3
        },
      },
    },
    {
      $group: {
        _id: null,
        totalItemsSold: { $sum: "$seats" }, // number of items sold
      },
    },
    {
      $project: {
        _id: 0,
        totalItemsSold: 1,
      },
    },
    {
      $project: {
        _id: 0,
        totalItemsSold: 1,
      },
    },
  ]);
  console.log(totalItems[0]);
  if (totalItems.length > 0) {
    res.status(200).json(totalItems[0].totalItemsSold);
  } else {
    res.status(200).json(0); // No items sold in Marketing for Q3
  }
});

//@desc Get the nth most sold item in terms of quantity or price
// @route GET /api/nth_most_total_item
// @access Public
// @parameters item_by: (quantity, price), start_date, end_date
// example:- {
//              "item_by": "amount",
//              "start_date": "2022-10-10T04:11:28.000+00:00",
//              "end_date": "2023-04-21T13:13:21.000+00:00"
//           }
const getNthMostTotalItems = asyncHandler(async (req, res) => {
  const { item_by, start_date, end_date } = req.body;

  // Validate item_by parameter
  if (item_by !== "amount" && item_by !== "seats") {
    res.status(400).json({ message: "Invalid item_by parameter" });
    return;
  }

  // Create the aggregation pipeline based on the item_by parameter
  const pipeline = [
    {
      $match: {
        date: {
          $gte: new Date(start_date),
          $lte: new Date(end_date),
        },
      },
    },
    {
      $group: {
        _id: `$${item_by}`, // Group by the specified field (quantity or price)
        count: { $sum: 1 }, // Count the number of occurrences
      },
    },
    {
      $sort: {
        count: -1, // Sort by the count in descending order
      },
    },
    {
      $skip: 1, // Skip the first item (since we want the nth most sold item)
    },
    {
      $limit: 1, // Limit the result to one item
    },
    {
      $project: {
        _id: 0,
        item: `$_id`, // Rename the _id field as item
      },
    },
  ];

  const result = await Card.aggregate(pipeline);
  if (result.length > 0) {
    res.status(200).json(result[0].item);
  } else {
    res.status(404).json({ message: "No items found" });
  }
});

// @desc Get the percentage of sold items department-wise
// @route GET /api/percentage_of_department_wise_sold_items
// @access Public
// @parameters start_date, end_date
// example:- {
//              "start_date": "2022-10-10T04:11:28.000+00:00",
//              "end_date": "2023-04-21T13:13:21.000+00:00"
//           }
const getPercentageOfDepartmentWiseSoldItems = asyncHandler(
  async (req, res) => {
    const { start_date, end_date } = req.body;

    const pipeline = [
      {
        $match: {
          date: {
            $gte: new Date(start_date),
            $lte: new Date(end_date),
          },
        },
      },
      {
        $group: {
          _id: "$department",
          totalItemsSold: { $sum: "$seats" },
        },
      },
      {
        $group: {
          _id: null,
          departments: {
            $push: {
              department: "$_id",
              totalItemsSold: "$totalItemsSold",
            },
          },
          totalSold: { $sum: "$totalItemsSold" },
        },
      },
      {
        $unwind: "$departments",
      },
      {
        $project: {
          _id: 0,
          department: "$departments.department",
          percentage: {
            $multiply: [
              { $divide: ["$departments.totalItemsSold", "$totalSold"] },
              100,
            ],
          },
        },
      },
    ];

    const result = await Card.aggregate(pipeline);
    res.status(200).json(result);
  }
);

// @desc Get the monthly sales for any product
// @route GET /api/monthly_sales
// @access Public
// @parameters product_id
const getMonthlySales = asyncHandler(async (req, res) => {
  const { software } = req.body;
  console.log(software);

  const pipeline = [
    {
      $match: {
        software: software,
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalSales: { $sum: "$amount" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        sales: "$totalSales",
      },
    },
  ];

  const result = await Card.aggregate(pipeline);
  const monthlySales = result.map((item) => item.sales);
  res.status(200).json(monthlySales);
});

module.exports = {
  getTotalItems,
  getNthMostTotalItems,
  getPercentageOfDepartmentWiseSoldItems,
  getMonthlySales,
};
