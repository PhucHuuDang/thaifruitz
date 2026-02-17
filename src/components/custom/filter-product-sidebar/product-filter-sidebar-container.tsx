"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ProductGridSkeleton } from "@/components/global-components/custom-skeleton/side-bar-skeleton";
import { EmptyState } from "@/components/global-components/empty-state";
import { Product } from "@/hooks/use-cart-store";
import { ApiResponse, PageResult } from "@/types/types";
import { StickyNote } from "lucide-react";
import { ProductFilterSidebar } from "./product-filter-sidebar";
import { COMBO_KEY } from "@/app/key/comm-key";
import { ComboProduct } from "@/components/global-components/card/card-combo";

export const ProductFilterSidebarContainer = () => {
  const {
    data: products,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<PageResult<Product>>>("/Products", ["products"]);
  const {
    data: combos,
    isLoading: isComboLoading,
    refetch: comboRefetch,
  } = useFetch<ApiResponse<PageResult<ComboProduct>>>("/Combos", [
    COMBO_KEY.COMBOS,
  ]);

  if (isLoading || isComboLoading) {
    return <ProductGridSkeleton />;
  }

  if (products?.value?.items.length === 0) {
    return (
      <EmptyState
        icons={[StickyNote]}
        title="Chưa có sản phẩm"
        description="Có vẻ như chưa có sản phẩm nào hãy tải lại trang"
        className="min-w-full flex flex-col"
        action={{
          label: "Tải lại",
          onClick: () => refetch(),
        }}
      />
    );
  }

  const safeProducts: Product[] = products?.value?.items ?? [];
  const safeCombos: ComboProduct[] = combos?.value?.items ?? [];

  return (
    <section
      aria-label="Lọc và duyệt sản phẩm"
      className="px-2 sm:px-4 py-4 sm:py-6"
    >
      <ProductFilterSidebar
        products={safeProducts}
        combos={safeCombos}
        comboRefetch={comboRefetch}
      />
    </section>
  );
};
