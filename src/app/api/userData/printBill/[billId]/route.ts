import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SaleDatabaseModel from "@/models/SaleDatabaseModel";
//import ProductNameDatabase from "@/models/ProductNameDatabase";

// GET /api/bills/[billId]
export async function GET(
  request: Request,
  { params }: { params: { billId: string } }
) {
  try {
    await connectToDatabase();

    //console.log("params: ", params);

    const { billId } = params;
    const bill_fetched = await SaleDatabaseModel.find({ billId: billId });

    //console.log("bill_fetched new: ", bill_fetched);

    let billData: any[] = [];
    //let priceTotal = 0;

    for (let index = 0; index < bill_fetched.length; index++) {
      const item = bill_fetched[index];

      
      const productId_get = item.productId;
      /*
      const product_fetch = await ProductNameDatabase.findOne({ productId: //productId_get });

      let productName_get = "";
      if (product_fetch) {
        productName_get = product_fetch.productName;
      }
        */
      //let priceSaleAmount_get = item.priceSaleAmount;
      //priceTotal = priceTotal + priceSaleAmount_get
        // Push one clean record to billData
      billData.push({
        productId: productId_get,
        productName: item.productName,
        quantitySold: item.quantitySold,
        priceSalePerUnit: item.priceSalePerUnit,
        priceSaleAmount: item.priceSaleAmount,
        customerId: item.customerId,
        billId: item.billId,
        createdAt: item.createdAt,
      });
    }
    //console.log("billData Data:", billData);

    if (!bill_fetched) {
      return NextResponse.json({ message: "billData not found" }, { status: 404 });
    }

    return NextResponse.json(billData, { status: 200 });
  } catch (error) {
    console.error("Error fetching bill:", error);
    return NextResponse.json(
      { message: "Error fetching bill", error },
      { status: 500 }
    );
  }
}
