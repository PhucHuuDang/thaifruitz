"use client";
import React, { useState } from "react";
import FormAddress from "./form-address";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  CirclePlusIcon,
  MapPin,
  MapPinned,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { ApiResponse, PageResult } from "@/types/types";
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog";
import { AddressTypes } from "@/types/address.types";
import ViewMap from "@/components/custom/_custom_map/view-map";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { API } from "@/actions/client/api-config";
import { USER_KEY } from "@/app/key/user-key";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";

function AddressTab() {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [address, setAddress] = useState<AddressTypes | undefined>(undefined);
  const [isDeleteDialog, setIsDeleteDialog] = useState<boolean>(false);
  const [addressDelete, setAddressDelete] = useState<
    { id: string; name: string } | undefined
  >(undefined);

  const [position, setPosition] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);

  const { data: addresses } = useFetch<ApiResponse<PageResult<AddressTypes>>>(
    "/Addresses",
    [USER_KEY.ADDRESS]
  );

  const deleteAddress = async (id: string) => {
    return await API.remove(`/Addresses/${id}`);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] rounded-lg border bg-card motion-preset-slide-right motion-duration-500"
    >
      <ResizablePanel defaultSize={60} minSize={50} className="p-4">
        <div className="m-5 grid sm:grid-cols-3 gap-6">
          {addresses?.value?.items.map((item: AddressTypes) => (
            <div
              key={item.id}
              onClick={() => {
                setIsCreate(false);
                setAddress(item);
              }}
              className={`relative group text-left border shadow-sm rounded-xl p-2 hover:cursor-pointer ${
                item.id == address?.id ? "border-purple-700" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{item.tagName}</h3>
                {item.isDefault && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      Mặc định
                    </span>
                    <div className="h-3 w-3 bg-purple-500 rounded-full" />
                  </div>
                )}
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="flex items-center gap-2 font-semibold">
                  <User className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span className="line-clamp-2 whitespace-pre-line text-sky-500 font-semibold text-base ">
                    {item.receiverName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="whitespace-pre-line">
                    {formatVietnamesePhoneNumber(item.receiverPhone)}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-3 whitespace-pre-line font-semibold">
                    {item.receiverAddress}
                  </span>
                </div>

                {item.longtitude && item.latitude && (
                  <button
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      e.stopPropagation();
                      setPosition({
                        lat: item.latitude ?? 0,
                        lng: item.longtitude ?? 0,
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    <MapPinned className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="hover:underline hover:font-semibold">
                      Xem chi tiết
                    </span>
                  </button>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialog(true);
                  setAddressDelete({
                    id: item.id,
                    name: item.tagName,
                  });
                }}
                className="absolute hidden group-hover:flex -top-3 -right-3 p-1 w-fit rounded-md bg-red-600 text-white cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            className={`text-left border shadow-sm rounded-xl p-2 hover:cursor-pointer`}
            onClick={() => {
              setIsCreate(true);
              setAddress(undefined);
            }}
          >
            <div className="flex items-center p-5 space-x-5 font-bold">
              <CirclePlusIcon />
              <span>Thêm mới</span>
            </div>
          </button>
        </div>
      </ResizablePanel>

      {address && !isCreate && (
        <FormAddress onClose={() => setAddress(undefined)} address={address} />
      )}
      {isCreate && address === undefined && (
        <FormAddress onClose={() => setIsCreate(false)} address={undefined} />
      )}
      {addressDelete && (
        <DeleteDialog
          deleteFunction={deleteAddress}
          name={addressDelete.name}
          isOpen={isDeleteDialog}
          onClose={() => {
            setAddressDelete(undefined);
            setIsDeleteDialog(false);
          }}
          id={addressDelete.id}
          refreshKey={[[USER_KEY.ADDRESS]]}
        />
      )}

      {position && (
        <ViewMap
          isOpen={!!position}
          onClose={() => setPosition(undefined)}
          longtitude={position.lng}
          latitude={position.lat}
        />
      )}
    </ResizablePanelGroup>
  );
}

export default AddressTab;
