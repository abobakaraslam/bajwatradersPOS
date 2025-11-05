import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Stock from "@/models/StockDatabase";
import Purchase from "@/models/PurchaseDatabase";

// GET: Fetch all stock records
export async function GET() {
  try {
    await connectToDatabase();

    //const stockRecords = await Stock.find().sort({ productName: 1 }); // sorted alphabetically

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
      return NextResponse.json({
        success: false,
        message: "No stock records found",
        stock: [],
      });
    }

    //console.log("stockRecords: ", stockRecords);


    return NextResponse.json({
      success: true,
      stock: stockRecords,
    });
  } catch (error: any) {
    console.error("Error fetching stock records:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching stock data", error: error.message },
      { status: 500 }
    );
  }
}
