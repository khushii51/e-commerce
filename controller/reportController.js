import Order from "../models/Order.js";

//get total sales by date range
export const getTotalSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
  console.log("startDate", typeof startDate);
   console.log("endDate", typeof endDate);

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required!" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const totalsales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalsales: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalsales: 1,
        },
      },
    ]);

    return res.status(200).json({
        totalsale: totalsales.length>0 ? totalsales[0]:{totalsales: 0}

    });
   
  } catch (error) {
    
    return res.status(500).json({ messag: "Internal server error", error: error.message });
  }
};
