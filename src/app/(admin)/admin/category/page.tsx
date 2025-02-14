"use client";
import { getCategories } from "@/actions/category";
import { CreateCategoryDialog } from "@/components/custom/_custom-dialog/create-category-dialog";

import { Category, columns } from "@/features/admin/category/column";
import { DataTable } from "@/features/admin/category/data-table";
import { PageResult } from "@/types/types";
import React, { useEffect, useState } from "react";



const CategoryPage = () => {
  const [data, setData] = useState<PageResult<Category>>();
  useEffect(() => {
    getCategories().then((response: PageResult<Category>) => {
      setData(response);
      console.log(response);
    });
  }, []);

  console.log({ data });

  return (
    <div className="mx-4 lg:mx-20">
      <div className="flex justify-end">
        <CreateCategoryDialog />
      </div>
      <div className="py-4">
        <DataTable data={data?.items || []} columns={columns} />
      </div>
    </div>
  );
};

export default CategoryPage;
