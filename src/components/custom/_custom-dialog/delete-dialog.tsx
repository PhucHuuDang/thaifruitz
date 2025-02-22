import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { toast } from 'sonner';

interface DeleteDialogProps {
    name: string,
    deleteFunction: (id: string) => Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    isOpen: boolean;
    onClose: (value: boolean) => void
    id: string
}


export function DeleteDialog({ name, deleteFunction, id, onClose, isOpen }: Readonly<DeleteDialogProps>) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = async () => {
        setIsSubmitting(true)
        try {
            const response = await deleteFunction(id);
            if (response?.success) {
                toast.success(response.message)
                onClose(false);
            } else {
                toast.error(response?.message)
            }
        } catch (error) {
            console.log({ error });
        }

        setIsSubmitting(false)
    };

    return (<Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
            <Button
                variant="outline"
                className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
                <Trash2 />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
                <DialogDescription>
                    Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {name} không?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogTrigger asChild>
                    <Button variant="outline" type="button">Hủy</Button>
                </DialogTrigger>
                <Button disabled={isSubmitting} onClick={onSubmit} variant="destructive" type="submit">{isSubmitting ? <WaitingSpinner
                    variant="pinwheel"
                    label="Đang xóa..."
                    className="font-semibold "
                    classNameLabel="font-semibold text-sm"
                /> : "Xác nhận"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}
