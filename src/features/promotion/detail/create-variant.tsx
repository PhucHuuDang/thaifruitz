import { API } from '@/actions/client/api-config';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import ImagePreview from '@/components/custom/_custom-image/image-preview';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatVND } from '@/lib/format-currency';
import { cn } from '@/lib/utils';
import { ApiResponse } from '@/types/types';
import { ProductSelectionSafeTypes } from '@/zod-safe-types/promotion-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, MinusCircle, PlusCircle, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import Image from 'next/image';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { PROMOTION_KEY } from '@/app/key/comm-key';

interface CreateVariantProps {
    onClose: () => void;
    promotionId: string,
    startDate: Date,
    endDate: Date,
    percentage: number,
    productVariants: string[];
}
interface ProductVariant {
    productVariantId: string
    image: string
    netWeight: number
    packageType: string
    price: number
    isCanDiscount: boolean
}

interface Product {
    productId: string
    name: string
    image: string
    productVariants: ProductVariant[]
}


const CreateVariant = ({ onClose, promotionId, percentage, startDate, endDate, productVariants }: Readonly<CreateVariantProps>) => {

    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof ProductSelectionSafeTypes>>({
        resolver: zodResolver(ProductSelectionSafeTypes),
        defaultValues: {
            selectedProducts: []
        }
    })

    const onSubmit = async (values: z.infer<typeof ProductSelectionSafeTypes>) => {
        try {
            const formData = new FormData();
            formData.append("promotionId", promotionId);

            let index = 0
            values.selectedProducts.forEach((product) => {
                product.variants.forEach((variant) => {
                    formData.append(`createProductVariant[${index}][productVariantId]`, variant.variantId);
                    formData.append(`createProductVariant[${index}][quantity]`, variant.quantity.toString());
                    index += 1;
                });
            });
            const res = await API.post("/Promotions/promotion-product-variants", formData);
            if (res) {
                toast.success("Thêm sản phẩm thành công")
                form.reset();
                queryClient.invalidateQueries({ queryKey: [PROMOTION_KEY.PROMOTION_DETAIL_MANAGE, promotionId] })
                onClose();
            }
        } catch (error: unknown) {
            console.log(error instanceof Error ? error?.message : "Lỗi hệ thống")
            toast.error("Lỗi hệ thống")
        }
    }
    const start = startDate?.toISOString().split("T")[0];
    const end = endDate?.toISOString().split("T")[0];

    const { data: apiResponse } = useFetch<ApiResponse<Product[]>>(
        `/Promotions/product?StartDate=${start}&EndDate=${end}`,
        [PROMOTION_KEY.PROMOTION_PRODUCT_MANAGE],
    )

    const products = apiResponse?.value?.map(product => ({
        ...product,
        productVariants: product.productVariants.filter((variant: ProductVariant) =>
            !productVariants.includes(variant.productVariantId)
        )
    }))
        .filter(product => product.productVariants.length > 0) || [];
    const [searchTerm, setSearchTerm] = useState("")
    const [quantities, setQuantities] = useState<Record<string, number>>(
        form.getValues("selectedProducts").reduce((quantities: Record<string, number>, product: any) => {
            product.variants.forEach((variant: { variantId: string, quantity: number }) => {
                quantities[variant.variantId] = variant.quantity;
            });
            return quantities;
        }, {})
    );
    const [expandedProducts, setExpandedProducts] = useState<string[]>(
        form.getValues("selectedProducts").reduce((expandedProducts: string[], product: any) => {
            if (product.variants.length > 0) {
                expandedProducts.push(product.productId);
            }
            return expandedProducts;
        }, [])
    );
    const filteredProducts = products.filter((product: Product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const [selectedVariants, setSelectedVariants] = useState<string[]>(
        form.getValues("selectedProducts").reduce((variants: string[], product: any) => {
            const variantIds = product.variants.map((variant: { variantId: string }) => variant.variantId);
            return [...variants, ...variantIds];
        }, [])
    );

    // Check if all variants of a product are selected
    const isProductFullySelected = (product: Product) => {
        return product.productVariants.every((variant) => selectedVariants.includes(variant.productVariantId))
    }

    // Check if any variant of a product is selected
    const isProductPartiallySelected = (product: Product) => {
        return (
            product.productVariants.some((variant) => selectedVariants.includes(variant.productVariantId)) &&
            !isProductFullySelected(product)
        )
    }

    // Toggle product expansion
    const toggleProductExpansion = (productId: string) => {
        setExpandedProducts((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
        )
    }

    // Handle product selection (selects all variants)
    const handleSelectProduct = (product: Product, isChecked: boolean) => {
        const variantIds = product.productVariants.reduce((variants: string[], variant: ProductVariant) => {
            if (variant.isCanDiscount) {
                variants.push(variant.productVariantId);
            }
            return variants;
        }, [])

        if (isChecked) {
            // Select all variants of this product
            const newSelectedVariants = [...selectedVariants]

            variantIds.forEach((variantId) => {
                if (!newSelectedVariants.includes(variantId)) {
                    newSelectedVariants.push(variantId)
                    // Initialize quantity to 1 for newly selected variants
                    setQuantities((prev) => ({ ...prev, [variantId]: 1 }))
                }
            })

            setSelectedVariants(newSelectedVariants)
        } else {
            // Deselect all variants of this product
            const newSelectedVariants = selectedVariants.filter((id) => !variantIds.includes(id))

            // Remove quantities for deselected variants
            const newQuantities = { ...quantities }
            variantIds.forEach((id) => {
                delete newQuantities[id]
            })

            setSelectedVariants(newSelectedVariants)
            setQuantities(newQuantities)
        }

        // Expand the product when selected
        if (isChecked && !expandedProducts.includes(product.productId)) {
            setExpandedProducts((prev) => [...prev, product.productId])
        }

        updateFormValue()
    }

    // Handle variant selection
    const handleSelectVariant = (variantId: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedVariants((prev) => [...prev, variantId])
            // Initialize quantity to 1 for newly selected variant
            setQuantities((prev) => ({ ...prev, [variantId]: 1 }))
        } else {
            setSelectedVariants((prev) => prev.filter((id) => id !== variantId))
            // Remove quantity for deselected variant
            const newQuantities = { ...quantities }
            delete newQuantities[variantId]
            setQuantities(newQuantities)
        }

        updateFormValue()
    }

    // Update form value with selected variants and quantities
    const updateFormValue = () => {
        const selectedItems = []
        for (const product of products) {
            const selectedProductVariants = product.productVariants.filter((variant: ProductVariant) =>
                selectedVariants.includes(variant.productVariantId),
            )

            if (selectedProductVariants.length > 0) {
                selectedItems.push({
                    productId: product.productId,
                    name: product.name,
                    image: product.image,
                    variants: selectedProductVariants.map((variant: ProductVariant) => ({
                        variantId: variant.productVariantId,
                        packageType: variant.packageType,
                        netWeight: variant.netWeight,
                        price: variant.price,
                        quantity: quantities[variant.productVariantId] || 1,
                    })),
                })
            }
        }
        form.setValue("selectedProducts", selectedItems, { shouldValidate: true })
    }

    // Handle quantity change for a variant
    const handleQuantityChange = (variantId: string, value: number) => {
        // Ensure quantity is at least 1
        const newValue = Math.max(1, value)
        setQuantities((prev) => ({ ...prev, [variantId]: newValue }))
        updateFormValue()
    }

    // Handle select all
    const handleSelectAll = () => {
        const allVariantIds = products.flatMap((product: Product) =>
            product.productVariants.reduce((variants: string[], variant: ProductVariant) => {
                if (variant.isCanDiscount) {
                    variants.push(variant.productVariantId);
                }
                return variants;
            }, [])
        );

        setSelectedVariants((prevSelected) => {
            const isAllSelected = prevSelected.length === allVariantIds.length

            if (isAllSelected) {
                setQuantities({})
                setExpandedProducts([])
                return []
            } else {

                const newQuantities = allVariantIds.reduce((acc, id) => {
                    acc[id] = 1
                    return acc
                }, {} as Record<string, number>)

                setQuantities(newQuantities)
                setExpandedProducts(products.map((p) => p.productId))
                return allVariantIds
            }
        })

        updateFormValue()
    }

    useEffect(() => {
        updateFormValue()
    }, [selectedVariants, quantities])

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" type="button" onClick={() => setSearchTerm("")}>
                    Xóa bộ lọc
                </Button>
            </div>

            {form.formState.errors.selectedProducts && (
                <div className="text-sm text-red-500 mt-1">{form.formState.errors.selectedProducts.message as string}</div>
            )}

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        selectedVariants.length > 0 &&
                                        selectedVariants.length === products.flatMap((p) => p.productVariants).length
                                    }
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Chọn tất cả"
                                />
                            </TableHead>
                            <TableHead className="w-12">Ảnh</TableHead>
                            <TableHead>Tên sản phẩm / Biến thể</TableHead>
                            <TableHead className="text-right">Giá gốc</TableHead>
                            <TableHead className="text-right">Giá sau KM</TableHead>
                            <TableHead className="text-center">Số lượng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                    Không tìm thấy sản phẩm nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.flatMap((product: Product) => {
                                const isExpanded = expandedProducts.includes(product.productId)
                                const isFullySelected = isProductFullySelected(product)
                                const isPartiallySelected = isProductPartiallySelected(product)

                                // Product row
                                const productRow = (
                                    <TableRow
                                        key={product.productId}
                                        className={cn(isFullySelected || isPartiallySelected ? "bg-muted/50" : "", !product.productVariants.some(x => x.isCanDiscount) ? "bg-slate-100/80" : "")}
                                    >
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 p-0 mr-1"
                                                    onClick={() => toggleProductExpansion(product.productId)}
                                                >
                                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                </Button>
                                                <Checkbox
                                                    checked={isFullySelected}
                                                    data-state={isPartiallySelected ? "indeterminate" : "unchecked"}
                                                    onCheckedChange={(checked) => handleSelectProduct(product, checked === true)}
                                                    aria-label={`Chọn ${product.name}`}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <ImagePreview
                                                images={[product.image]}
                                                initialWidth={40}
                                                initialHeight={40}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell className="text-right">-</TableCell>
                                        <TableCell className="text-right">-</TableCell>
                                        <TableCell className="text-center">-</TableCell>
                                    </TableRow>
                                )

                                // Variant rows (only if product is expanded)
                                const variantRows = isExpanded
                                    ? product.productVariants.map((variant) => {
                                        const isSelected = selectedVariants.includes(variant.productVariantId)
                                        const discountedPrice = percentage
                                            ? variant.price * (1 - percentage / 100)
                                            : variant.price

                                        return (
                                            <TableRow key={variant.productVariantId} className={cn(`${isSelected ? "bg-muted/30" : ""}`, "pl-10", !variant.isCanDiscount ? "bg-slate-100/80" : "")}>
                                                <TableCell>
                                                    <div className="flex items-center pl-8">
                                                        <Checkbox
                                                            disabled={!variant.isCanDiscount}
                                                            checked={isSelected}
                                                            onCheckedChange={(checked) =>
                                                                handleSelectVariant(variant.productVariantId, checked === true)
                                                            }
                                                            aria-label={`Chọn biến thể ${variant.packageType}`}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {variant.image ? (
                                                        <ImagePreview
                                                            images={[variant.image]}
                                                            initialWidth={40}
                                                            initialHeight={40}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-muted rounded-md"></div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="pl-8 text-sm">
                                                    {variant.packageType} - {variant.netWeight}g
                                                </TableCell>
                                                <TableCell className="text-right">{formatVND(variant.price)}</TableCell>
                                                <TableCell className="text-right">
                                                    <span className={isSelected ? "text-green-600 font-medium" : "text-muted-foreground"}>
                                                        {formatVND(discountedPrice)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {isSelected && (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-7 w-7"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        variant.productVariantId,
                                                                        (quantities[variant.productVariantId] || 1) - 1,
                                                                    )
                                                                }
                                                            >
                                                                <MinusCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={quantities[variant.productVariantId] || 1}
                                                                onChange={(e) =>
                                                                    handleQuantityChange(variant.productVariantId, Number.parseInt(e.target.value) || 1)
                                                                }
                                                                className="h-8 w-16 text-center"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-7 w-7"
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        variant.productVariantId,
                                                                        (quantities[variant.productVariantId] || 1) + 1,
                                                                    )
                                                                }
                                                            >
                                                                <PlusCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                    : []

                                return [productRow, ...variantRows]
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium mb-2">
                    Sản phẩm đã chọn:{" "}
                    {
                        products.filter((product: Product) =>
                            product.productVariants.some((variant: ProductVariant) => selectedVariants.includes(variant.productVariantId)),
                        ).length
                    }
                </h3>
                {selectedVariants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {products.map((product: Product) => {
                            const selectedProductVariants = product.productVariants.filter((variant: ProductVariant) =>
                                selectedVariants.includes(variant.productVariantId),
                            )

                            if (selectedProductVariants.length === 0) return null

                            return (
                                <div key={product.productId} className="bg-background p-3 rounded-md">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Image
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            width={30}
                                            height={30}
                                            className="rounded-md object-cover"
                                        />
                                        <span className="font-medium text-sm truncate">{product.name}</span>
                                    </div>

                                    <div className="pl-2 space-y-1">
                                        {selectedProductVariants.map((variant) => (
                                            <div key={variant.productVariantId} className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    {variant.packageType} - {variant.netWeight}g
                                                </span>
                                                <span>SL: {quantities[variant.productVariantId] || 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">Chưa có sản phẩm nào được chọn</div>
                )}
            </div>
            <div className="flex justify-start gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <ButtonCustomized
                    type="submit"
                    className="min-w-32 max-w-fit px-2 !h-10 !rounded-md bg-sky-600 hover:bg-sky-700"
                    variant="secondary"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={form.formState.isSubmitting}
                    label={
                        form.formState.isSubmitting ? (
                            <WaitingSpinner
                                variant="pinwheel"
                                label="Đang thêm..."
                                className="font-semibold"
                                classNameLabel="font-semibold text-sm"
                            />
                        ) : (
                            "Thêm sản phẩm"
                        )
                    }
                />
            </div>
        </div>
    )
}


export default CreateVariant