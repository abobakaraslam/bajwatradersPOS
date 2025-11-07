import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bill from "@/models/SaleDatabaseModel";

export const dynamic = "force-dynamic"; // ✅ ensures no static caching
export const revalidate = 0; // ✅ disables ISR caching

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { startDate, endDate } = await req.json();
    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "Both start and end dates are required." },
        { status: 400 }
      );
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
          billIdNumber: {
            $toInt: { $arrayElemAt: [{ $split: ["$billId", "-"] }, 1] },
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
      { $sort: { "_id.date": 1, "_id.billIdNumber": 1 } },
      { $project: { "_id.billIdNumber": 0 } },
    ]);

    // ✅ Force no-cache headers in the response
    const response = NextResponse.json({ success: true, bills });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error fetching grouped bills:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching grouped bills." },
      { status: 500 }
    );
  }
}
