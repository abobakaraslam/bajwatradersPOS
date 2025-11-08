import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bill from "@/models/SaleDatabaseModel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Converts Pakistan local date (YYYY-MM-DD) into correct UTC boundaries
 * Example:
 *   startDate = "2025-11-08"
 *   → startDateUTC = 2025-11-07T19:00:00Z
 *   → endDateUTC   = 2025-11-08T18:59:59Z
 */
function getPakistanDayRange(startDate: string, endDate: string) {
  const startDateUTC = new Date(`${startDate}T00:00:00+05:00`);
  const endDateUTC = new Date(`${endDate}T23:59:59+05:00`);
  return { startDateUTC, endDateUTC };
}

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

    // Properly convert Pakistan-local day range into UTC
    const { startDateUTC, endDateUTC } = getPakistanDayRange(startDate, endDate);

    //console.log("Pakistan range to UTC:");
    //console.log("startDateUTC:", startDateUTC.toISOString());
    //console.log("endDateUTC:", endDateUTC.toISOString());

    // Example DB entry: iDate: "2025-11-07T21:12:37.000+00:00"
    const bills = await Bill.aggregate([
      {
        $match: {
          iDate: { $gte: startDateUTC, $lte: endDateUTC },
        },
      },
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$iDate" } },
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

    // Force no-cache for fresh data
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
