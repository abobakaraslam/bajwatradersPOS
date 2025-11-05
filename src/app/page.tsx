"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar/page";

export default function Home() {

  const router = useRouter();
    useEffect(() => {
      // Redirect when component is opened
      router.push("/userData/LoginUser");
      //router.push("/");
    }, [router]);

  return (
    <div className="border border-black">
      <Navbar />
      <h1 className="text-red-700 text-center">Point Of Sale</h1>
      <h1 className="text-center">NestJS Application</h1>
      <p className="text-center">
        M Abo Bakar Aslam
      </p>
      <p className="text-center text-sm">
        +92-313-5369068
      </p>

    </div>
  );
}
