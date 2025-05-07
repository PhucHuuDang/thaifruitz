"use client"

import { API } from '@/actions/client/api-config'
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { COMBO_KEY } from '@/app/key/admin-key'
import { FancySelect } from '@/components/custom/_custom_select/select'
import { FormValues } from '@/components/global-components/form/form-values'
import { Spinner } from '@/components/global-components/spinner'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormItem, FormMessage } from '@/components/ui/form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumberWithUnit } from '@/lib/format-currency'
import { ComboSettingSafeTypes } from '@/zod-safe-types/setting-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CirclePlusIcon, Pencil, X } from 'lucide-react'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface ComboSetting {
    id: number;
    quantity: string;
    percentage: string;
}

const ComboPage = () => {

    const { data, refetch } = useFetch<ComboSetting[]>(`/Settings/${COMBO_KEY.COMBO_SETTING}`, [COMBO_KEY.COMBO_SETTING])
    const [comboSettings, setComboSettings] = React.useState<ComboSetting[]>(data ?? [])
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [comboSettingRemove, setComboSettingRemove] = React.useState<ComboSetting | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    useEffect(() => {
        if (data) {
            setComboSettings(data)
        }
    }, [data])

    const form = useForm<z.infer<typeof ComboSettingSafeTypes>>({
        resolver: zodResolver(ComboSettingSafeTypes),
    });

    const onSubmit = async (data: z.infer<typeof ComboSettingSafeTypes>) => {
        const { quantity, percentage } = data
        const comboSettingExisted = comboSettings.find((item) => item.quantity === quantity && item.id !== 0 && editingId !== item.id)
        if (comboSettingExisted) {
            form.setError("quantity", { message: "Số lượng đã tồn tại" })
            return
        }

        const index = comboSettings.findIndex((item) => item.id === editingId)
        comboSettings[index] = { id: editingId == 0 ? comboSettings.length + 1 : editingId ?? 0, quantity, percentage }
        handerSave(comboSettings);
        setEditingId(null)
    }

    const handerSave = async (comboSettings: ComboSetting[]) => {
        setIsSubmitting(true)
        try {
            const response = await API.update("/Settings", {
                name: COMBO_KEY.COMBO_SETTING,
                value: JSON.stringify(comboSettings)
            })
            if (response) {
                toast.success("Cập nhật thành công")
                refetch()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const QUANTITY_SELECT: { label: string, value: string }[] = [
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
    ];

    const handleRemove = (comboSetting: ComboSetting) => {
        setComboSettingRemove(comboSetting)
    }

    const deleteItem = () => {
        const comboSettingExisted = comboSettings.filter((item) => item.id !== comboSettingRemove?.id)
        setComboSettings(comboSettingExisted)
        handerSave(comboSettingExisted);
        setComboSettingRemove(undefined)
    }

    const handleAddNew = () => {
        setComboSettings((prev) => [...prev, { id: 0, quantity: "2", percentage: "2" }])
        setEditingId(0)
    }

    const handleCancelEdit = () => {
        if (editingId === 0) {
            setComboSettings((prev) => prev.filter((item) => item.id !== 0))
        }
        setEditingId(null)
        form.reset({
            quantity: "",
            percentage: ""
        })
    }

    return (
        <div className='m-10'>
            <Card className='cardStyle'>
                <CardHeader>
                    <CardTitle>Cài đặt gói quà</CardTitle>
                </CardHeader>
                <CardContent className='h-fit'>
                    <FormValues form={form} onSubmit={onSubmit}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Số lượng</TableHead>
                                    <TableHead>Phần trăm</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comboSettings?.map((comboSetting: ComboSetting) =>
                                    editingId === comboSetting.id ? (
                                        <TableRow key={comboSetting.id} >
                                            <TableCell className="font-medium">
                                                <div>
                                                    <Controller
                                                        name="quantity"
                                                        control={form.control}
                                                        render={({ field, fieldState }) => (
                                                            <FormItem className='mt-4'>
                                                                <FancySelect
                                                                    placeholder='Chọn số lượng hoặc nhập mới'
                                                                    options={QUANTITY_SELECT}
                                                                    onChangeValue={(selectedValues: any) => {
                                                                        field.onChange(selectedValues?.value)
                                                                    }}
                                                                    defaultValue={{
                                                                        label: comboSetting.quantity,
                                                                        value: comboSetting.quantity
                                                                    }}
                                                                    isNumber
                                                                />
                                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Controller
                                                    name="percentage"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <FormItem className='mt-4'>
                                                            <FancySelect
                                                                placeholder='Chọn phần trăm hoặc nhập mới'
                                                                options={QUANTITY_SELECT}
                                                                onChangeValue={(selectedValues: any) => {
                                                                    field.onChange(selectedValues?.value)
                                                                }}
                                                                unit="%"
                                                                defaultValue={{
                                                                    label: comboSetting.percentage,
                                                                    value: comboSetting.percentage
                                                                }}
                                                                isNumber
                                                            />
                                                            <FormMessage>{fieldState.error?.message}</FormMessage>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>

                                            </TableCell>
                                            <TableCell className='flex space-x-3'>
                                                <Button disabled={form.formState.isSubmitting} type='submit' size="sm" variant="outline">
                                                    {form.formState.isSubmitting ? <Spinner /> : <Check className="h-4 w-4" />}
                                                </Button>
                                                <Button disabled={form.formState.isSubmitting} type='button' size="sm" variant="outline" onClick={handleCancelEdit}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                    ) : (
                                        <TableRow key={comboSetting.id}>
                                            <TableCell>{comboSetting?.quantity}</TableCell>
                                            <TableCell>{formatNumberWithUnit(comboSetting.percentage, "%")}</TableCell>
                                            <TableCell className='flex space-x-3'>
                                                <Button type='button' size="sm" variant="outline" onClick={(e) => {
                                                    e.preventDefault();
                                                    setEditingId(comboSetting.id)
                                                }}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button type='button' size="sm" variant="outline" onClick={() => handleRemove(comboSetting)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}

                                {editingId === null && !comboSettings?.some(x => x.id === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <button type='button' disabled={form.formState.isSubmitting} onClick={handleAddNew} className="flex items-center justify-center sm:p-5 space-x-5 font-bold hover:cursor-pointer">
                                                <CirclePlusIcon />
                                                <span>Thêm mới</span>
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </FormValues>
                </CardContent>
            </Card>
            <Dialog open={comboSettingRemove !== undefined} onOpenChange={() => setComboSettingRemove(undefined)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{"Bạn có chắc chắn không?"}</DialogTitle>
                        <DialogDescription>
                            {`Thao tác này không thể hoàn lại. Bạn có chắc chắn muốn xóa số lượng ${comboSettingRemove?.quantity} không?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogTrigger asChild>
                            <Button variant="outline" type="button">Hủy</Button>
                        </DialogTrigger>
                        <Button onClick={() => deleteItem()} variant="destructive" type="submit">{isSubmitting ? <WaitingSpinner
                            variant="pinwheel"
                            label="Đang thực hiện..."
                            className="font-semibold "
                            classNameLabel="font-semibold text-sm"
                        /> : "Xác nhận"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ComboPage
