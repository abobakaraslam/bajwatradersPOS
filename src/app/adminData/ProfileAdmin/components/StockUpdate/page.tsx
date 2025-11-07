"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StockItem {
  productId: string;
  productName: string;
  availableQuantity: number;
  pricePurchase: number;
  priceSale: number;
}

export default function StockUpdate(): JSX.Element {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [buttonDisable, setbuttonDisable] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const router = useRouter();

  // Fetch Stock Data (Always No-Cache)
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch("/api/adminData/stock/getAll", {
          method: "GET",
          cache: "no-store", // <-- Ensures fresh data every time
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch stock data");

        const data = await response.json();
        if (data.success && Array.isArray(data.stock)) {
          setStockData(data.stock);
          setFilteredStock(data.stock);
        } else {
          console.warn("Unexpected stock response:", data);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  // 🔍 Filter by search term
  useEffect(() => {
    const filtered = stockData.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchTerm, stockData]);

  // Handle checkbox (single selection)
  const handleCheckboxChange = (productId: string) => {
    setSelectedProduct((prev) => (prev === productId ? null : productId));
  };

  // Handle Update
  const handleUpdate = () => {
    if (!selectedProduct) {
      alert("Please select one product to update.");
      return;
    }
    setLoadingUpdate(true);
    setbuttonDisable(true);
    router.push(`/adminData/StockUpdateSelected/${selectedProduct}`);
  };

  // 🗑️ Handle Delete
  const handleDelete = async () => {
    if (!selectedProduct) {
      alert("Please select at least one product to delete.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete selected product?");
    if (!confirmDelete) return;

    setLoadingDelete(true);
    setbuttonDisable(true);

    try {
      const response = await fetch("/api/adminData/deleteProduct", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // prevent cache of DELETE request
        body: JSON.stringify({ productId: selectedProduct }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Selected product deleted successfully!");
        window.location.replace("/adminData/ProfileAdmin");
      } else {
        alert("Failed to delete product: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting product.");
    } finally {
      setLoadingDelete(false);
      setbuttonDisable(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#0F6466] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-700 font-medium">Loading Stock Data...</p>
      </div>
    );

  return (
    <div className="p-4 min-h-screen">
      {/* Buttons */}
      <div className="text-center mb-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded w-40 transition disabled:opacity-70"
          disabled={buttonDisable}
        >
          {loadingUpdate ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 mr-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "Update Item"
          )}
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded w-40 transition disabled:opacity-70"
          disabled={buttonDisable}
        >
          {loadingDelete ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 mr-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "Delete Item"
          )}
        </button>
      </div>

      {/* Heading + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <p className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
          📦 Stock Updating
        </p>

        <input
          type="text"
          placeholder="Search by product name..."
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F6466] focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stock Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-[#0F6466] text-white">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-center">Select</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Product Name</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Qty</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Purchase / Unit</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Sale / Unit</th>
            </tr>
          </thead>

          <tbody>
            {filteredStock.length > 0 ? (
              filteredStock.map((item, index) => (
                <tr
                  key={item.productId}
                  onClick={() => handleCheckboxChange(item.productId)}
                  className={`border-b transition duration-200 cursor-pointer ${
                    selectedProduct === item.productId
                      ? "bg-blue-100 hover:bg-blue-200"
                      : index % 2 === 0
                      ? "bg-white hover:bg-blue-50"
                      : "bg-gray-50 hover:bg-blue-50"
                  }`}
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProduct === item.productId}
                      onChange={() => handleCheckboxChange(item.productId)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 font-medium">
                    {item.productName}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {item.availableQuantity}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-green-700">
                    Rs. {item.pricePurchase}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-blue-700 font-semibold">
                    Rs. {item.priceSale}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 font-medium">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm mt-6">
        Showing {filteredStock.length} of {stockData.length} products
      </p>
    </div>
  );
}
