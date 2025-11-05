import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";

export async function PUT(req: Request) {
  try {
    const { selectedProductId, selectedProductName, priceSale, pricePurchase, quantityProduct } = await req.json();

    await connectToDatabase();
/*
    console.log("Updating Product:");
    console.log("Product ID:", selectedProductId);
    console.log("Quantity:", quantityProduct);
    console.log("Purchase Price:", pricePurchase);
    console.log("Sale Price:", priceSale);
*/
    // Update Stock Quantity
    const updateStock = await StockDatabase.updateOne(
      { productId: selectedProductId },
      { $set: { availableQuantity: quantityProduct } }
    );

    // Update Purchase Prices
    const updatePurchase = await PurchaseDatabase.updateOne(
      { productId: selectedProductId },
      { $set: { pricePurchase, priceSale } }
    );

    // Check update results
    if (updateStock.matchedCount === 0 && updatePurchase.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "No matching product found to update.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      updates: {
        stock: updateStock.modifiedCount,
        purchase: updatePurchase.modifiedCount,
      },
    });

  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Error updating product.", error: error.message },
      { status: 500 }
    );
  }
}
