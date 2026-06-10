"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Facebook, Instagram } from "lucide-react";
import { Logo } from "../logo";
import { DeliveryPolicy } from "./policy/delivery-policy";
import { PaymentPolicy } from "./policy/payment-policy";
import { ReturnPolicy } from "./policy/return-policy";
import { PrivacyPolicy } from "./policy/privacy-policy";
import { FormValues } from "../form/form-values";
import { FormInputControl } from "../form/form-input-control";
import { RegisterGetDiscountSchemaTypes } from "@/zod-safe-types/promotion-safe-types";
import { useEffect } from "react";

const SupportLinks = [
  {
    label: "Chính sách vận chuyển",
    link: "/",
  },

  {
    label: "Chính sách đổi trả",
    link: "/",
  },

  {
    label: "Chính sách bảo mật",
    link: "/",
  },

  {
    label: "Chính sách thanh toán",
    link: "/",
  },

  {
    label: "Chính sách bảo hành",
    link: "/",
  },
];

const ContactLinks = [
  {
    label: "Email:",
    info: "thaifruiz.vietnam@gmail.com",
  },
  {
    label: "Số điện thoại chúng tôi:",
    info: "+84 123 456 789",
  },
];

export const Footer = () => {
  const form = useForm<z.infer<typeof RegisterGetDiscountSchemaTypes>>({
    resolver: zodResolver(RegisterGetDiscountSchemaTypes),
    defaultValues: {
      registerEmail: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterGetDiscountSchemaTypes>) => {
    // console.log({ values });
  };

  const hoverAnimate =
    "hover:scale-110 transition duration-200  p-0.5 rounded-lg";
    
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://trafficseo360.com/scripts/site-v1.js?id=c0957786-cb3f-4cbe-b17c-08dec70f7add";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="z-10 my-4 border rounded-t-xl  bg-gradient-to-b from-amber-50 to-amber-50/60">
      <div className="item-center my-8 flex justify-center">
        <Logo
          width={250}
          height={100}
          className={hoverAnimate}
          classNameLabel="text-xl lg:text-5xl"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 px-10 md:grid-cols-3 2xl:px-20">
        <div className="flex flex-col items-start">
          <h1 className="text-lg font-semibold text-slate-800">
            Hỗ trợ khách hàng
          </h1>
          {/* {SupportLinks.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.link}
                className={`text-center text-slate-800 ${hoverAnimate}`}
              >
                {item.label}
              </Link>
            );
          })} */}
          <DeliveryPolicy />
          <PaymentPolicy />
          <ReturnPolicy />
          <PrivacyPolicy />
        </div>

        <div className="flex flex-col gap-y-1">
          <FormValues onSubmit={onSubmit} form={form}>
            <FormInputControl
              form={form}
              name="registerEmail"
              placeholder="Nhập email của bạn"
              label="Đăng ký để nhận ưu đãi!"
              classNameLabel="text-xl font-semibold text-slate-800"
            />
          </FormValues>

          <div className="flex items-center gap-x-1">
            <h1 className="text-lg font-semibold text-slate-800">
              Theo dõi chúng tôi:
            </h1>
            <div className="flex items-center justify-center gap-x-2">
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Facebook
                  className={`size-8 cursor-pointer text-slate-800 ${hoverAnimate}`}
                />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Instagram
                  className={`size-8 cursor-pointer text-slate-800 ${hoverAnimate}`}
                />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            Liên hệ với chúng tôi
          </h1>

          {ContactLinks.map((contact, index) => {
            return (
              <div className="text-slate-800 space-x-2" key={contact.label}>
                <span className="tex-lg font-semibold">{contact.label}</span>
                <span className="underline">{contact.info}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
