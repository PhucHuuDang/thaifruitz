"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, CirclePlus, Package } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import Image from "next/image"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import type { ApiResponse, Profile } from "@/types/types"
import Link from "next/link"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMemo, useState } from "react"
import CardSkeleton from "@/components/global-components/custom-skeleton/card-skeleton"
import { getRemainingDays } from "@/features/admin/admin-lib/admin-lib"
import { PRODUCT_BATCH_KEY } from "@/app/key/comm-key"
import { useQueryClient } from "@tanstack/react-query"
import { USER_KEY } from "@/app/key/user-key"

interface ProductBatchItem {
    number: number
    productId: string
    productName: string
    productVariantId: string
    productVariantImage: string
    packagingType: string
    quantity: number
    netWeight: number
    importQuantity: number,
    exportQuantity: number,
    remainingQuantity: number,
    preservationMethod: string
    productionDate: string
    expirationDate: string
}

const dateRangeOptions = {
    all: { label: "Tất cả", days: Infinity },
    threeMonths: { label: "3 tháng", days: 90, from: 30 },
    oneMonth: { label: "1 tháng", days: 30, from: 15 },
    fifteenDays: { label: "15 ngày", days: 15, from: 7 },
    sevenDays: { label: "7 ngày", days: 7, from: 1 },
    outDate: { label: "Hết hạn", days: 0, from: 0 },
};


const ListInventory = () => {
    const { data: products, isLoading } = useFetch<ApiResponse<ProductBatchItem[]>>("/ProductBatches/items", [PRODUCT_BATCH_KEY.PRODUCT_BATCHES_INVENTORY_MANAGE])
    const [selectedOption, setSelectedOption] = useState<keyof typeof dateRangeOptions>("all");
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<ApiResponse<Profile>>([USER_KEY.PROFILE])
    const handleOptionSelect = (option: keyof typeof dateRangeOptions) => {
        setSelectedOption(option);
    };

    const filteredData = useMemo(() => {
        if (!products?.value) return [];

        const items = (() => {
            if (selectedOption === "all") return products.value;

            if (selectedOption === "outDate") {
                return products.value.filter(item => getRemainingDays(item.expirationDate) <= 0);
            }

            const { from = 0, days = Infinity } = dateRangeOptions[selectedOption];
            return products.value.filter(item => {
                const remaining = getRemainingDays(item.expirationDate);
                return remaining > 0 && remaining >= from && remaining <= days;
            });
        })();

        return items.sort((a, b) => {
            const remainingA = getRemainingDays(a.expirationDate);
            const remainingB = getRemainingDays(b.expirationDate);

            if (remainingA <= 0 && remainingB <= 0) return 0;
            if (remainingA <= 0) return 1;
            if (remainingB <= 0) return -1;

            return remainingA - remainingB;
        });
    }, [products, selectedOption]);

    const columns: ColumnDef<ProductBatchItem>[] = [
        {
            accessorKey: "productVariantImage",
            header: "Hình ảnh",
            cell: ({ row }) => {
                const productBatchItem = row.original
                return (
                    <Link href={
                        user?.value?.role === 'Administrator'
                            ? `/admin/product/${productBatchItem.productId}`
                            : `/manager/product/${productBatchItem.productId}`} className="flex justify-center">
                        <Image
                            height={600}
                            width={600}
                            src={productBatchItem.productVariantImage || "/placeholder.svg"}
                            alt={productBatchItem.productName}
                            className="h-40 w-40 rounded-md object-cover"
                        />
                    </Link>
                )
            },
        },
        {
            accessorKey: "productName",
            header: "Tên sản phẩm",
            cell: ({ row }) => (
                <div>
                    {row.original.productName} - {row.original.packagingType} - {row.original.netWeight}g
                </div>
            ),
        },
        {
            accessorKey: "number",
            header: "Lô hàng",
            cell: ({ row }) => <div className="text-center">{row.getValue("number")}</div>,
        },
        {
            accessorKey: "remainingQuantity",
            header: "Số lượng",
        },
        {
            accessorKey: "preservationMethod",
            header: "Phương pháp bảo quản",
        },
        {
            accessorKey: "productionDate",
            header: "Ngày sản xuất",
            cell: ({ row }) => {
                const date = new Date(row.original.productionDate)
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "expirationDate",
            header: "Ngày hết hạn",
            cell: ({ row }) => {
                const date = new Date(row.original.expirationDate)
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "time",
            header: "Thời gian",
            cell: ({ row }) => getRemainingTime(row.original.expirationDate),
        },
    ]


    const getRemainingTime = (endDate: string) => {
        const remainingDays = getRemainingDays(endDate)
        if (remainingDays <= 0)
            return <div className="px-2 py-1 bg-red-50 w-fit rounded-md text-red-700 font-bold text-center">Đã hết hạn</div>

        return (
            <div
                className={`px-2 py-1 w-fit rounded-md font-bold text-center ${remainingDays > 30
                    ? "bg-green-50 text-green-700"
                    : remainingDays > 15
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
            >
                {remainingDays} ngày
            </div>
        )
    }

    const getTotalQuantity = (data: ProductBatchItem[], minDays: number, maxDays: number) =>
        data.reduce((total, item) => {
            const remaining = getRemainingDays(item.expirationDate);
            return remaining > minDays && remaining <= maxDays ? total + item.remainingQuantity : total;
        }, 0);

    const SelectDate = () => (
        <div className="flex items-center py-4 space-x-4 p-4 w-full justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between sm:w-auto">
                        {dateRangeOptions[selectedOption].label}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleOptionSelect("all")}>Tất cả</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("sevenDays")}>7 ngày</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("fifteenDays")}>15 ngày</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("oneMonth")}>1 tháng</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("threeMonths")}>3 tháng</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOptionSelect("outDate")}>Hết hạn</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

    return (
        <div className="m-10">
            <div className="sm:flex justify-between items-center mb-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">Danh sách sản phẩm trong kho</div>
                <div className="mt-5 sm:mt-0 space-y-4 sm:space-y-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <Link href={
                        user?.value?.role === 'Administrator'
                            ? "/admin/promotion/create"
                            : "/manager/promotion/create"
                    }>
                        <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
                            <CirclePlus className="mr-2 h-4 w-4" />
                            Tạo chương trình khuyến mãi
                        </Button>
                    </Link>
                    <Link href={
                        user?.value?.role === 'Administrator'
                            ? "/admin/inventory/create"
                            : "/manager/inventory/create"
                    }>
                        <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
                            <CirclePlus className="mr-2 h-4 w-4" />
                            Tạo xuất nhập kho
                        </Button>
                    </Link>
                </div>
            </div>
            {isLoading ? (
                <div className="w-full">
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <CardSkeleton key={i + 1} />
                            ))}

                    </div>
                    <div className="mt-8">
                        <DataTableSkeleton />
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4 mt-10">
                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">3 tháng</CardTitle>
                                <div className="bg-green-50 rounded-full p-3 border">
                                    <Package className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{getTotalQuantity(products?.value ?? [], 30, Infinity)}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">1 tháng</CardTitle>
                                <div className="bg-blue-50 rounded-full p-3 border">
                                    <Package className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{getTotalQuantity(products?.value ?? [], 15, 30)}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">15 ngày</CardTitle>
                                <div className="bg-purple-50 rounded-full p-3 border">
                                    <Package className="h-4 w-4 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{getTotalQuantity(products?.value ?? [], 7, 15)}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">7 ngày</CardTitle>
                                <div className="bg-amber-50 rounded-full p-3 border">
                                    <Package className="h-4 w-4 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{getTotalQuantity(products?.value ?? [], 0, 7)}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8">
                        <div className="bg-white cardStyle shadow border">
                            <DataTableCustom data={filteredData ?? []} columns={columns} placeholder="tên sản phẩm" searchFiled="productName" >
                                <SelectDate />
                            </DataTableCustom>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ListInventory
