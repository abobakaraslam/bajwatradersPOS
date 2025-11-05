"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";
import HeaderPOSAdmin from "../../HeaderPOSAdmin/page";

interface Product {
  productId: string;
  productName: string;
  priceSale: number;
  availableQuantity: number;
}

//
const sanitizeInput = (input: any): string => {
  const inputFilteredTrim = input.trim();
  const inputFiltered = inputFilteredTrim
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\\/g, "");
  return inputFiltered;
};

function numberValidator(data: any): number {
  // Default result
  let resultTest = 0;

  // Check if input is actually a number type or a numeric string
  if (typeof data === "number" && !isNaN(data)) {
    return 1; // Pure number (like 123, 45.6)
  }

  if (typeof data === "string") {
    // Remove surrounding spaces
    const trimmed = data.trim();

    // Regex: matches integers or decimals, optionally negative
    const numberPattern = /^-?\d+(\.\d+)?$/;

    if (numberPattern.test(trimmed)) {
      resultTest = 1; // Valid numeric string (e.g. "123", "-45.67")
    }
  }

  return resultTest; // 0 for invalid, 1 for valid number
}

export default function StockUpdatingPage(): JSX.Element {
  const { productId } = useParams();
  //console.log("productId from Params: ", productId);

   const router = useRouter();

  //states for input fields
  const [nameProductState, setNameProductState] = useState("");
  const [productIdState, setproductIdState] = useState(productId);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [priceSaleState, setPriceSaleState] = useState<number>(0);
  const [pricePurchaseState, setPricePurchaseState] = useState<number>(0);
  const [quantityState, setQuantityState] = useState<number>(0);

  //states for error
  const [generalError, setGeneralError] = useState("");
  const [errorPriceSaleState, setErrorPriceSaleState] = useState("");
  const [errorPricePurchaseState, setErrorPricePurchaseState] = useState("");
  const [errorQuantityProduct, setErrorQuantityProduct] = useState("");

  const [message, setMessage] = useState<string | null>(null);

  const [loadingItems, setLoadingItems] = useState(false); // Spinner Items state
  const [loading, setLoading] = useState(false); // Spinner state
  const [buttonDisable, setbuttonDisable] = useState(false);

  let productName_get = "";
  let pricePurchase_get = 0;
  let priceSale_get = 0;
  let quantity_get = 0;

  const handleLogout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("userType");
    router.push("/adminData/LoginAdmin");

    try {
      const response = await fetch("../../api/auth/logout", { method: "GET" });
      const data = await response.json();
      if (!data.success) console.error("Error logging out:", data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
  
  const fetchProduct = async () => {
    try {
      setLoadingItems(true); // start spinner
      const res = await fetch(`/api/adminData/product_update/${productId}`);
      const data = await res.json();

      if (!data || !data.productName) {
        console.error("Invalid product data:", data);
        return;
      }

      // Update states with fetched data
      setNameProductState(data.productName);
      setPricePurchaseState(data.pricePurchase);
      setPriceSaleState(data.priceSale);
      setQuantityState(data.quantity);
    } catch (err) {
      console.error("Failed to fetch Product:", err);
    } finally {
      // Stop spinner only after states are set
      setLoadingItems(false);
    }
  };

  if (productId) fetchProduct();
}, [productId]);





  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    setbuttonDisable(true);

    // Clear previous errors
    setGeneralError("");

    let allValid = true;


    // Validating price-Sale
    const priceSale = sanitizeInput(String(priceSaleState)); // Removing fake/virus input
    if (priceSale === "" || Number(priceSale) < 1) {
      setGeneralError(
        "Please enter all required information in correct format"
      );
      setErrorPriceSaleState("Please enter a Price here");
      allValid = false;
    } else {
      setErrorPriceSaleState("");
      const valid_priceSale = numberValidator(priceSale);
      if (valid_priceSale === 0) {
        setGeneralError(
          "Please enter all required information in correct format"
        );
        setErrorPriceSaleState("Please enter a valid Price here");
        allValid = false;
      }else{
        setErrorPriceSaleState("");
      }
    }


    // Validating price-Purchase
    const pricePurchase = sanitizeInput(String(pricePurchaseState)); // Removing fake/virus input
    if (pricePurchase === "" || Number(pricePurchase) < 1) {
      setGeneralError(
        "Please enter all required information in correct format"
      );
      setErrorPricePurchaseState("Please enter a Price here");
      allValid = false;
    } else {
      setErrorPricePurchaseState("");
      const valid_pricePurchase = numberValidator(pricePurchase);
      if (valid_pricePurchase === 0) {
        setGeneralError(
          "Please enter all required information in correct format"
        );
        setErrorPricePurchaseState("Please enter a valid Price here");
        allValid = false;
      }else{
        setErrorPricePurchaseState("");
      }
    }


    // Validating Quantity
    const quantityProduct = sanitizeInput(String(quantityState)); // Removing fake/virus input
    if (quantityProduct === "" || Number(quantityProduct) < 1) {
      setGeneralError(
        "Please enter all required information in correct format"
      );
      setErrorQuantityProduct("Please enter a Quantity here");
      allValid = false;
    } else {
      setErrorQuantityProduct("");
      const valid_quantityProduct = numberValidator(quantityProduct);
      if (valid_quantityProduct === 0) {
        setGeneralError(
          "Please enter all required information in correct format"
        );
        setErrorQuantityProduct("Please enter a valid Price here");
        allValid = false;
      }else{
        setErrorQuantityProduct("");
      }
    }


    if (!allValid) {
      setLoading(false);
    setbuttonDisable(false);
      return
    };

    
    const showToast = (msg: string) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 5000); // auto-hide after 5s
    };


    // If all validations pass, proceed with registration
    if (allValid) {
      // Send registration request
      try {
        ////console.log("nameProduct: ", nameProduct);
        //console.log("priceSale: ", priceSale);
        //console.log("pricePurchase: ", pricePurchase);
        //console.log("quantityProduct: ", quantityProduct);


        const response = await fetch("../../api/adminData/product_update_route", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedProductId: productId,
            selectedProductName: productName_get,
            priceSale: priceSale,
            pricePurchase: pricePurchase,
            quantityProduct: quantityProduct
          }),
        });

        if (!response.ok) {
          
          const errorData = await response.json();
          setGeneralError(errorData.message || "Product Updation is failed.");

          setLoading(false);
          setbuttonDisable(false);

          return;
        }

        const result = await response.json();

        /*
        setPricePurchaseState(pricePurchase);
        setPriceSaleState(0);
        setProductState([]);
        setQuantityState(0);
        setSelectedProductState(null);
        setErrorNameProductState("");
        setGeneralError("");
        */

        //alert("Product is Added successful!");
        // Handle success (e.g., redirect or clear form)

        setLoading(false);

        showToast("Product updated successfully!");


        window.location.replace("/adminData/ProfileAdmin"); //reload the browser and clear the previous history entry


      } catch (error) {
        console.log("error");
        
        setGeneralError(
          "An error occurred during insertion of product. Please try again."
        );
        setLoading(false);
          setbuttonDisable(false);
        
      }
    }


    
  };

const GotoDashboard = () => router.push("/adminData/ProfileAdmin/");

  return (
    <div>
      <div className="text-center mt-8">
          <button
            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
            onClick={GotoDashboard}
          >
            Dashboard
          </button>
        </div>

    <div className=" flex items-center justify-center w-full">
    <div className="formDiv w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md mt-4">
      {generalError && (
        <p className="text-red-500 text-xs text-center">{generalError}</p>
      )}

      <h1 className="text-xl font-bold mb-4 text-center">Update Item</h1>

{loadingItems ? (
  <>
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#0F6466] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium text-lg">
        Loading item details, please wait...
      </p>
    </div>
  </>
) : (
  <div id="update_form">
    <form onSubmit={handleSubmit}>
      <p className="text-gray-800">
        <span className="font-semibold">Product ID:</span> {productIdState}
      </p>
      <p className="text-gray-800">
        <span className="font-semibold">Product Name:</span> {nameProductState}
      </p>

      {/* Price Details */}
      <p className="mt-10 mb-7 font-semibold text-gray-800">Price Detail</p>

      <p className="text-gray-800 text-sm">Sale Price</p>
      {errorPriceSaleState && (
        <p className="text-red-600 text-sm">{errorPriceSaleState}</p>
      )}
      <input
        type="number"
        placeholder="Sale Price per Item"
        className="w-full p-2 mb-2 border rounded"
        value={priceSaleState}
        onChange={(e) => setPriceSaleState(Number(e.target.value))}
      />

      <p className="text-gray-800 text-sm">Purchase Price</p>
      {errorPricePurchaseState && (
        <p className="text-red-600 text-sm">{errorPricePurchaseState}</p>
      )}
      <input
        type="number"
        placeholder="Purchase Price per Item"
        className="w-full p-2 mb-2 border rounded"
        value={pricePurchaseState}
        onChange={(e) => setPricePurchaseState(Number(e.target.value))}
      />

      {/* Stock Details */}
      <p className="mt-10 mb-7 font-semibold text-gray-800">Stock Detail</p>

      <p className="text-gray-800 text-sm">Quantity</p>
      {errorQuantityProduct && (
        <p className="text-red-600 text-sm">{errorQuantityProduct}</p>
      )}
      <input
        type="number"
        placeholder="Quantity"
        className="w-full p-2 mb-4 border rounded"
        value={quantityState}
        onChange={(e) => setQuantityState(Number(e.target.value))}
      />

      {/* Update Button */}
      <button
        type="submit"
        className="formButton flex items-center justify-center gap-2 disabled:opacity-70"
        disabled={buttonDisable}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Updating Item...</span>
          </>
        ) : (
          "Update Item"
        )}
      </button>
    </form>
  </div>
)}


      {message && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 
                bg-green-600 text-white px-4 py-2 rounded shadow-lg 
                transition-all z-50">
          {message}
        </div>
      )}

    </div>
    </div>

    <p className="text-center text-sm text-gray-500 mt-8 mb-8">
        Software Developed by Abo Bakar<br />+92-313-5369068
      </p>
    </div>
  );
}
