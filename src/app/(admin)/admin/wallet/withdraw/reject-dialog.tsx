import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import { Button } from '@/components/ui/button'
import { RequestWithDrawal } from './page'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { toast } from 'sonner'
import { API } from '@/actions/client/api-config'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { FormValues } from '@/components/global-components/form/form-values'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { WALLET_KEY } from '@/app/key/admin-key'
import { UpdateRejectRequestWithdrawalSafeTypes } from '@/zod-safe-types/wallet-safe-types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface DialogEventProps {
    isOpen: boolean,
    onClose: () => void,
    requestWithdrawal: RequestWithDrawal | undefined
}

const DialogRejectRequestWithDrawal = ({ onClose, isOpen, requestWithdrawal }: Readonly<DialogEventProps>) => {

    const form = useForm<z.infer<typeof UpdateRejectRequestWithdrawalSafeTypes>>({
        resolver: zodResolver(UpdateRejectRequestWithdrawalSafeTypes),
        defaultValues: {
            requestWithDrawalId: requestWithdrawal?.id ?? "",
            reason: requestWithdrawal?.reason ?? "",
        }
    });

    const queryClient = useQueryClient();
    const onSubmit = async (values: z.infer<typeof UpdateRejectRequestWithdrawalSafeTypes>) => {
        try {

            const response = await API.patch(`/Wallets/request-withdrawal/${requestWithdrawal?.id}/reject`, values);
            if (response) {
                toast.success("Tù chối yêu cầu rút tiền thành công")
                onClose()
                form.reset()
                queryClient.invalidateQueries({ queryKey: [WALLET_KEY.REQUEST_WITHDRAWAL] })
            }
        } catch (error) {
            console.log({ error });
        }
    };

    const title = "Từ chối rút tiền"
    const buttonText = "Từ chối"
    const loadingLabel = "Đang từ chối..."
    const REJECT_WITHDRAW_REASONS = [
        { label: "Số tiền rút không hợp lệ" },
        { label: "Thông tin tài khoản ngân hàng không chính xác" },
        { label: "Tài khoản bị tạm khóa hoặc hạn chế giao dịch" },
        { label: "Lí do khác" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[560px] md:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <FormValues form={form} onSubmit={onSubmit}>
                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-base font-medium">Chọn lí từ chối</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                        {REJECT_WITHDRAW_REASONS.map((reason) => (
                                            <FormItem
                                                key={reason.label}
                                                className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem checked={form.getValues("reason") == reason.label} value={reason.label} className="text-primary" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer text-sm leading-tight">{reason.label}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {form.watch("reason") == "Lí do khác" && (
                        <FormTextareaControl
                            form={form}
                            disabled={form.formState.isSubmitting}
                            label="Lí do"
                            name="reason"
                            classNameInput="w-full"
                            rows={6} />
                    )}
                    <FormMessage className="text-sm text-destructive" />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <ButtonCustomized
                            type="submit"
                            className="min-w-32 max-w-fit px-2 !h-10 !rounded-md bg-sky-600 hover:bg-sky-700"
                            variant="secondary"
                            disabled={form.formState.isSubmitting}
                            label={
                                form.formState.isSubmitting ? (
                                    <WaitingSpinner
                                        variant="pinwheel"
                                        label={loadingLabel}
                                        className="font-semibold "
                                        classNameLabel="font-semibold text-sm"
                                    />
                                ) : (
                                    buttonText
                                )
                            }
                        />
                    </DialogFooter>
                </FormValues>
            </DialogContent>
        </Dialog>
    )
}

export default DialogRejectRequestWithDrawal