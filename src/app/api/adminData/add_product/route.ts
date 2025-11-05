import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProductNameDatabase from "@/models/ProductNameDatabase";
import StockDatabase from "@/models/StockDatabase";
import PurchaseDatabase from "@/models/PurchaseDatabase";

export async function POST(req: Request) {

  
  try {
    const { selectedProductId, selectedProductName, productName, productTypes, priceSale, pricePurchase, quantityProduct } = await req.json();

    //console.log("selectedProductId: ", selectedProductId);
    //console.log("selectedProductName: ", selectedProductName);
    //console.log("productName: ", productName);
    //console.log("productTypes: ", productTypes);
    //console.log("priceSale: ", priceSale);
    //console.log("pricePurchase: ", pricePurchase);
    //console.log("quantityProduct: ", quantityProduct);

    let getSelectedProduct = 0;//0 for not-get
    let getNewName4Product = 0;//0 for not-new

    let assignProductid = "";
    let assignProductName = "";

    /*if existing product is select */
    if (selectedProductName) {
      getSelectedProduct = 1;//1 for yes-get

      assignProductid = selectedProductId;
      assignProductName = selectedProductName;
    }
    //console.log("getSelectedProduct: ", getSelectedProduct);

    /*new product will be created */
    if (productName != "notProduct") {
      getNewName4Product = 1;//1 for yes-new
    }
    //console.log("getNewName4Product: ", getNewName4Product);


    if (getSelectedProduct === 0 && getNewName4Product ===0 ) {
      return NextResponse.json(
        {
          error: "Product-Name is required",
        },
        {
          status: 400,
        }
      );
    }
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
            { error: "Items-Name already exists" },
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


      /*
      Insertion in ProductNameDatabase
      */
      // Get number of products
      let rand_number = Math.floor(Math.random() * 90) + 10;
      const n_product = await ProductNameDatabase.countDocuments();
      ////console.log("n_product test: ", n_product);
      assignProductid = `P-${n_product + 1}-${rand_number}`;

      ////console.log("new Product ID: ", assignProductid);
      
      //below should be based on schema
      // Insert new user into database
      await ProductNameDatabase.create({
        productId: assignProductid,
        productName: productName
      });
      ////console.log("product inserted");
   

      /*
      Insertion in StockDatabase
      */

      const n_stock = await StockDatabase.countDocuments();
      //console.log("n_stock test: ", n_stock);
      const assignStockid = `Stock-${n_stock + 1}-${rand_number}`;

      //console.log("new assignStockid ID: ", assignStockid);

      //below should be based on schema
      // Insert new user into database
      await StockDatabase.create({
        stockId: assignStockid,
        productId: assignProductid,
        productName: productName,
        availableQuantity: quantityProduct
      });



      /*
      Insertion in PurchaseDatabase
      */
      // Get number of Products-Variant-Types
      const n_purchase = await PurchaseDatabase.countDocuments();
      //console.log("n_purchase test: ", n_purchase);
      const assignPurchaseid = `Purchase-${n_purchase + 1}-${rand_number}`;

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


    /*
    Sending response after inserting all product related
    */
    const res = NextResponse.json(
      {
        success: true,
        message: "Product has been Added successful",
      },
      {
        status: 201,
      }
    );

    return res;
  } catch (error) {
    ////console.error("Product Entry error:", error);
    return NextResponse.json({ success: false, message: "Failed to insert Product" });
  } finally {
  }
}
