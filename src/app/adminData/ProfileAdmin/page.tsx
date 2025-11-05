"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AddProductForm from "./components/AddProductForm/page";
import BillRecord from "./components/BillRecord/page";
import StockView from "./components/StockView/page";
import StockUpdate from "./components/StockUpdate/page";

export default function ProfileAdmin(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<
    "dashboard" | "sale" | "bill" | "stock" | "stockUpdate"
  >("dashboard");

  const router = useRouter();

useEffect(() => {
  //console.log("ProfileAdmin is loading...");
    async function validateSession() {
      const res = await fetch("/api/auth/validate-session");
      const data = await res.json();
      //console.log("ProfileAdmin Page, Responsded data from /api/auth/validate-session ", data)
      if (!data.valid) {
        //console.log("Return to LoginAdmin page");
        router.push("/adminData/LoginAdmin");
      } else {
        //console.log("Not Return to LoginAdmin page, but loading=false");
        setLoading(false);
      }
    }
    validateSession();
  }, [router]);


  return (
    <div className="flex flex-col m-0 p-0 ">
      
      {/* Main Content Section */}
      <div
        id="mainContent"
        className="flex flex-row items-center justify-center p-4 flex-grow"
      >
        {/*Show Loader if Loading */}
        {loading ? (
          <div className="flex flex-row items-center justify-center mt-12 mb-12">
            <div className="w-10 h-10 mr-4 rounded-full border-[4px] border-solid spinColor animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">
              Processing, please wait...
            </p>
          </div>
        ) : (
          <>
            {/* Dashboard Content */}
            {activeView === "dashboard" && (
              <>
                {/* Add Item */}
                <button
                  type="button"
                  onClick={() => setActiveView("sale")}
                  className="buttonCard group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2 m-2"
                >
                  <img
                    src="/images/addItem500.png"
                    alt="Add Item"
                    className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                    Add Item
                  </span>
                </button>

                {/* Bill Record */}
                <button
                  type="button"
                  onClick={() => setActiveView("bill")}
                  className="buttonCard group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2 m-2"
                >
                  <img
                    src="/images/BillGeneation500.png"
                    alt="Bill Record"
                    className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                    Bill Record
                  </span>
                </button>

                {/* Stock View */}
                <button
                  type="button"
                  onClick={() => setActiveView("stock")}
                  className="buttonCard group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2 m-2"
                >
                  <img
                    src="/images/stock500.png"
                    alt="Stock View"
                    className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                    Stock View
                  </span>
                </button>

                {/* Stock update */}
                <button
                  type="button"
                  onClick={() => setActiveView("stockUpdate")}
                  className="buttonCard group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2 m-2"
                >
                  <img
                    src="/images/stockUpdate2.png"
                    alt="Stock Update"
                    className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                    Stock Update
                  </span>
                </button>
              </>
            )}

            {/* Sale Form */}
            {activeView === "sale" && (
              <div className="w-full flex flex-col items-center justify-center">
                <div className="text-center">
                  <button
                    onClick={() => setActiveView("dashboard")}
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                          focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                          py-2.5 me-2 mb-2"
                  >
                    Dashboard
                  </button>
                </div>
                <div className="flex items-center justify-center w-full">
                  <AddProductForm />
                </div>
              </div>
            )}

            {/* Bill Record */}
            {activeView === "bill" && (
              <div className="w-full">
                <div className="text-center mt-4">
                  <button
                    onClick={() => setActiveView("dashboard")}
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                           focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                           py-2.5 me-2 mb-2"
                  >
                    Dashboard
                  </button>
                </div>
                <BillRecord />
              </div>
            )}

            {/* Stock View */}
            {activeView === "stock" && (
              <div className="w-full">
                <div className="text-center mt-4">
                  <button
                    onClick={() => setActiveView("dashboard")}
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                           focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                           py-2.5 me-2 mb-2"
                  >
                    Dashboard
                  </button>
                </div>
                <StockView />
              </div>
            )}

            {/* Stock Update */}
            {activeView === "stockUpdate" && (
              <div className="w-full">
                <div className="text-center mt-4">
                  <button
                    onClick={() => setActiveView("dashboard")}
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                           focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                           py-2.5 me-2 mb-2"
                  >
                    Dashboard
                  </button>
                </div>
                <StockUpdate />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
