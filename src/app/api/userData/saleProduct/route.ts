export const revalidate = 0;

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/ProductNameDatabase";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";

export async function GET() {
  try {
    // Connect to MongoDB using Mongoose
    const isConnected = await connectToDatabase();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, message: "Not Connected to Database" },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    // Fetch data from database
    const products = await Product.find();
    const stock = await StockDatabase.find();
    const price = await PurchaseDatabase.find();

    return NextResponse.json(
      { success: true, products, stock, price },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product data." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
