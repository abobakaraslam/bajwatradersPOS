/*File: route.ts located in src/app/api/userData/saleProduct          */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/ProductNameDatabase";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";

export async function GET() {
  try {
    // Connect to MongoDB using Mongoose
    await connectToDatabase();

    // Fetch data from database
    const product_fetched = await Product.find();
    const stock_fetched = await StockDatabase.find();
    const price_fetched = await PurchaseDatabase.find();

    return NextResponse.json({ success: true, products:  product_fetched, stock: stock_fetched, price: price_fetched});
  } catch (error) {
    console.error("Error fetching product data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product data.",
      },
      { status: 500 }
    );
  }
}
