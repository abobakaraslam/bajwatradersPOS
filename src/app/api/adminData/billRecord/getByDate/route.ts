import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bill from "@/models/SaleDatabaseModel";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { startDate, endDate } = await req.json();

    if (!startDate || !endDate) {
      return NextResponse.json({
        success: false,
        message: "Both start and end dates are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bills = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          // Extract numeric part of billId (after the dash)
          billIdNumber: {
            $toInt: {
              $arrayElemAt: [
                { $split: ["$billId", "-"] },
                1,
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: {
            billId: "$billId",
            billIdNumber: "$billIdNumber",
            date: "$date",
          },
          totalSaleAmount: { $sum: "$priceSaleAmount" },
          totalPurchase: { $sum: "$pricePurchase" },
          totalProfit: { $sum: "$profit" },
          items: {
            $push: {
              productName: "$productName",
              quantitySold: "$quantitySold",
              priceSalePerUnit: "$priceSalePerUnit",
              priceSaleAmount: "$priceSaleAmount",
              pricePurchase: "$pricePurchase",
              profit: "$profit",
            },
          },
        },
      },
      // ✅ Sort by date ascending, then numeric billId ascending
      {
        $sort: { "_id.date": 1, "_id.billIdNumber": 1 },
      },
      // Clean up unnecessary fields if needed
      {
        $project: {
          "_id.billIdNumber": 0, // hide helper field
        },
      },
    ]);

    return NextResponse.json({ success: true, bills });
  } catch (error) {
    console.error("Error fetching grouped bills:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching grouped bills.",
    });
  }
}
