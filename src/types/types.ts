import { filterSchema } from "@/lib/parser";
import { ColumnSort } from "@tanstack/react-table";
import { AriaAttributes, DOMAttributes } from "react";
import { z } from "zod";

export type StringKeyOf<TData> = Extract<keyof TData, string>;
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>;
  label: string;
  placeholder?: string;
  options?: Option[];
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>;
  }
>;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export type PageResult<T> = {
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: T[];
};

export interface ClassNameType<T> extends AriaAttributes, DOMAttributes<T> {
  className?: string;
}

export type ApiResponse<T = undefined> = {
  value?: T;
  isSuccess: boolean;
  error: {
    code: string;
    message: string;
  };
};

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthday: Date;
  avatar: string;
  point: number;
  // balance: number | null;

  wallet: {
    walletId: string;
    balance: number;
  } | null;
  role: string;
  isActive: boolean;
  isVerification: boolean;
}

export interface Favorite {
  productId: string;
  name: string;
  imageUrl: string;
}
