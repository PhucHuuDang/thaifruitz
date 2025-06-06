"use client";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { UpdateCategorySafeTypes } from "@/zod-safe-types/category-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control";
import { FormFileControl } from "@/components/global-components/form/form-file-control";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/actions/client/api-config";
import { CATEGORY_KEY } from "@/app/key/comm-key";
import { Category } from "@/features/category/list-category";



interface UpdateCategoryDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateCategoryDialog = ({
  category,
  isOpen,
  onClose,
}: UpdateCategoryDialogProps) => {
  const form = useForm<z.infer<typeof UpdateCategorySafeTypes>>({
    resolver: zodResolver(UpdateCategorySafeTypes),
  });
  const queryClient = useQueryClient();
  const onSubmit = async (values: z.infer<typeof UpdateCategorySafeTypes>) => {
    try {
      const formData = new FormData();
      formData.append("id", category.id);
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.image) {
        formData.append("thumbnail", values.image[0]);
      }

      const response = await API.update("/Categories", formData);;
      if (response) {
        form.reset();
        onClose();
        queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY.CATEGORY_MANAGE] })
        toast.success("Cập nhập loại sản phẩm thành công")
      }

      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  };

  const title = <div className="text-center">Cập nhật loại sản phẩm</div>;

  const trigger = (
    <Button
      className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      variant="outline"
    >
      <Pencil />
    </Button>
  );

  const body = (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        <FormInputControl
          form={form}
          name="name"
          disabled={form.formState.isSubmitting}
          defaultValue={category?.name}
          label="Tên loại sản phẩm"
        />

        <FormTextareaControl
          form={form}
          rows={4}
          name="description"
          defaultValue={category?.description}
          disabled={form.formState.isSubmitting}
          label="Mô tả loại sản phẩm"
        />
        <FormFileControl
          form={form}
          name="image"
          classNameInput="h-30 w-full"
          mutiple={false}
          type={"image/jpeg, image/jpg, image/png, image/webp"}
          disabled={form.formState.isSubmitting}
          label="Ảnh loại sản phẩm"
        />
        <DialogFooter>
          <ButtonCustomized
            onClick={onClose}
            className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
            variant="outline"
            label="Hủy"
          />

          <ButtonCustomized
            type="submit"
            className="px-2 min-w-32 max-w-fit bg-sky-600 hover:bg-sky-700"
            variant="secondary"
            disabled={form.formState.isSubmitting}
            label={
              form.formState.isSubmitting ? (
                <WaitingSpinner
                  variant="pinwheel"
                  label="Đang cập nhật..."
                  className="font-semibold "
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                "Cập nhật"
              )
            }
          />
        </DialogFooter>
      </FormValues>
    </div>
  );
  return (
    <DialogReused
      content={body}
      asChild
      trigger={trigger}
      title={title}
      open={isOpen}
      onClose={onClose}
      description="Vui lòng nhập thông tin để cập nhật loại sản phẩm. Nhấn cập nhật để hoàn tất."
      className="min-w-4xl"
    />
  );
};
