import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define IProductName interface
export interface IProductName extends Document {
  productId: string;
  productName: string;
}

// Define ProductName Schema
const ProductNameSchema = new Schema<IProductName>(
  {
    productId: {
      type: String,
      required: true,
      },
    productName: {
      type: String,
      required: [true, "Product-Name is required"],
      /*unique: true*/
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);


// Delete cached model if exists (important in Next.js dev)
if (mongoose.models.ProductNameDatabase) {
  delete mongoose.models.ProductNameDatabase;
}


// Export ProductNameDatabase Model
const ProductNameDatabase =
  models?.ProductNameDatabase || model<IProductName>("ProductNameDatabase", ProductNameSchema, "product_collection");

export default ProductNameDatabase;
