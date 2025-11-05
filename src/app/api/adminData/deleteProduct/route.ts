import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import ProductNameDatabase from "@/models/ProductNameDatabase";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";

export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();

    console.log("deleting ID as:")
    console.log("productId: ", productId)

    await connectToDatabase(); // Ensure database connection

    
    // Delete users with matching emails
    const product_delete = await ProductNameDatabase.deleteMany({ productId: { $in: productId } });
    const stock_delete = await StockDatabase.deleteMany({ productId: { $in: productId } });
    const purchase_delete = await PurchaseDatabase.deleteMany({ productId: { $in: productId } });

    if (product_delete.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `${product_delete.deletedCount} user(s) deleted successfully.`,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "No users found with the provided emails." },
        { status: 404 }
      );
    }
      
  } catch (error) {
    console.error("Error deleting users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete users." },
      { status: 500 }
    );
  }
}
