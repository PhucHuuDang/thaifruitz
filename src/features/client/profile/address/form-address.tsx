import React, { MouseEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

// Custom Components
import { FormValues } from "@/components/global-components/form/form-values";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import {
  FormSelectControl,
  SelectData,
} from "@/components/global-components/form/form-select-control";
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";

// Hooks & Utilities
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";

// Types
import { ApiResponse } from "@/types/types";
import { FormAddressSafeTypes } from "@/zod-safe-types/address-safe-types";
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { createAddress, updateAddress } from "@/actions/address";
import { FormControl, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AddressTypes } from "@/types/address.types";

interface FormAddressProps {
  address?: AddressTypes;
  onClose: () => void;
}

const useAddressForm = (address?: FormAddressProps["address"]) => {
  const form = useForm<z.infer<typeof FormAddressSafeTypes>>({
    resolver: zodResolver(FormAddressSafeTypes),
    defaultValues: {
      id: undefined,
      tag: "",
      name: "",
      phone: "",
      address: "",
      province: "",
      district: "",
      ward: "",
      isDefault: false,
    },
  });
  useEffect(() => {
    if (address) {
      form.reset({
        id: address.id,
        tag: address.tagName || "",
        name: address.receiverName || "",
        phone: address.receiverPhone || "",
        address: address.receiverAddress?.split(",")[0] || "",
        province: `${address.provinceID}-${
          address.receiverAddress?.split(",")[3]?.trim() ?? ""
        }`,
        district: `${address.districtID}-${
          address.receiverAddress?.split(",")[2]?.trim() ?? ""
        }`,
        ward: `${address.wardID}-${
          address.receiverAddress?.split(",")[1]?.trim() ?? ""
        }`,
        isDefault: address.isDefault ?? false,
      });
    }
  }, [address, form]);
  const onSubmit = (
    values: z.infer<typeof FormAddressSafeTypes>,
    mutation: UseMutateFunction<void, Error, any, unknown>
  ) => {
    mutation(values);
  };

  return { form, onSubmit };
};

function FormAddress({ address, onClose }: Readonly<FormAddressProps>) {
  const { form, onSubmit } = useAddressForm(address);
  const queryClient = useQueryClient();
  const { data: provinces } = useFetch<ApiResponse<SelectData[]>>(
    "/Addresses/province",
    ["provinces"]
  );

  const { isPending, mutate: addressMutation } = useMutation({
    mutationFn: async ({
      id,
      province,
      district,
      ward,
      address,
      name,
      tag,
      isDefault,
      phone,
    }: {
      id: string;
      province: string;
      district: string;
      ward: string;
      address: string;
      name: string;
      tag: string;
      isDefault: boolean;
      phone: string;
    }) => {
      try {
        const payload = {
          tagName: tag,
          receiverName: name,
          receiverPhone: phone,
          receiverAddress: `${address}, ${ward.split("-")[1]}, ${
            district.split("-")[1]
          }, ${province.split("-")[1]}`,
          longtitude: null,
          latitude: null,
          isDefault: isDefault,
          wardId: Number(ward?.split("-")[0]) || 0,
        };

        const response =
          id === undefined
            ? await createAddress(payload)
            : await updateAddress({ id, ...payload });

        if (!response?.isSuccess) {
          if (response?.status === 409) {
            throw new Error("Tên thẻ đã tồn tại");
          }
          throw new Error("Lỗi hệ thống");
        }
      } catch (error: unknown) {
        throw new Error(
          error instanceof Error ? error?.message : "Lỗi hệ thống"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      if (form.getFieldState("id") === undefined) {
        toast.success("Tạo địa chỉ thành công");
      } else {
        toast.success("Cập nhật địa chỉ thành công");
      }
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const provinceId = form.watch("province");
  const districtId = form.watch("district");

  const [province, setProvince] = useState<string>();
  const [district, setDistrict] = useState<string>();

  useEffect(() => {
    if (provinceId) {
      setProvince(provinceId.split("-")[0]);
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      setDistrict(districtId.split("-")[0]);
    }
  }, [districtId]);

  const { data: districts } = useFetch<ApiResponse<SelectData[]>>(
    `/Addresses/district/${province}`,
    ["districts", province ?? ""],
    {},
    { enabled: !!province }
  );

  const { data: wards } = useFetch<ApiResponse<SelectData[]>>(
    `/Addresses/${district}/ward`,
    ["wards", district ?? ""],
    {},
    { enabled: !!district }
  );

  if (!provinces) {
    return (
      <ResizablePanel
        defaultSize={60}
        minSize={40}
        className="p-4 flex justify-center items-center"
      >
        <WaitingSpinner variant="pinwheel" label="Đang tải..." />
      </ResizablePanel>
    );
  }

  const isEditMode = !!address;
  const title = isEditMode
    ? "Cập nhật địa chỉ người nhận"
    : "Tạo địa chỉ mới người nhận";
  const submitLabel = isEditMode ? "Cập nhật" : "Tạo mới";
  const submittingLabel = isEditMode ? "Đang cập nhật..." : "Đang tạo mới...";

  return (
    <>
      <ResizableHandle withHandle className="bg-purple-200" />
      <ResizablePanel defaultSize={60} minSize={40} className="p-4">
        <h4 className="text-xl font-semibold mb-6 text-purple-700">{title}</h4>
        <FormValues<z.infer<typeof FormAddressSafeTypes>>
          form={form}
          onSubmit={(values) => onSubmit(values, addressMutation)}
        >
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-10">
              <FormInputControl
                disabled={isPending}
                form={form}
                name="tag"
                label="Tên thẻ"
              />
              <FormInputControl
                disabled={isPending}
                form={form}
                name="name"
                label="Tên"
              />
              <FormInputControl
                disabled={isPending}
                form={form}
                name="phone"
                label="Số điện thoại"
              />
              <FormSelectControl
                disabled={isPending}
                form={form}
                name="province"
                label="Tỉnh / Thành phố"
                placeholder="Chọn tỉnh / thành phố"
                items={provinces?.value}
                isCustomValue
              />
              <FormSelectControl
                disabled={isPending}
                form={form}
                name="district"
                label="Quận / Huyện"
                placeholder="Chọn quận / huyện"
                items={districts?.value}
                isCustomValue
              />
              <FormSelectControl
                disabled={isPending}
                form={form}
                name="ward"
                label="Phường / Xã"
                placeholder="Chọn phường / xã"
                items={wards?.value}
                isCustomValue
              />
            </div>
            <FormTextareaControl
              disabled={isPending}
              form={form}
              name="address"
              label="Địa chỉ"
            />
            <Controller
              name="isDefault"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <p className="text-sm font-medium">Địa chỉ mặc định</p>
                  <FormControl>
                    <Switch
                      className={`${
                        field.value ? "!bg-green-500" : "!bg-red-500"
                      }`}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      checked={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="pt-5 pb-3 flex flex-row-reverse justify-between">
              <Button
                className="h-10"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onClose();
                  form.reset();
                }}
                variant="outline"
              >
                Đóng
              </Button>
              <ButtonCustomized
                // type="submit"
                type="button"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  form.handleSubmit((values) =>
                    onSubmit(values, addressMutation)
                  )();
                }}
                className="max-w-fit h-10 rounded-md bg-purple-500 hover:bg-purple-700"
                variant="secondary"
                disabled={isPending}
                label={
                  isPending ? (
                    <WaitingSpinner
                      variant="pinwheel"
                      label={submittingLabel}
                      className="font-semibold"
                      classNameLabel="font-semibold text-sm"
                    />
                  ) : (
                    submitLabel
                  )
                }
              />
            </div>
          </div>
        </FormValues>
      </ResizablePanel>
    </>
  );
}

export default FormAddress;
