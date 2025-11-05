import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/ProductNameDatabase";

export async function GET() {
  try {
    // Connect to MongoDB using Mongoose
    await connectToDatabase();

    const product_fetched = await Product.find();

    return NextResponse.json({ success: true, products:  product_fetched});
    
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
