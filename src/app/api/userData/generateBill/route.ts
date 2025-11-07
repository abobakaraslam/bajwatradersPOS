/* File: route.ts located in api/userData/generateBill/ */
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SaleDatabaseModel from "@/models/SaleDatabaseModel";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";
import ProductNameDatabase from "@/models/ProductNameDatabase";

interface PurchaseDatabase {
  pricePurchase: number;
}

// Disable caching for this route globally
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { cart } = await req.json();

    if (!cart || cart.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Cart is empty" }),
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        }
      );
    }

    let rand_number = Math.floor(Math.random() * 90) + 10;
    let n_sale = await SaleDatabaseModel.countDocuments();
    let billID = `Bill-${n_sale + 1}-${rand_number}`;

    for (let index = 0; index < cart.length; index++) {
      const { productId, priceSale, quantitySale } = cart[index];

      const product_fetched = await PurchaseDatabase.find({ productId });
      const pricePurchase_fetched = product_fetched[0].pricePurchase;

      const productName_fetched = await ProductNameDatabase.find({ productId });
      const productName_get = productName_fetched[0].productName;

      const assignSaleid = `Sale-${n_sale + 1}-${rand_number}`;

      await SaleDatabaseModel.create({
        saleId: assignSaleid,
        productId,
        productName: productName_get,
        quantitySold: quantitySale,
        priceSalePerUnit: priceSale,
        priceSaleAmount: quantitySale * priceSale,
        pricePurchase: pricePurchase_fetched * quantitySale,
        profit: (priceSale - pricePurchase_fetched) * quantitySale,
        customerId: billID,
        billId: billID,
      });

      n_sale += 1;

      await StockDatabase.updateOne(
        { productId },
        { $inc: { availableQuantity: -quantitySale } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        billId: billID,
      }),
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate bill" }),
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
