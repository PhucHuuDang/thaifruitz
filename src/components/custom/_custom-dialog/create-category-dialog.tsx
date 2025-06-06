"use client";

import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogFooter } from "@/components/ui/dialog";
import { CreateCategorySafeTypes } from "@/zod-safe-types/category-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control";
import { FormFileControl } from "@/components/global-components/form/form-file-control";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/actions/client/api-config";
import { CATEGORY_KEY } from "@/app/key/comm-key";

export const CreateCategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof CreateCategorySafeTypes>>({
    resolver: zodResolver(CreateCategorySafeTypes),
  });

  const queryClient = useQueryClient();

  const onSubmit = async (values: z.infer<typeof CreateCategorySafeTypes>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.image) {
        formData.append("thumbnail", values.image[0]);
      }
      const response = await API.post("/Categories", formData);
      if (response) {
        form.reset();
        setIsOpen(false);
        toast.success("Tạo loại sản phẩm thành công")
        queryClient.invalidateQueries({ queryKey: [CATEGORY_KEY.CATEGORY_MANAGE] })
      }

    } catch (error) {
      console.log({ error });
    }
  };

  const title = <div className="text-center">Tạo mới loại sản phẩm</div>;

  const trigger = (
    <Button className="bg-sky-600 hover:bg-sky-700 text-white hover:text-white/85" onClick={() => setIsOpen(true)} variant="outline">
      <CirclePlus />
      Tạo mới
    </Button>
  );

  const body = (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        <FormInputControl
          form={form}
          name="name"
          disabled={form.formState.isSubmitting}
          label="Tên loại sản phẩm"
        />

        <FormTextareaControl
          form={form}
          rows={4}
          name="description"
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
            onClick={() => setIsOpen(false)}
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
                  label="Đang tạo..."
                  className="font-semibold "
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                "Lưu"
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
      onClose={setIsOpen}
      description="Vui lòng nhập thông tin để tạo mới loại sản phẩm. Nhấn lưu để hoàn tất."
    />
  );
};
