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

/**
 * Converts a Pakistan local datetime string to a UTC Date object
 * Example input: "2025-11-08T01:23:39"
 */
export function pakistanLocalToUTC(localDateTime: string): Date {
  // Interpret the provided time as being in Asia/Karachi
  const dateInPakistan = new Date(localDateTime + "+05:00");
  return dateInPakistan; // MongoDB will store in UTC automatically
}


export function getPakistanDateTime(): Date {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { timeZone: "Asia/Karachi" };

  // Convert to Pakistan time zone
  const formatter = new Intl.DateTimeFormat("en-US", {
    ...options,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  // Create a Date in Pakistan time but store as UTC equivalent
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+05:00`);
}



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

    //const getDate = getPakistanDateTime();
    //console.log("date now:", getDate.toISOString()); // will print UTC equivalent

    const localDateTime = new Date(); // user’s current time (Pakistan local)
    const iDateGet = pakistanLocalToUTC(localDateTime.toISOString().slice(0, 19)); // ensures +05:00 interpretation

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
        iDate: iDateGet,
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
