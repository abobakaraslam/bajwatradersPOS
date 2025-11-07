import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Stock from "@/models/StockDatabase";
import Purchase from "@/models/PurchaseDatabase";

// ✅ Disable Next.js caching at route level
export const dynamic = "force-dynamic";
export const revalidate = 0; // Prevent ISR
export const fetchCache = "force-no-store"; // Prevent data caching by Next.js
export const runtime = "nodejs"; // Ensure runs on server

// GET: Fetch all stock records
export async function GET() {
  try {
    await connectToDatabase();

    // Dynamically use the actual collection name from Mongoose model
    const purchaseCollection = Purchase.collection.name;

    const stockRecords = await Stock.aggregate([
      {
        $lookup: {
          from: purchaseCollection,
          localField: "productId",
          foreignField: "productId",
          as: "purchaseInfo",
        },
      },
      {
        $unwind: "$purchaseInfo",
      },
      {
        $project: {
          _id: 0,
          productId: 1,
          productName: 1,
          availableQuantity: 1,
          pricePurchase: "$purchaseInfo.pricePurchase",
          priceSale: "$purchaseInfo.priceSale",
        },
      },
      { $sort: { productName: 1 } },
    ]);

    if (!stockRecords || stockRecords.length === 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No stock records found",
          stock: [],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    // ✅ Always send no-cache headers
    return new NextResponse(
      JSON.stringify({
        success: true,
        stock: stockRecords,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching stock records:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Error fetching stock data",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
