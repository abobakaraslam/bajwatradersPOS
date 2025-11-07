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
  iDate: Date;
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
      required: [true, "Quantity is required"],
    },
    priceSalePerUnit: {
      type: Number,
      required: [true, "Sale unit price is required"],
    },
    priceSaleAmount: {
      type: Number,
      required: [true, "Total sale amount is required"],
    },
    pricePurchase: {
      type: Number,
      required: [true, "Purchase price is required"],
    },
    profit: {
      type: Number,
      required: [true, "Profit is required"],
    },
    customerId: {
      type: String,
      required: [true, "Customer ID is required"],
    },
    billId: {
      type: String,
      required: [true, "Bill ID is required"],
    },

    // --- Important Section ---
    iDate: {
      type: Date,
      required: true,
      set: (value: Date | string) => {
        // Handle both string or Date input types
        const date =
          typeof value === "string" ? new Date(value) : new Date(value.getTime());
        // Convert to UTC (subtract local timezone offset)
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Delete cached model (important for Next.js dev environment)
if (mongoose.models.SaleDatabaseModel) {
  delete mongoose.models.SaleDatabaseModel;
}

// Export Model
const SaleDatabaseModel =
  models?.SaleDatabaseModel ||
  model<ISales>("SaleDatabaseModel", saleSchema, "sale_collection");

export default SaleDatabaseModel;
