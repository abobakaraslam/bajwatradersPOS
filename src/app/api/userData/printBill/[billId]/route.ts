import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SaleDatabaseModel from "@/models/SaleDatabaseModel";

// Disable any caching globally for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { billId: string } }
) {
  try {
    await connectToDatabase();

    const { billId } = params;
    const bill_fetched = await SaleDatabaseModel.find({ billId });

    if (!bill_fetched || bill_fetched.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Bill data not found" }),
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        }
      );
    }

    const billData = bill_fetched.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantitySold: item.quantitySold,
      priceSalePerUnit: item.priceSalePerUnit,
      priceSaleAmount: item.priceSaleAmount,
      customerId: item.customerId,
      billId: item.billId,
      createdAt: item.createdAt,
    }));

    return new NextResponse(JSON.stringify(billData), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error fetching bill", error }),
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
