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
import { FormControl, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AddressTypes } from "@/types/address.types";
import CustomMap from "@/components/custom/_custom_map/custom-map";
import { API } from "@/actions/client/api-config";
import { USER_KEY } from "@/app/key/user-key";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPinHouseIcon } from "lucide-react";

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
      latitude: undefined,
      longitude: undefined,
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
        latitude: address.latitude?.toString() ?? "",
        longitude: address.longtitude?.toString() ?? "",
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

  const [isShowMap, setIsShowMap] = useState<boolean>(false);

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
      latitude,
      longitude,
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
      latitude: string;
      longitude: string;
    }) => {
      try {
        const payload = {
          tagName: tag,
          receiverName: name,
          receiverPhone: phone,
          receiverAddress: `${address}, ${ward.split("-")[1]}, ${
            district.split("-")[1]
          }, ${province.split("-")[1]}`,
          longtitude: longitude.length > 0 ? longitude : null,
          latitude: latitude.length > 0 ? latitude : null,
          isDefault: isDefault,
          wardId: Number(ward?.split("-")[0]) || 0,
        };

        const response =
          id === undefined
            ? await API.post("/Addresses", payload)
            : await API.update("/Addresses", { id, ...payload });

        if (response) {
          queryClient.invalidateQueries({ queryKey: [USER_KEY.ADDRESS] });
          if (form.getFieldState("id") === undefined) {
            toast.success("Tạo địa chỉ thành công");
          } else {
            toast.success("Cập nhật địa chỉ thành công");
          }
          form.reset();
          onClose();
        }
      } catch (error: unknown) {
        console.log(error);
      }
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

  const handlerChooseLocation = (location: { lat: number; lng: number }) => {
    // console.log("location", location);
    form.setValue("latitude", location.lat.toString());
    form.setValue("longitude", location.lng.toString());
  };

  const isEditMode = !!address;
  const title = isEditMode
    ? "Cập nhật địa chỉ người nhận"
    : "Tạo địa chỉ mới người nhận";
  const submitLabel = isEditMode ? "Cập nhật" : "Tạo mới";
  const submittingLabel = isEditMode ? "Đang cập nhật..." : "Đang tạo mới...";

  return (
    <>
      <ResizableHandle withHandle className="bg-purple-200" />
      <ResizablePanel defaultSize={40} minSize={30} className="p-4">
        <h4 className="text-xl font-semibold mb-6 text-purple-700">{title}</h4>
        <FormValues<z.infer<typeof FormAddressSafeTypes>>
          form={form}
          onSubmit={(values) => onSubmit(values, addressMutation)}
        >
          {/* <ScrollArea className="space-y-5 h-[calc(100vh-10rem)] overflow-y-auto"> */}
          <ScrollArea className="space-y-5 h-[600px] overflow-y-auto p-4">
            <div className="grid sm:grid-cols-2 gap-10 p-4">
              <FormInputControl
                disabled={isPending}
                form={form}
                require
                name="tag"
                label="Tên thẻ"
              />
              <FormInputControl
                disabled={isPending}
                form={form}
                require
                name="name"
                label="Tên"
              />
              <FormInputControl
                disabled={isPending}
                form={form}
                require
                name="phone"
                label="Số điện thoại"
              />
              <FormSelectControl
                disabled={isPending}
                form={form}
                require
                name="province"
                label="Tỉnh / Thành phố"
                placeholder="Chọn tỉnh / thành phố"
                items={provinces?.value}
                isCustomValue
              />
              <FormSelectControl
                disabled={isPending}
                form={form}
                require
                name="district"
                label="Quận / Huyện"
                placeholder="Chọn quận / huyện"
                items={districts?.value}
                isCustomValue
              />
              <FormSelectControl
                disabled={isPending}
                form={form}
                require
                name="ward"
                label="Phường / Xã"
                placeholder="Chọn phường / xã"
                items={wards?.value}
                isCustomValue
              />
            </div>
            <div className="p-4">
              <FormTextareaControl
                disabled={isPending}
                form={form}
                require
                name="address"
                label="Địa chỉ"
              />
            </div>
            <div className="p-4">
              <span
                className="text-sm font-semibold my-2 flex items-center gap-2 hover:underline cursor-pointer transition"
                onClick={() => {
                  setIsShowMap((prev) => !prev);
                }}
              >
                <MapPinHouseIcon className="size-6" />
                Địa chỉ hiện tại?
              </span>
              {isShowMap && (
                <CustomMap
                  defaultLocation={{
                    lat: Number(form.getValues("latitude")) || 0,
                    lng: Number(form.getValues("longitude")) || 0,
                  }}
                  onLocationChange={handlerChooseLocation}
                />
              )}
            </div>
            <Controller
              name="isDefault"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <p className="text-sm font-semibold">Địa chỉ mặc định?</p>
                  <FormControl>
                    <Switch
                      className={`${
                        field.value ? "!bg-green-500" : "!bg-amber-200"
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
          </ScrollArea>
        </FormValues>
      </ResizablePanel>
    </>
  );
}

export default FormAddress;
