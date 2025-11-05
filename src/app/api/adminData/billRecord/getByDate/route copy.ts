// /app/api/bills/getByDate/route.ts
import { NextResponse } from "next/server";
import BillModel from "@/models/SaleDatabaseModel";

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bills = await BillModel.find({
      createdAt: { $gte: start, $lte: end },
    }).lean();

    return NextResponse.json({ success: true, bills });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server Error" });
  }
}
