"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { FormValues } from "@/components/global-components/form/form-values";
import { CardProduct } from "@/components/global-components/card/card-product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductTransformType, useData } from "@/providers/data-provider";
import { ProductKey } from "@/app/key/product-key";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import AnimatedLoadingSkeleton from "@/components/global-components/custom-skeleton/animated-loading-skeleton";

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const;

export interface ProductVariantSummaryResponse {
  productVariantId: string;
  sku: string;
  netWeight: number;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  origin: string;
  mainImageUrl: string;
  productVariantSummaryResponse: ProductVariantSummaryResponse;
}


const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function SidebarFilter() {
  const { data: products } = useFetch<ApiResponse<PageResult<Product>>>("/Products", ["products", "guest"])
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(JSON.stringify(data, null, 2));
  }

  const { productList } = useData();

  console.log({ productList });

  const watchAllValues = form.watch();
  console.log({ watchAllValues });

  const {
    isLoading,
    data: products,
    error,
    isError,
  } = useFetch<ProductTransformType>("/Products", [ProductKey.PRODUCTS]);

  return (
    <div className="flex p-4 rounded-xl shadow-xl hover:shadow-2xl duration-300 transition">
      {/* Sidebar */}
      <div className="w-64 pr-8 sticky top-4 h-full overflow-y-auto">
        <FormValues
          form={form}
          onSubmit={onSubmit}
          classNameForm="space-y-8 relative"
        >
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Sidebar</FormLabel>
                  <FormDescription>
                    Select the items you want to display in the sidebar.
                  </FormDescription>
                </div>
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </FormValues>
      </div>

      {/* Main Content */}

      {!isLoading ? (
        <div className="flex-1 h-full overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-0 lg:gap-4 2xl:gap-6">
          {products?.value?.items?.map((product) => (
            <CardProduct key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <AnimatedLoadingSkeleton className="w-full max-w-full" />
      )}
    </div>
  );
}
