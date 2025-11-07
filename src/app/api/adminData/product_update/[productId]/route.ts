export const revalidate = 0; // Disable ISR & caching

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProductNameDatabase from "@/models/ProductNameDatabase";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    // Force no-cache at edge / browser level
    const headers = new Headers();
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    // Connect to database
    const connected = await connectToDatabase();
    if (!connected) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Database connection failed." }),
        { status: 500, headers }
      );
    }

    const { productId } = params;
    if (!productId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Product ID is required." }),
        { status: 400, headers }
      );
    }

    console.log("🔍 Fetching product for productId:", productId);

    // Fetch product data freshly from MongoDB
    const stockData = await StockDatabase.findOne({ productId });
    const priceData = await PurchaseDatabase.findOne({ productId });

    if (!stockData && !priceData) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "No product found with the given ID." }),
        { status: 404, headers }
      );
    }

    // Extract safely
    const productName = stockData?.productName || priceData?.productName || "Unknown";
    const availableQuantity = stockData?.availableQuantity ?? 0;
    const pricePurchase = priceData?.pricePurchase ?? 0;
    const priceSale = priceData?.priceSale ?? 0;

    const resData = {
      success: true,
      productId,
      productName,
      pricePurchase,
      priceSale,
      quantity: availableQuantity,
    };

    console.log("✅ Product fetched (no cache):", resData);

    return new NextResponse(JSON.stringify(resData), { status: 200, headers });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product details." },
      { status: 500 }
    );
  }
}
