// src/utils/apiClients.ts
import { apiClient } from "./apiClient";

const makeClient = (redirectPath: string) => ({
  get: (url: string) => apiClient(url, {}, redirectPath),
  post: (url: string, body: any) =>
    apiClient(url, { method: "POST", body: JSON.stringify(body) }, redirectPath),
  put: (url: string, body: any) =>
    apiClient(url, { method: "PUT", body: JSON.stringify(body) }, redirectPath),
  delete: (url: string) =>
    apiClient(url, { method: "DELETE" }, redirectPath),
});

export const apiUser = makeClient("/userData/LoginUser");
export const apiAdmin = makeClient("/adminData/LoginAdmin");



/*You will call this by using below lines in .tsx files */

//await apiUser.post("/api/user/update-profile", { name: "Abo Bakar" });
//await apiAdmin.get("/api/admin/summary");



/*
**************************************
More Examples are given below
***************************************
*/

/*Example 1 — Fetch user profile */

/*
import { apiUser } from "@/utils/apiClients";

export async function fetchUserProfile() {
  const res = await apiUser.get("/api/user/profile");
  if (!res.ok) throw new Error("Failed to load profile");

  const data = await res.json();
  console.log("Profile Data:", data);
  return data;
}
*/



/*Example 2 — Update user profile */

/*
import { apiUser } from "@/utils/apiClients";

export async function updateUserProfile() {
  const res = await apiUser.put("/api/user/update-profile", {
    name: "Abo Bakar Aslam",
    phone: "0300-1234567",
  });

  const data = await res.json();
  console.log("Profile Updated:", data);
}

*/



/*Example 3 — Place a new order */

/*
import { apiUser } from "@/utils/apiClients";

export async function placeOrder() {
  const res = await apiUser.post("/api/order/create", {
    items: [
      { productId: "P-101", quantity: 2 },
      { productId: "P-205", quantity: 1 },
    ],
    paymentMethod: "cash",
  });

  const data = await res.json();
  console.log("Order Created:", data);
}
*/



/*Example 4 — Delete a user’s saved address */

/*
import { apiUser } from "@/utils/apiClients";

export async function deleteAddress(addressId: string) {
  const res = await apiUser.delete(`/api/address/${addressId}`);
  if (!res.ok) throw new Error("Failed to delete address");

  console.log("Address deleted successfully!");
}

*/



/*Admin Data: Example 1 — Fetch admin dashboard data */

/*
import { apiAdmin } from "@/utils/apiClients";

export async function fetchDashboard() {
  const res = await apiAdmin.get("/api/admin/dashboard");
  const data = await res.json();
  console.log("Dashboard Data:", data);
}


*/




/*Admin Data: Example 2 — Add a new product */

/*
import { apiAdmin } from "@/utils/apiClients";

export async function addProduct() {
  const res = await apiAdmin.post("/api/admin/products", {
    name: "Wireless Mouse",
    category: "Accessories",
    price: 1800,
    stock: 50,
  });

  const data = await res.json();
  console.log("Product Added:", data);
}
*/



/*Admin Data: Example 3 — Update an existing product */

/*
import { apiAdmin } from "@/utils/apiClients";

export async function updateProduct() {
  const res = await apiAdmin.put("/api/admin/products/P-101", {
    name: "Wireless Mouse (Updated)",
    price: 1600,
  });

  const data = await res.json();
  console.log("Product Updated:", data);
}

*/




/*Admin Data: Example 4 — Delete a product */

/*
import { apiAdmin } from "@/utils/apiClients";

export async function deleteProduct(productId: string) {
  const res = await apiAdmin.delete(`/api/admin/products/${productId}`);
  if (!res.ok) throw new Error("Product deletion failed");

  console.log("Product deleted successfully");
}


*/




/*Admin Data: Example 5 — Fetch all registered users (for admin) */

/*
import { apiAdmin } from "@/utils/apiClients";

export async function getAllUsers() {
  const res = await apiAdmin.get("/api/admin/users");
  const data = await res.json();
  console.log("All Users:", data);
}


*/



/*BONUS Example: Using in React Component 
You can easily integrate these calls into React hooks or useEffect().

Example for user profile page:
*/


/*
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiUser } from "@/utils/apiClients";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileUser() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiUser.get("/api/user/profile");
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        if (err.type === "network") toast.error("Cannot reach server.");
        else if (err.type === "api") toast.error(err.message);
        else if (err.type === "unauthorized") toast.info("Session expired.");
        else toast.error("Unknown error occurred.");
      }
    })();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
    </div>
  );
}
*/
// In app/layout.tsx
/*
// In app/layout.tsx or _app.tsx
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
*/
//Example: Admin Product Add Page
/*
"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiAdmin } from "@/utils/apiClients";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function handleAdd() {
    try {
      const res = await apiAdmin.post("/api/admin/products", { name, price });
      const data = await res.json();
      toast.success(`Product added: ${data.name}`);
    } catch (err: any) {
      if (err.type === "api") toast.error(err.message);
      else if (err.type === "network") toast.error("No internet connection.");
      else toast.error("Something went wrong.");
    }
  }

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <button onClick={handleAdd}>Add Product</button>
    </div>
  );
}
*/
