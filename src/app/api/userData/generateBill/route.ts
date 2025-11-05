import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SaleDatabaseModel from "@/models/SaleDatabaseModel";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";
import ProductNameDatabase from "@/models/ProductNameDatabase";

interface PurchaseDatabase {
  pricePurchase: number;
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { cart } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    //console.log("cart: ", cart);
    //console.log("specific price: ",cart[0].priceSale);

    /*
    Insertion in SaleDatabaseModel
    */
    // Get number of Sales
    let n_sale = await SaleDatabaseModel.countDocuments();

    let billID = `Bill-${n_sale+1}`;
    
    for (let index = 0; index < cart.length; index++) {
      let priceSale = cart[index].priceSale;
      let productId = cart[index].productId;
      let quantitySale = cart[index].quantitySale;

      const product_fetched = await PurchaseDatabase.find({ productId: productId });
      ////console.log("product_fetched: ", product_fetched);

      let pricePurchase_fetched = product_fetched[0].pricePurchase;

      let assignSaleid = `Sale-${n_sale + 1}`;


      const productName_fetched = await ProductNameDatabase.find({ productId: productId });
      ////console.log("product_fetched: ", product_fetched);

      let productName_get = productName_fetched[0].productName;

      //below should be based on schema
      // Insert new entry into database
      await SaleDatabaseModel.create({
        saleId: assignSaleid,
        productId: productId,
        productName: productName_get,
        quantitySold: quantitySale,
        priceSalePerUnit: priceSale,
        priceSaleAmount: quantitySale*priceSale,
        pricePurchase: pricePurchase_fetched*quantitySale,
        profit: (priceSale - pricePurchase_fetched)*quantitySale,
        customerId: billID,
        billId: billID
      });
      ////console.log("product inserted");

      n_sale = n_sale + 1;

      await StockDatabase.updateOne(
              { productId: productId },
              { $inc: { availableQuantity: -quantitySale } }
      );

    }

    
    return NextResponse.json({
      success: true,
      billId: billID,
    });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate bill" }, { status: 500 });
  }
}