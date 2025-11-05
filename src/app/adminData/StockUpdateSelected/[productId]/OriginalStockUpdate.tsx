"use client";
import {useEffect, useState} from 'react'
import { useParams } from "next/navigation";

function StockUpdatingPage() {
  const { productId } = useParams();
  //console.log("productId from Params: ", productId);

  const [nameProductState, setNameProductState] = useState("");
  const [priceSaleState, setPriceSaleState] = useState<number>(0);
  const [pricePurchaseState, setPricePurchaseState] = useState<number>(0);
  const [quantityState, setQuantityState] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/adminData/product_update/${productId}`);
          const data = await res.json();

          //console.log("data: ", data);

          const productName_get = data.productName;
          setNameProductState(productName_get);
          const pricePurchase_get = data.pricePurchase;
          setPricePurchaseState(pricePurchase_get);
          const priceSale_get = data.priceSale;
          setPriceSaleState(priceSale_get);
          const quantity_get = data.quantity;
          setQuantityState(quantity_get);

        } catch (err) {
          console.error("Failed to fetch Product:", err);
        }
      };
  
      if (productId) fetchProduct();
    }, [productId]);

  return (
    <div>
      Product Name: {nameProductState}
      Quantity: {quantityState}
      Price Sale: {priceSaleState}
      Price Purchase: {pricePurchaseState}

    </div>
  )
}

export default StockUpdatingPage
