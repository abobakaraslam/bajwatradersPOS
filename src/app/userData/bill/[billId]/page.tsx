"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Define Model Type
interface BillItem {
  productId: string;
  productName: string;
  quantitySold: number;
  priceSalePerUnit: number;
  priceSaleAmount: number;
  customerId: string;
  billId: string;
  iDate: Date; // stored as ISO string in DB
}

/**
 * Formats ISO date string (UTC or with +05:00 offset)
 * into readable local Pakistan time.
 */
const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function splitDateTimePak(date_pak: string): { formattedDate: string; formattedTime: string } {
  // Example input: "08-11-2025 11:32:35"

  // Split date and time
  const [datePart, timePart] = date_pak.split(" ");

  if (!datePart || !timePart) {
    throw new Error("Invalid date format. Expected 'DD-MM-YYYY HH:mm:ss'");
  }

  // Split and parse date components
  const [day, month, year] = datePart.split("-").map((v) => parseInt(v, 10));

  // Convert to Date object
  // Note: month index in JS Date is 0-based → subtract 1
  const jsDate = new Date(year, month - 1, day);

  // Arrays for month and weekday names
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get day of week and month name
  const weekday = dayNames[jsDate.getDay()];
  const monthName = monthNames[month - 1];

  // Format date as "Sat, 08-Nov-2025"
  const formattedDate = `${weekday}, ${String(day).padStart(2, "0")}-${monthName}-${year}`;

  return {
    formattedDate,
    formattedTime: timePart, // "11:32:35"
  };
}



export default function BillPage() {
  const router = useRouter();
  const { billId } = useParams();
  const [priceTotal, setPriceTotal] = useState<number>(0);
  const [billState, setBill] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateBillState, setDateBillState] = useState("");
  const [timeBillState, settimeBillState] = useState("");
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);

  function formatToPakistanTime(date: Date): string {
  return date.toLocaleString("en-PK", { timeZone: "Asia/Karachi" });
}

function getPakistanDateTime(): Date {
  // Current UTC timestamp
  const now = new Date();

  // Convert UTC to Pakistan time (UTC+5)
  const pakistanTime = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  //console.log("returning pakistanTime: ", pakistanTime)
  const pakistanTime_formated = pakistanTime.toISOString()

  //console.log("Pakistan Time (Local) pakistanTime_formated:", pakistanTime_formated);
  return pakistanTime;
}

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/userData/printBill/${billId}`);
        if (!res.ok) throw new Error("Failed to fetch bill data");
        const data: BillItem[] = await res.json();

        let total = 0;
        const processedBills = data.map((item) => {
          total += item.priceSaleAmount;
          return item;
        });

        /*
         let date_from_DB = new Date(data[0].iDate);
        console.log("Date from database: date_from_DB", date_from_DB);
        // Subtract 5 hours (in milliseconds)
        const current_date = new Date(date_from_DB.getTime() - 5 * 60 * 60 * 1000);
        console.log("After subtracting 5 hours:", current_date);

        console.log("Date: back display");
        console.log("Displayed Pakistan time:", formatToPakistanTime(data[0].iDate));
*/
        // Take first item's date (all items share same bill timestamp)
        //if (data.length > 0) setDateBillState(data[0].iDate);
        let date_pak = formatToPakistanTime(data[0].iDate);
        const { formattedDate, formattedTime } = splitDateTimePak(date_pak);
        
        if (data.length > 0) {
          setDateBillState(formattedDate);
          settimeBillState(formattedTime);
        }

        setBill(processedBills);
        setPriceTotal(total);
      } catch (err) {
        console.error("Error fetching bill:", err);
      } finally {
        setLoading(false);
      }
    };

    if (billId) fetchBill();
  }, [billId]);

  const handlePrintTwice = async () => {
    window.print();
    await new Promise((r) => setTimeout(r, 1000));
    window.print();
  };

  const GotoDashboard = () => {
    setLoadingDashboard(true);
    setButtonDisable(true);
    router.push("/userData/ProfileUser/");
  };

  return (
    <div>
      {/* Dashboard Navigation */}
      <div className="text-center mt-8 no-print">
        <button
          className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                     focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
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
        <div id="mainContent" className="flex flex-col items-center justify-center m-6">
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

          {/* ─── Print Styles ─────────────────────────────────────────────── */}
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
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
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
                font-weight: 700 !important;
              }
              h1 {
                font-size: 16px;
                font-weight: bold;
              }
              p {
                font-size: 11px;
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

          <h1 className="receipt-title text-xl font-semibold mb-4 text-center">
            Bajwa Traders
          </h1>

          <div>
            <p className="text-left">
              <span className="font-bold">Bill ID: </span>
              {billId}
            </p>
            <p className="text-left">
              <span className="font-bold">Date: </span>
              {dateBillState}
            </p>
            <p className="text-left mb-5">
              <span className="font-bold">Time: </span>
              {timeBillState}
            </p>
            <p>
              <span className="font-bold">Price Unit: </span>Pakistani Rupees (Rs.)
            </p>
            <p>
              <span className="font-bold">U/P: </span>Price for 1 item
            </p>
            <p>
              <span className="font-bold">Qty: </span>Quantity
            </p>
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
            <p className="text-right font-bold">Total: Rs.{priceTotal}</p>
          </div>

          <p className="footer-text text-center">
            Software developed by Abo Bakar <br /> +92-313-5369068
          </p>

          <div className="text-center mt-6 no-print">
            <button onClick={handlePrintTwice} className="px-4 py-2 formUserButton">
              🖨️ Print Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
