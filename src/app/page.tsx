"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "./Navbar/page";

export default function Home() {
  const router = useRouter();

  const handleSalesmanClick = () => router.push("/userData/LoginUser");
  const handleManagerClick = () => router.push("/adminData/LoginAdmin");

  return (
    <div className="lg:h-screen flex flex-col">
      <Navbar />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-hidden">
        <h1 className="text-3xl font-bold mb-2">Bajwa Traders</h1>

        {/* Header Section */}
        <div className="flex items-center justify-center mb-8 space-x-2">
          <Image
            src="/logoPOS.svg"
            alt="POS Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0F6466] tracking-wide">
            Point of Sale
          </h2>
        </div>

        {/* Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Salesman */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleSalesmanClick}
              className="group bg-[#E8F3F0] border rounded-2xl shadow-lg w-60 h-60 
                flex items-center justify-center transition-all duration-300 hover:-translate-y-2 
                hover:shadow-2xl"
            >
              <img
                src="/images/salesaccount.png"
                alt="Salesman Account"
                className="w-48 h-48 transition-transform duration-300 group-hover:scale-110"
              />
            </button>
            <span className="mt-3 text-lg font-semibold text-gray-700 group-hover:text-blue-600">
              Salesman Account
            </span>
          </div>

          {/* Manager */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleManagerClick}
              className="group bg-[#E8F3F0] border rounded-2xl shadow-lg w-60 h-60 
                flex items-center justify-center transition-all duration-300 hover:-translate-y-2 
                hover:shadow-2xl"
            >
              <img
                src="/images/manageraccount.png"
                alt="Manager Account"
                className="w-48 h-48 transition-transform duration-300 group-hover:scale-110"
              />
            </button>
            <span className="mt-3 text-lg font-semibold text-gray-700 group-hover:text-green-600">
              Manager Account
            </span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="text-xs text-gray-500">
            Software developed by{" "}
            <span className="font-semibold text-gray-700">M. Abo Bakar Aslam</span>
          </p>
          <p className="text-xs text-gray-500">+92-313-5369068</p>
        </footer>
      </div>
    </div>
  );
}
