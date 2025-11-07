"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Product {
  productId: string;
  productName: string;
  priceSale: number;
  pricePurchase: number;
  quantity: number;
}

// Sanitize input safely
const sanitizeInput = (input: string): string =>
  input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\\/g, "");

const numberValidator = (data: any): boolean => {
  const trimmed = String(data).trim();
  const numberPattern = /^-?\d+(\.\d+)?$/;
  return numberPattern.test(trimmed);
};

export default function StockUpdatingPage(): JSX.Element {
  const router = useRouter();
  const { productId } = useParams();

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [priceSale, setPriceSale] = useState<number>(0);
  const [pricePurchase, setPricePurchase] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [generalError, setGeneralError] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 4000);
  };

  // Fetch product info
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoadingItem(true);

      try {
        const res = await fetch(`/api/adminData/product_update/${productId}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });
        const data = await res.json();

        if (!res.ok || !data?.productName) {
          setGeneralError(data?.message || "Failed to fetch product details.");
          return;
        }

        setProduct(data);
        setPriceSale(data.priceSale);
        setPricePurchase(data.pricePurchase);
        setQuantity(data.quantity);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setGeneralError("Error fetching product details.");
      } finally {
        setLoadingItem(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle Update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");

    const priceSaleClean = sanitizeInput(String(priceSale));
    const pricePurchaseClean = sanitizeInput(String(pricePurchase));
    const quantityClean = sanitizeInput(String(quantity));

    // Validation
    if (
      !numberValidator(priceSaleClean) ||
      !numberValidator(pricePurchaseClean) ||
      !numberValidator(quantityClean) ||
      Number(priceSaleClean) < 1 ||
      Number(pricePurchaseClean) < 1 ||
      Number(quantityClean) < 1
    ) {
      setGeneralError("Please enter all required information in correct format");
      return;
    }

    try {
      setLoadingSubmit(true);
      const res = await fetch("/api/adminData/product_update_route", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
          cache: "no-store",
          body: JSON.stringify({
            selectedProductId: productId,
            selectedProductName: product?.productName,
            priceSale: priceSaleClean,
            pricePurchase: pricePurchaseClean,
            quantityProduct: quantityClean,
          }),
        });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setGeneralError(result.message || "Product update failed.");
        return;
      }

      showToast("Product updated successfully!");
      router.replace("/adminData/ProfileAdmin");
    } catch (error) {
      console.error("Update error:", error);
      setGeneralError("An error occurred during update. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const gotoDashboard = () => router.push("/adminData/ProfileAdmin/");

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center mt-8">
        <button
          className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={gotoDashboard}
        >
          Dashboard
        </button>
      </div>

      <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md mt-6">
        {generalError && (
          <p className="text-red-500 text-sm text-center mb-2">{generalError}</p>
        )}

        <h1 className="text-xl font-bold mb-4 text-center">Update Item</h1>

        {loadingItem ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-12 h-12 border-4 border-[#0F6466] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">
              Loading item details, please wait...
            </p>
          </div>
        ) : product ? (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-800">
              <span className="font-semibold">Product ID:</span> {product.productId}
            </p>
            <p className="text-gray-800 mb-4">
              <span className="font-semibold">Product Name:</span> {product.productName}
            </p>

            <label className="block text-gray-800 text-sm mb-1">Sale Price</label>
            <input
              type="number"
              placeholder="Sale Price per Item"
              className="w-full p-2 mb-3 border rounded"
              value={priceSale}
              onChange={(e) => setPriceSale(Number(e.target.value))}
            />

            <label className="block text-gray-800 text-sm mb-1">Purchase Price</label>
            <input
              type="number"
              placeholder="Purchase Price per Item"
              className="w-full p-2 mb-3 border rounded"
              value={pricePurchase}
              onChange={(e) => setPricePurchase(Number(e.target.value))}
            />

            <label className="block text-gray-800 text-sm mb-1">Quantity</label>
            <input
              type="number"
              placeholder="Quantity"
              className="w-full p-2 mb-4 border rounded"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-70"
            >
              {loadingSubmit ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Item...</span>
                </>
              ) : (
                "Update Item"
              )}
            </button>
          </form>
        ) : (
          <p className="text-gray-600 text-center py-6">
            No product details found for this ID.
          </p>
        )}

        {message && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all z-50">
            {message}
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-8 mb-8">
        Software Developed by Abo Bakar<br />+92-313-5369068
      </p>
    </div>
  );
}
