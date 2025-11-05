import mongoose, { Schema, model, models, Document } from "mongoose";

// Define IPurchase interface
export interface IPurchase extends Document {
  purchaseId: string;
  productId: string;
  productName: string;
  quantityPurchase: number;
  pricePurchase: number;
  priceSale: number;
}

// Define Purchase Schema
const purchaseSchema = new Schema<IPurchase>(
  {
    purchaseId: {
      type: String,
      required: true,
      },
    productId: {
      type: String,
      required: true,
      },
    productName: {
      type: String,
      required: true,
      },
    quantityPurchase: {
      type: Number,
      required: [true, "Quantity is required"]
    },
    pricePurchase: {
      type: Number,
      required: [true, "Purchase Price is required"]
    },
    priceSale: {
      type: Number,
      required: [true, "Sale Price is required"]
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);


// Delete cached model if exists (important in Next.js dev)
if (mongoose.models.PurchaseDatabase) {
  delete mongoose.models.PurchaseDatabase;
}


// Export PurchaseDatabase Model
const PurchaseDatabase =
  models?.PurchaseDatabase || model<IPurchase>("PurchaseDatabase", purchaseSchema, "purchase_collection");

export default PurchaseDatabase;
