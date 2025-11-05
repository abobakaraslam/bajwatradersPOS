import mongoose, { Schema, model, models, Document } from "mongoose";

// Define ISales interface
export interface ISales extends Document {
  saleId: string;
  productId: string;
  productName: string;
  quantitySold: number;
  priceSalePerUnit: number;
  priceSaleAmount: number;
  pricePurchase: number;
  profit: number;
  customerId: string;
  billId: string;
}

// Define Sales Schema
const saleSchema = new Schema<ISales>(
  {
    saleId: {
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
    quantitySold: {
      type: Number,
      required: [true, "Quantity is required"]
    },
    priceSalePerUnit: {
      type: Number,
      required: [true, "priceSalePerUnit Price is required"]
    },
    priceSaleAmount: {
      type: Number,
      required: [true, "Sale Price is required"]
    },
    pricePurchase: {
      type: Number,
      required: [true, "pricePurchase Price is required"]
    },
    profit: {
      type: Number,
      required: [true, "profit Price is required"]
    },
    customerId: {
      type: String,
      required: [true, "customer ID is required"]
    },
    billId: {
      type: String,
      required: [true, "Bill ID is required"]
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);


// Delete cached model if exists (important in Next.js dev)
if (mongoose.models.SaleDatabaseModel) {
  delete mongoose.models.SaleDatabaseModel;
}


// Export SaleDatabaseModel Model
const SaleDatabaseModel =
  models?.SaleDatabaseModel || model<ISales>("SaleDatabaseModel", saleSchema, "sale_collection");

export default SaleDatabaseModel;
