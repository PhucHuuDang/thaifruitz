"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface SelectData {
  id: string | number;
  name: string;
  thumbnail?: string;
}

interface FormSelectControlProps<T extends FieldValues, K> {
  form: UseFormReturn<T>;
  name: Path<T>;
  onSubmit?: (data: T) => void;
  label?: string;
  formSubmit?: React.ReactNode;
  classNameLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  items: SelectData[] | undefined;
  classNameInput?: string;
  search?: boolean;
  isImage?: boolean;
  // value?: string | PathValue<T, Path<T>> | undefined;
  value?: any;
  defaultValue?: any;
  icon?: React.ReactElement;
  require?: boolean;
}

export const FormSelectControl = <T extends FieldValues, K>({
  form,
  name,
  label,
  classNameLabel,
  disabled,
  classNameInput,
  placeholder,
  value,
  icon,
  defaultValue,
  items = [],
  search,
  isImage,
  require,
}: FormSelectControlProps<T, K>) => {
  const [inputValue, setInputValue] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = value.target.value;
    setInputValue(newValue);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      defaultValue={defaultValue ?? ""}
      render={({ field, fieldState, formState }) => {
        if (value !== undefined && value !== null && field.value !== value) {
          form.setValue(name, value);
        }

        return (
          <FormItem>
            <FormLabel
              className={cn(
                "text-text-foreground",
                require
                  ? "after:content-['(*)'] after:text-red-500 after:ml-1"
                  : "",
                classNameLabel
              )}
            >
              {icon}
              {label}
            </FormLabel>
            <FormControl>
              <Select
                disabled={disabled}
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className={cn("", classNameInput)}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {search && (
                    <Input
                      className="min-w-fit"
                      value={inputValue}
                      placeholder="Tìm kiếm..."
                      onChange={handleInputChange}
                    />
                  )}
                  <SelectGroup>
                    {filteredItems.map((data: SelectData) =>
                      isImage ? (
                        <SelectItem
                          key={data.id}
                          value={data.id.toString()}
                          className="block w-full text-left cursor-pointer"
                        >
                          <div className="inline-flex justify-between items-center w-full">
                            <p className="truncate">{data.name}</p>
                            <Image
                              width={100}
                              height={100}
                              alt={data.name}
                              src={data.thumbnail as string}
                            />
                          </div>
                        </SelectItem>
                      ) : (
                        <SelectItem
                          className="cursor-pointer"
                          key={data.id}
                          value={data.id.toString()}
                        >
                          {data.name}
                        </SelectItem>
                      )
                    )}
                    {inputValue && filteredItems.length === 0 && (
                      <div className="p-3 text-center">Không tìm thấy.</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};
