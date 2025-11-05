import mongoose, { Schema, model, models, Document } from "mongoose";

// Define IStock interface
export interface IStock extends Document {
  stockId: string;
  productId: string;
  productName: string;
  availableQuantity: number;
}

// Define stock Schema
const stockSchema = new Schema<IStock>(
  {
    stockId: {
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
    availableQuantity: {
      type: Number,
      required: [true, "Quantity is required"]
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);


// Delete cached model if exists (important in Next.js dev)
if (mongoose.models.StockDatabase) {
  delete mongoose.models.StockDatabase;
}


// Export StockDatabase Model
const StockDatabase =
  models?.StockDatabase || model<IStock>("StockDatabase", stockSchema, "stock_collection");

export default StockDatabase;
