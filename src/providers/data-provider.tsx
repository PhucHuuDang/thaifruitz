"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ProductKey } from "@/app/key/product-key";
import { PageResult } from "@/types/types";
import { createContext, useContext } from "react";

import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { CART_KEY } from "@/app/key/comm-key";

export type DataContextType = {
  productList: ProductTransformType | undefined;
};

export interface ProductTypes {
  id: string;
  name: string;
  description: string;
  origin: string;
  mainImageUrl: string;

  productVariantSummaryResponse: {
    productVariantId: string;
    sku: string;
    netWeight: number;
    price: number;
    discountPrice: number | null;
    stockQuantity: number;
  };
}

export type ProductTransformType = Omit<PageResult<ProductTypes>, "items"> & {
  value: { items: ProductTypes[] };
};

export const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within an DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // const { token } = useAuth();

  const cookieToken = Cookies.get("accessToken");

  const {
    isLoading,
    data: productList,
    error,
    isError,
  } = useFetch<ProductTransformType>("/Products", [ProductKey.PRODUCTS]);

  const {
    isLoading: isLoadingCart,
    data: carts,
    error: errorCart,
    isError: isErrorCart,
  } = useFetch<ProductTransformType>("/Carts", [CART_KEY.CARTS]);

  // console.log({ productList });
  // console.log({ carts });
  // if (isLoading) {
  //   return null;
  // }

  return (
    <DataContext.Provider value={{ productList }}>
      {children}
    </DataContext.Provider>
  );
};
