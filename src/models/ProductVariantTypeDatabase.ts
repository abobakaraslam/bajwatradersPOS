import mongoose, { Schema, model, models, Document } from "mongoose";

// Define IProductVariantType interface
export interface IProductVariantType extends Document {
  productVariantId: string;
  productId: string;
  productVariantTypeZero: string;
  productVariantTypeOne: string;
  productVariantTypeTwo: string;
  productVariantTypeThree: string;
  productVariantTypeFour: string;
}

// Define productVariantName Schema
const productVariantNameSchema = new Schema<IProductVariantType>(
  {
    productVariantId: {
      type: String,
      required: true,
      },
    productId: {
      type: String,
      required: true,
      },
    productVariantTypeZero: {
      type: String,
      /*required: [true, "productVariantTypeZero is required"]*/
    },
    productVariantTypeOne: {
      type: String
    },
    productVariantTypeTwo: {
      type: String
    },
    productVariantTypeThree: {
      type: String
    },
    productVariantTypeFour: {
      type: String
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);


// Delete cached model if exists (important in Next.js dev)
if (mongoose.models.ProductVariantTypeDatabase) {
  delete mongoose.models.ProductVariantTypeDatabase;
}


// Export ProductVariantTypeDatabase Model
const ProductVariantTypeDatabase =
  models?.ProductVariantTypeDatabase || model<IProductVariantType>("ProductVariantTypeDatabase", productVariantNameSchema, "product_variant_type_collection");

export default ProductVariantTypeDatabase;
