"use client";

import React, { useEffect, useState } from "react";

interface StockItem {
  productId: string;
  productName: string;
  availableQuantity: number;
  
  pricePurchase: number;
  priceSale: number;
}

export default function StockView(): JSX.Element {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [priceAllStock, setpriceAllStock] = useState(0);

  // Fetch Stock Data from API
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch("/api/adminData/stock/getAll", { method: "GET" });
        const data = await response.json();
        //console.log("stock view dasta", data);

        if (data.success) {
          setStockData(data.stock);
          setFilteredStock(data.stock);

          let priceTotalPurchase = 0;
          for (let index = 0; index < data.stock.length; index++) {
            let unit_price_per_item = data.stock[index].pricePurchase;
            let quantity_item = data.stock[index].availableQuantity;
            priceTotalPurchase = priceTotalPurchase + unit_price_per_item*quantity_item;
          }
          //console.log("priceTotalPurchase: ", priceTotalPurchase)
          setpriceAllStock(priceTotalPurchase);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  // Filter by search term
  useEffect(() => {
    const filtered = stockData.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStock(filtered);
  }, [searchTerm, stockData]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#0F6466] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-700 font-medium">Loading Stock Data...</p>
      </div>
    );

  return (
    <div className="p-4  min-h-screen">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          📦 Stock Overview
        </h2>

        <p className="mb-6"><span className="font-semibold">Total Purchase Amount: </span>{priceAllStock}</p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by product name..."
          className="w-full sm:w-64 px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F6466] focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stock Table */}
      <div className="overflow-x-auto bg-black rounded-xl shadow-md">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-[#0F6466] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Product Name</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Qty</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Purchase / Unit</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Total Purchase</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Sale / Unit</th>
            </tr>
          </thead>

          <tbody>
            {filteredStock.length > 0 ? (
              filteredStock.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-blue-50 transition duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-2 text-sm text-gray-800 font-medium">{item.productName}</td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">{item.availableQuantity}</td>
                  <td className="px-4 py-2 text-center text-sm text-green-700">
                    Rs. {item.pricePurchase}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-green-700">
                    Rs. {item.pricePurchase * item.availableQuantity}
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
