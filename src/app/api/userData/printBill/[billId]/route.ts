import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Bill from "@/models/SaleDatabaseModel";

// Disable ISR or caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Converts a Pakistan local datetime string to a UTC Date object.
 * This ensures correct handling when MongoDB stores dates in UTC.
 */
export function pakistanLocalToUTC(localDateTime: string): Date {
  // Append timezone offset (+05:00 for Pakistan Standard Time)
  return new Date(localDateTime + "+05:00");
}

/**
 * GET Bill Details by Bill ID (with date formatted correctly)
 * Example route: /api/userData/printBill/BILL-105
 */
export async function GET(
  req: Request,
  { params }: { params: { billId: string } }
) {
  try {
    await connectToDatabase();
    const { billId } = params;

    if (!billId) {
      return NextResponse.json(
        { success: false, message: "Bill ID is required." },
        { status: 400 }
      );
    }

    // Fetch matching bill records
    const bills = await Bill.find({ billId }).lean();

    if (!bills || bills.length === 0) {
      return NextResponse.json(
        { success: false, message: "No bill found for the provided ID." },
        { status: 404 }
      );
    }

    // Ensure all date values are in proper ISO format
    const formattedBills = bills.map((bill) => ({
      ...bill,
      iDate: new Date(bill.iDate).toISOString(), // Always ISO UTC format
    }));

    // Add headers to disable caching
    const response = NextResponse.json(formattedBills);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching bill data." },
      { status: 500 }
    );
  }
}
