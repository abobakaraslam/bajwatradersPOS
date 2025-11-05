import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProductNameDatabase from "@/models/ProductNameDatabase";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";

export async function GET(req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await connectToDatabase();
    const { productId } = params;

    console.log("productId: ", productId);



    const stock_fetched = await StockDatabase.findOne({productId: productId});
    //console.log("stock_fetched: ", stock_fetched)
    const price_fetched = await PurchaseDatabase.findOne({productId: productId});
    //console.log("price_fetched: ", price_fetched)

    const quantity_fetch = stock_fetched.availableQuantity;
    console.log("quantity_fetch: ", quantity_fetch)
    const productName_fetch = stock_fetched.productName;
    console.log("productName_fetch: ", productName_fetch)

    const pricePurchase_fetch = price_fetched.pricePurchase;
    console.log("pricePurchase_fetch: ", pricePurchase_fetch)
    const priceSale_fetch = price_fetched.priceSale;
    console.log("priceSale_fetch: ", priceSale_fetch)

    const resData = {
      productId: productId,
      productName: productName_fetch,
      pricePurchase: pricePurchase_fetch,
      priceSale: priceSale_fetch,
      quantity: quantity_fetch
    };



/*
    if (!priceSale) {
      return NextResponse.json(
        {
          error: "Sale Price is required",
        },
        {
          status: 400,
        }
      );
    }
    if (!pricePurchase) {
      return NextResponse.json(
        {
          error: "Purchase Price is required",
        },
        {
          status: 400,
        }
      );
    }
    if (!quantityProduct) {
      return NextResponse.json(
        {
          error: "Quantity for Product is required",
        },
        {
          status: 400,
        }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    

    if (getNewName4Product === 1) {
      //console.log("going to create new product");
    // Check if productName already exists
      try {
        const existingProductName = await ProductNameDatabase.findOne({ productName });
        //////console.log("existingProductName test: ", existingProductName)
        if (existingProductName) {
          return NextResponse.json(
            { error: "Product-Name already exists" },
            { status: 400 }
          );
        }
      } catch (error) {
        //console.error("Error while finding Product-Name:", error);
        return NextResponse.json(
          { error: "Failed to find Product-Name" },
          { status: 500 }
        );
      }

*/
      /*
      Insertion in ProductNameDatabase
      */
      // Get number of products

/*
      const n_product = await ProductNameDatabase.countDocuments();
      ////console.log("n_product test: ", n_product);
      assignProductid = `Product-${n_product + 1}`;

      ////console.log("new Product ID: ", assignProductid);
      
      //below should be based on schema
      // Insert new user into database
      await ProductNameDatabase.create({
        productId: assignProductid,
        productName: productName
      });
      ////console.log("product inserted");
   
*/
      /*
      Insertion in StockDatabase
      */
/*
      const n_stock = await StockDatabase.countDocuments();
      //console.log("n_stock test: ", n_stock);
      const assignStockid = `Stock-${n_stock + 1}`;

      //console.log("new assignStockid ID: ", assignStockid);

      //below should be based on schema
      // Insert new user into database
      await StockDatabase.create({
        stockId: assignStockid,
        productId: assignProductid,
        productName: productName,
        availableQuantity: quantityProduct
      });


*/
      /*
      Insertion in PurchaseDatabase
      */
/*
      // Get number of Products-Variant-Types
      const n_purchase = await PurchaseDatabase.countDocuments();
      //console.log("n_purchase test: ", n_purchase);
      const assignPurchaseid = `Purchase-${n_purchase + 1}`;

      //console.log("new assignPurchaseid ID: ", assignPurchaseid);
      


      //below should be based on schema
      // Insert new user into database
      await PurchaseDatabase.create({
        purchaseId: assignPurchaseid,
        productId: assignProductid,
        productName: productName,
        quantityPurchase: quantityProduct,
        pricePurchase: pricePurchase,
        priceSale: priceSale
      });
      ////console.log("Purchasing data is inserted");
    }

    if (getNewName4Product === 0) {

      //console.log("going to update stock only");
      await StockDatabase.updateOne(
        { productId: selectedProductId },
        { $inc: { availableQuantity: quantityProduct } }
      );

      //console.log("going to update purchase price");
      await PurchaseDatabase.updateOne(
        { productId: selectedProductId },
        { pricePurchase: pricePurchase}
      );

      //console.log("going to update purchase/sale price");
      await PurchaseDatabase.updateOne(
        { productId: selectedProductId },
        { pricePurchase: pricePurchase, priceSale: priceSale}
      );

    }

*/
    /*
    Sending response after inserting all product related
    */

    const res = NextResponse.json(resData);

    return res;

  } catch (error) {
    ////console.error("Product Entry error:", error);
    return NextResponse.json({ success: false, message: "Failed to insert Product" });
  }
}
