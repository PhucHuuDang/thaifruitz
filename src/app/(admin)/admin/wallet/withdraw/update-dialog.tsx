import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import { Button } from '@/components/ui/button'
import { RequestWithDrawal } from './page'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { toast } from 'sonner'
import { API } from '@/actions/client/api-config'
import { CreateEventSafeTypes } from '@/zod-safe-types/event-safe-types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { FormValues } from '@/components/global-components/form/form-values'
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { WALLET_KEY } from '@/app/key/admin-key'
import { UpdateRequestWithdrawalSafeTypes } from '@/zod-safe-types/wallet-safe-types'

interface DialogEventProps {
    isOpen: boolean,
    onClose: () => void,
    requestWithdrawal: RequestWithDrawal | undefined
}

const DialogRequestWithDrawal = ({ onClose, isOpen, requestWithdrawal }: Readonly<DialogEventProps>) => {

    const form = useForm<z.infer<typeof UpdateRequestWithdrawalSafeTypes>>({
        resolver: zodResolver(UpdateRequestWithdrawalSafeTypes),
        defaultValues: {
            requestWithDrawalId: requestWithdrawal?.id ?? "",
            note: requestWithdrawal?.note ?? "",
            image: requestWithdrawal?.image ?? undefined,
        }
    });

    const queryClient = useQueryClient();
    const onSubmit = async (values: z.infer<typeof UpdateRequestWithdrawalSafeTypes>) => {
        try {
            const formData = new FormData();

            formData.append("id", values.requestWithDrawalId)
            formData.append("note", values.note)
            if (values.image) {
                formData.append("image", values.image[0])
            }


            const response = await API.update(`/Wallets/${requestWithdrawal?.id}/request-withdrawal`, formData);
            if (response) {
                toast.success("Cập nhật yêu cầu rút tiền thành công")
                onClose()
                form.reset()
                queryClient.invalidateQueries({ queryKey: [WALLET_KEY.REQUEST_WITHDRAWAL] })
            }
        } catch (error) {
            console.log({ error });
        }
    };
    const title = "Cập nhật rút tiền"
    const buttonText = "Cập nhật"
    const loadingLabel = "Đang cập nhật..."
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[560px] md:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 gap-10'>
                        <FormTextareaControl
                            form={form}
                            disabled={form.formState.isSubmitting}
                            name='note'
                            label='Ghi chú'
                            require
                        />
                        <FormFileControl
                            form={form}
                            disabled={form.formState.isSubmitting}
                            name='image'
                            label='Ảnh thanh toán'
                            type={"image/jpeg, image/jpg, image/png, image/webp"}
                            require={requestWithdrawal?.image === null}
                            mutiple={false}
                        />

                    </div>

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

export default DialogRequestWithDrawal