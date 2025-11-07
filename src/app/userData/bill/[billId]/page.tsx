/*File: page.tsx located in app/userData/bill/[billId] */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HeaderPOSUser from "../../HeaderPOSUser/page";

// Define Model Type
interface BillItem {
  productId: string;
  productName: string;
  quantitySold: number;
  priceSalePerUnit: number;
  priceSaleAmount: number;
  customerId: string;
  billId: string;
  createdAt: string;
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString("en-PK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BillPage() {
  const router = useRouter();
  const { billId } = useParams();
  const [priceTotal, setPriceTotal] = useState<number>(0);
  const [billState, setBill] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateBillState, setDateBillState] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [loadingDashboard, setloadingDashboard] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);

  useEffect(() => {

    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/userData/printBill/${billId}`);
        const data = await res.json();

        let priceTotal = 0;
        const filteredData: any[] = [];

        data.forEach((item: any) => {
          priceTotal += item.priceSaleAmount;
          setDateBillState(formatDate(item.createdAt));

          filteredData.push({
            productId: item.productId,
            productName: item.productName,
            quantitySold: item.quantitySold,
            priceSalePerUnit: item.priceSalePerUnit,
            priceSaleAmount: item.priceSaleAmount,
            customerId: item.customerId,
            billId: item.billId,
            createdAt: item.createdAt,
          });
        });

        setBill(filteredData);
        setPriceTotal(priceTotal);
      } catch (err) {
        console.error("Failed to fetch bill:", err);
      } finally {
        setLoading(false);
      }
    };

    if (billId) fetchBill();
  }, [billId]);


  const handlePrintTwice = async () => {
    window.print();
    await new Promise((r) => setTimeout(r, 2));
    window.print();
  };


  const GotoDashboard = ()=>{
    setloadingDashboard(true);
    setButtonDisable(true);
    router.push("/userData/ProfileUser/");
  } 

  return (
    <div className="">
      {/* 
      <div className="no-print">
        <div className="flex justify-between p-4">
          <div className="flex p-0 m-0">
          <img className="m-0 mr-3" src="/logoPOS.svg" width="25px" height="25px" alt="" />
          <p className="font-medium text-lg pt-1">Point Of Sale</p>
        </div>
        <div className="p-0">
          <button
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 
                        focus:ring-[#0F6466] font-medium rounded-lg text-sm px-5 
                        py-2.5 dark:bg-red-600 dark:hover:bg-red-700 
                        focus:outline-none dark:focus:ring-red-800"
            onClick={handleLogout}
          >
            Logout
          </button>
          </div>
        </div>

        <div>
          <h1 className="text-center p-0">Bajwa Traders</h1>
        </div>
        */}

        {/* Hidden during print */}
        <div className="text-center mt-8 no-print">
          <button
            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
            onClick={GotoDashboard}
            disabled={buttonDisable}
          >
            {loadingDashboard ? (
                <div className="flex">
                  <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Shifting to Dashboard...</span>
                </div>
              ) : (
                "Dashboard"
              )}
            </button>
        </div>
      

      {/* Main Content */}
      {loading ? (
        <div
          id="mainContent"
          className="flex flex-col items-center justify-center m-6"
        >
          <div className="w-12 h-12 border-4 border-[#0F6466] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium text-lg animate-pulse">
            Loading bill...
          </p>
        </div>
      ) : (
        <div
          id="mainContent"
          className="receipt-container max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow px-2 pb-2"
        >
          {/* Print Styles */}
          <style jsx global>{`
            @media print {
              .no-print {
                display: none !important;
              }
              @page {
                size: 70mm auto;
                margin: 0 !important;
                padding: 0 !important;

              }
              body {
                margin: 0 !important;
                padding: 0 !important;
                width: 70mm !important;
                background: #fff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-family: "Arial", sans-serif;
                font-size: 13px;
                color: #000;
                box-sizing: border-box !important;
                text-align: left !important;
              }
              .receipt-container {
                  width: 70mm !important;
                  margin: 0 !important;
                  padding: 8px !important;
                  font-family: "Courier New", monospace !important;
                  color: #000 !important;
                  box-sizing: border-box !important;
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  right: 0 !important;
              }
              * {
                color: #000 !important;
                font-weight: 600 !important;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 8px;
              }
              th,
              td {
                padding: 2px 0;
                font-size: 12px;
                border: 1px solid #000;
              }
              th {
                color: #000 !important;
                font-weight: 700 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              h1 {
                font-size: 16px;
                font-weight: bold;
                color: #000;
              }
              p {
                font-size: 11px;
                color: #000;
              }
              .receipt-title {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
              }
              .receipt-total {
                text-align: right;
                margin-top: 6px;
                font-size: 14px;
                font-weight: bold;
              }
              .footer-text {
                text-align: center;
                font-size: 10px;
                margin-top: 10px;
                border-top: 1px dashed #000;
                padding-top: 5px;
              }
            }
          `}</style>

          <h1 className="receipt-title text-2xl font-semibold mb-4 text-center">
            Bajwa Traders
          </h1>

          <div>
            <p className="text-left">
              <span className="font-bold">Bill ID: </span>
              {billId}
            </p>
            <p className="text-left mb-5">
              <span className="font-bold">Date: </span>
              {dateBillState}
            </p>
            <p><span className="font-bold">Price Unit: </span>Pakistani Rupees (Rs.)</p>
            <p><span className="font-bold">U/P: </span>Price for 1 item</p>
            <p><span className="font-bold">Qty: </span>Quantity</p>
          </div>

          <table className="receipt-table w-full mt-4 border border-black">
            <thead>
              <tr>
                <th className="p-2 border border-black text-left">Item</th>
                <th className="p-2 border border-black">Qty</th>
                <th className="p-2 border border-black">U/P</th>
                <th className="p-2 border border-black">Total</th>
              </tr>
            </thead>
            <tbody>
              {billState.map((item, index) => (
                <tr key={index} className="border-t border-black">
                  <td className="p-2 border border-black">{item.productName}</td>
                  <td className="p-2 border border-black text-center">
                    {item.quantitySold}
                  </td>
                  <td className="p-2 border border-black text-center">
                    {item.priceSalePerUnit}
                  </td>
                  <td className="p-2 border border-black text-center">
                    {item.priceSaleAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-total">
            <p className="text-right">
              <span style={{ fontWeight: "bold" }}>Total: </span>Rs.{priceTotal}
            </p>
          </div>

          <p className="footer-text text-center">
            Software developed by Abo Bakar <br /> +92-313-5369068
          </p>

          <div className="text-center mt-6 no-print">
            <button
              onClick={handlePrintTwice}
              className=" px-4 py-2 formUserButton"
            >
              🖨️ Print Bill
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}
