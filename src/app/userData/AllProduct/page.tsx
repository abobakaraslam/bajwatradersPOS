"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarUser from "../NavbarUser/page";

// Define Product Type (Instead of importing Product Model)
interface Product {
  productId: string;
  productName: string;
}

export default function AllUsers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProduct] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/userData/saleProduct");
        if (!response.ok) throw new Error("Failed to fetch Products");

        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message || "Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);


  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <NavbarUser />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Registered Products</h1>

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Select</th>
              <th className="border px-4 py-2">Product ID</th>
              <th className="border px-4 py-2">Product Name</th>
            </tr>
          </thead>
          <tbody>
            {products.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                  />
                </td>
                <td className="border px-4 py-2">
                  test
                </td>
                <td className="border px-4 py-2">test2</td>
                <td className="border px-4 py-2">
                  <img
                    src=""
                    alt="Profile"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Selected Users
          </button>

          <button
            onClick={() => router.push("ProfileAdmin")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Admin Profile
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Update Selected Users
          </button>
        </div>
      </div>
    </div>
  );
}
