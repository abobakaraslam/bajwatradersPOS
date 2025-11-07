import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProductNameDatabase from "@/models/ProductNameDatabase";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";
import { cookies } from "next/headers";
import Session from "@/models/Session";

// 🧱 DELETE: Remove product(s) by productId
export async function DELETE(req: Request) {
  try {
    // ✅ Validate session from cookie (middleware-style auth)
    const sessionId = cookies().get("sessionId")?.value;
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No session found." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid session." },
        { status: 401 }
      );
    }

    // ✅ Parse productId from request body
    const { productId } = await req.json();
    if (!productId || (Array.isArray(productId) && productId.length === 0)) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid productId." },
        { status: 400 }
      );
    }

    // Normalize to array
    const productIds = Array.isArray(productId) ? productId : [productId];

    console.log("🗑️ Deleting product(s):", productIds);

    // ✅ Connect to MongoDB
    await connectToDatabase();

    // ✅ Perform cascading deletes
    const productDelete = await ProductNameDatabase.deleteMany({
      productId: { $in: productIds },
    });
    const stockDelete = await StockDatabase.deleteMany({
      productId: { $in: productIds },
    });
    const purchaseDelete = await PurchaseDatabase.deleteMany({
      productId: { $in: productIds },
    });

    const deletedCount =
      productDelete.deletedCount +
      stockDelete.deletedCount +
      purchaseDelete.deletedCount;

    if (deletedCount > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `✅ Deleted product(s) successfully.`,
          details: {
            productsRemoved: productDelete.deletedCount,
            stockRemoved: stockDelete.deletedCount,
            purchasesRemoved: purchaseDelete.deletedCount,
          },
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    return NextResponse.json(
      { success: false, message: "No matching products found to delete." },
      { status: 404 }
    );
  } catch (error) {
    console.error("❌ Error deleting products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product(s)." },
      { status: 500 }
    );
  }
}
