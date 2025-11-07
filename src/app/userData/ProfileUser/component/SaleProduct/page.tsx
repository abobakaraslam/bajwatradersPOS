/* File: page.tsx   located in src/app/userData/ProfileUser/component/SaleProduct/           */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

interface Product {
  productId: string;
  productName: string;
  priceSale: number;
  availableQuantity: number;
}

interface CartItem {
  productId: string;
  productName: string;
  priceSale: number;
  quantitySale: number;
}

function SaleProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [buttonDisable, setbuttonDisable] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false); // Spinner Items state

  const router = useRouter();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingItems(true);
        const res = await fetch("/api/userData/saleProduct", {
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const extracted_array = data.products.map((product: any) => {
          const stockItem = data.stock.find(
            (s: any) => s.productId === product.productId
          );
          const priceItem = data.price.find(
            (p: any) => p.productId === product.productId
          );

          return {
            productId: product.productId,
            productName: product.productName,
            availableQuantity: stockItem ? stockItem.availableQuantity : 0,
            priceSale: priceItem ? priceItem.priceSale : 0,
          };
        });

        setProducts(extracted_array);
        setLoadingItems(false);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const productOptions = products.map((p) => ({
    value: p.productId,
    label: `${p.productName} - Rs.${p.priceSale} - Qty: ${p.availableQuantity}`,
  }));

  // Add product to cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.productId === selectedProduct.productId
      );
      if (existing) {
        return prevCart.map((item) =>
          item.productId === selectedProduct.productId
            ? { ...item, quantitySale: item.quantitySale + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: selectedProduct.productId,
            productName: selectedProduct.productName,
            priceSale: selectedProduct.priceSale,
            quantitySale: 1,
          },
        ];
      }
    });
    setSelectedProduct(null);
  };

  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  const handleQuantityChange = (id: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id
          ? {
              ...item,
              quantitySale: Math.max(1, item.quantitySale + change),
            }
          : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.priceSale * item.quantitySale,
    0
  );

  // Handle Bill Generation (Frontend → Backend)
  const handleGenerateBill = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      setLoading(true);
      setbuttonDisable(true);
      //console.log("cart: ", cart);
      

      const res = await fetch("/api/userData/generateBill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        cache: "no-store",
        body: JSON.stringify({ cart }),
      });

      if (!res.ok) throw new Error("Failed to generate bill");

      const data = await res.json();

      //alert(`Bill Generated Successfully!\nBill ID: ${data.billId}\nTotal: Rs.${totalAmount}`);

      // Redirect to Bill Page
      router.push(`/userData/bill/${data.billId}`);
      
    } catch (err) {
      console.error("Error generating bill:", err);
      alert("Error while generating bill.");
      setbuttonDisable(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formBG w-full mt-6 sm:w-11/12 md:w-11/12 lg:w-2/3 xl:w-1/2 mx-auto pt-6 p-3 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold p-0 m-0 pt-0 text-center text-gray-800 dark:text-white">
        Items Sale
      </h2>

    {!loadingItems ? (
      <div>
        {/* Select Product */}
        <div className="mb-4">

          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Search and Select item
          </label>

          <Select
            options={productOptions}
            value={
              selectedProduct
                ? {
                    value: selectedProduct.productId,
                    label: `${selectedProduct.productName} - Rs.${selectedProduct.priceSale}`,
                  }
                : null
            }
            onChange={(option) => {
              if (option) {
                const product = products.find((p) => p.productId === option.value);
                if (product) setSelectedProduct(product);
              }
            }}
            placeholder="Search product..."
            isSearchable
            className="text-sm"
          />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedProduct}
            className="mt-3 px-4 py-2 disabled:bg-gray-400 formUserButton"
          >
            Add to Cart
          </button>
        </div>

        {/* Cart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            🛒 Cart Items
          </h3>

          {cart.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No items in cart.</p>
          ) : (
            <table className="w-full text-sm text-gray-700 dark:text-gray-200">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="py-2 text-left">Product</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        className="px-2 bg-gray-500 dark:bg-gray-700 rounded"
                      >
                        -
                      </button>
                      {item.quantitySale}
                      <button
                        onClick={() => handleQuantityChange(item.productId, 1)}
                        className="px-2 bg-gray-500 dark:bg-gray-700 rounded"
                      >
                        +
                      </button>
                    </td>
                    <td className="text-right">{item.priceSale}</td>
                    <td className="text-right">
                      {item.priceSale * item.quantitySale}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-red-600 font-bold p-1 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {cart.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                Total: Rs.{totalAmount}
              </span>
              <button
                type="button"
                onClick={handleGenerateBill}
                disabled={buttonDisable}
                className="px-5 py-2 formUserButton disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Generate Bill"}
              </button>
            </div>
          )}
        </div>
      </div>

      ) : (
          <>
            <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#0F6466] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">
              Loading Items for Sale, please wait...
            </p>
          </div>
          </>
        )}

    </div>
  );
}

export default SaleProduct;
