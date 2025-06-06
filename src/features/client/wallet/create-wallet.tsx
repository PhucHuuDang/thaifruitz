"use client";

import { PrivacyPolicy } from "@/components/global-components/footer/policy/privacy-policy";
import { ServicePolicy } from "@/components/global-components/footer/policy/service-policy";
import { FormValues } from "@/components/global-components/form/form-values";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateWalletProps {
  pin: string;
  setPin: React.Dispatch<React.SetStateAction<string>>;
  pinStrength: "weak" | "medium" | "strong" | "";
  rememberDevice: boolean;
  setRememberDevice: React.Dispatch<React.SetStateAction<boolean>>;
  acceptTerms: boolean;
  setAcceptTerms: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  pin: z.string(),
});

export const CreateWallet = memo(
  ({
    pin,
    setPin,
    pinStrength,
    rememberDevice,
    setRememberDevice,
    acceptTerms,
    setAcceptTerms,
  }: CreateWalletProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),

      defaultValues: {
        pin: pin,
      },
    });

    const getPinStrengthColor = () => {
      switch (pinStrength) {
        case "weak":
          return "text-red-500";
        case "medium":
          return "text-amber-500";
        case "strong":
          return "text-green-500";
        default:
          return "text-slate-700";
      }
    };

    const getPinStrengthLabel = () => {
      switch (pinStrength) {
        case "weak":
          return "Yếu";
        case "medium":
          return "Trung bình";
        case "strong":
          return "Mạnh";
        default:
          return "";
      }
    };

    const inputOTPRef = useRef(null);

    const firstSlotRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputOTPRef.current) {
        (inputOTPRef.current as any).focus();
      }

      if (firstSlotRef.current) {
        firstSlotRef.current.focus();
      }
    });

    const watchPin = form.watch("pin");

    console.log("watching pin", watchPin);
    useEffect(() => {
      setPin(watchPin);
    }, [watchPin, setPin]);

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="pin"
            className="text-base font-medium flex items-center justify-between"
          >
            <span>Tạo Mã PIN</span>
            {pinStrength && (
              <Badge
                variant="outline"
                className={`${getPinStrengthColor()} text-xs`}
              >
                PIN {getPinStrengthLabel()}
              </Badge>
            )}
          </Label>

          {/* <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={pin}
              onChange={setPin}
              pattern="^[0-9]+$"
              inputMode="numeric"
              containerClassName="gap-2"
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="h-14 w-14 text-center text-xl font-medium"
                  // ref={firstSlotRef}
                  autoFocus={true}
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot
                  index={3}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
                <InputOTPSlot
                  index={5}
                  className="h-14 w-14 text-center text-xl font-medium"
                />
              </InputOTPGroup>
            </InputOTP>
          </div> */}

          <FormValues
            form={form}
            onSubmit={() => {}}
            classNameForm="flex item-center justify-center"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập mã Pin</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern="^[0-9]+$"
                      inputMode="numeric"
                      containerClassName="gap-2"
                      autoFocus
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-14 w-14 text-center text-xl font-medium"
                          index={0}
                        />
                        <InputOTPSlot
                          className="h-14 w-14 text-center text-xl font-medium"
                          index={1}
                        />
                        <InputOTPSlot
                          className="h-14 w-14 text-center text-xl font-medium"
                          index={2}
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="h-14 w-14 text-center text-xl font-medium"
                          index={3}
                        />
                        <InputOTPSlot
                          className="h-14 w-14 text-center text-xl font-medium"
                          index={4}
                        />
                        <InputOTPSlot
                          className="h-14 w-14 text-center text-xl font-medium"
                          index={5}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Hãy nhập mã PIN của bạn. Mã PIN này sẽ được sử dụng để xác
                    minh
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Button type="submit">Submit</Button> */}
          </FormValues>

          {/* PIN Strength Indicator */}
          {pin?.length > 0 && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    pinStrength === "weak"
                      ? "w-1/3 bg-red-500"
                      : pinStrength === "medium"
                      ? "w-2/3 bg-amber-500"
                      : pinStrength === "strong"
                      ? "w-full bg-green-500"
                      : "w-0"
                  }`}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-700 mt-2">
            <ShieldCheck className="h-4 w-4 text-slate-700" />
            <p>
              Mã PIN của bạn phải có 4-6 chữ số và sẽ được sử dụng để bảo mật ví
              của bạn.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="remember"
              checked={rememberDevice}
              onCheckedChange={(checked) =>
                setRememberDevice(checked as boolean)
              }
              className="rounded-md"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="remember"
                className="text-sm font-medium cursor-progress leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ghi nhớ thiết bị này
              </label>
              <p className="text-xs text-slate-700">
                Bỏ qua xác minh PIN trong 30 ngày trên thiết bị này.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              required
              className="rounded-md"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-progress "
              >
                Tôi chấp nhận điều khoản và điều kiện
              </label>
              <div className="text-xs text-slate-700 flex items-center gap-1">
                Bằng cách tạo ví, bạn đồng ý với <ServicePolicy /> và{" "}
                <PrivacyPolicy />.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CreateWallet.displayName = "CreateWallet";
