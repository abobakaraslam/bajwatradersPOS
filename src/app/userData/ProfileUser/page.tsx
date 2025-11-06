/*File: page.tsx loacated in src/app/userData/ProfileUser/       */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BillRecord from "./component/BillRecord/page";
import SaleProduct from "./component/SaleProduct/page";


export default function ProfileAdmin(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<"dashboard" | "sale" | "bill">("dashboard");

  const router = useRouter();

useEffect(() => {
  //console.log("ProfileUser is loading...");
    async function validateSession() {
      const res = await fetch("/api/auth/validate-session");
      const data = await res.json();
      //console.log("ProfileUser Page, Responsded data from /api/auth/validate-session ", data)
      if (!data.valid) {
        console.log("Return to LoginUser page");
        console.log("Reason: ", data.reason);
        router.push("/userData/LoginUser");
      } else {
        console.log("successfully login");
        setLoading(false);
      }
    }
    validateSession();
  }, [router]);




  // Page Layout
  return (
    <div className="flex flex-col m-0 p-0 ">
      {/* Main Content */}
      <div id="mainContent" className="flex flex-col items-center justify-center p-6 flex-grow">
        {loading ? (
          // Loading View
          <div className="flex flex-col items-center mt-12 mb-12">
            <div className="w-10 h-10 rounded-full border-[4px] border-solid spinColor animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">
              Processing, please wait...
            </p>
          </div>
        ) : (
          // Authenticated Main Content
          <>
            {activeView === "dashboard" && (
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveView("sale")}
                  className="buttonCard group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                            flex flex-col items-center justify-center p-2"
                >
                  <img
                    src="/images/Saleitem500.png"
                    alt="Sale Product"
                    className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                    Sale Items
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveView("bill")}
                  className="buttonCard group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                            flex flex-col items-center justify-center p-2"
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
              </div>
            )}

            {activeView === "sale" && (
              <div className="w-full">
                <div className="text-center">
                  <button
                    onClick={() => setActiveView("dashboard")}
                    className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                               focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                               py-2.5 me-2"
                  >
                    Dashboard
                  </button>
                </div>
                <SaleProduct />
              </div>
            )}

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
          </>
        )}
      </div>
    </div>
  );
}
