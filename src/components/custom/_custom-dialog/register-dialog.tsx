"use client";

import { useState } from "react";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormPassword } from "@/components/global-components/form/form-password";
import { FormValues } from "@/components/global-components/form/form-values";
import { Logo } from "@/components/global-components/logo";
import { NavbarLink } from "@/components/global-components/navigate";
import {
  LoginSafeTypes,
  RegisterSafeTypes,
} from "@/zod-safe-types/auth-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRegisterDialog } from "@/hooks/use-register-dialog";
import { useLoginDialog } from "@/hooks/use-login-dialog";

export const RegisterDialog = () => {
  const form = useForm<z.infer<typeof RegisterSafeTypes>>({
    resolver: zodResolver(RegisterSafeTypes),
  });

  const registerDialog = useRegisterDialog();
  const loginDialog = useLoginDialog();

  const onSubmit = async (values: z.infer<typeof RegisterSafeTypes>) => {
    try {
      console.log({ values });

      toast.success("Register successfully!");
    } catch (error) {
      console.log({ error });
    }
  };

  const toggle = () => {
    registerDialog.onClose();
    loginDialog.onOpen();
  };

  const title = (
    <div className="text-center">
      <Logo height={50} width={50} />
    </div>
  );

  const trigger = (
    <div
      onClick={registerDialog.onOpen}
      className="relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer"
    >
      Sign Up
    </div>
  );

  const body = (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        <FormInputControl
          form={form}
          name="phone"
          disabled={form.formState.isSubmitting}
          label="Phone"
          placeholder="+84..."
        />

        <FormPassword
          form={form}
          name="password"
          disabled={form.formState.isSubmitting}
          label="Mật Khẩu"
          placeholder="Nhập mật khẩu"
        />

        <FormPassword
          form={form}
          name="confirmPassword"
          disabled={form.formState.isSubmitting}
          label="Xác Nhận Mật Khẩu"
          placeholder="Nhập lại mật khẩu"
        />

        <DialogFooter>
          <DialogClose asChild>
            <ButtonCustomized
              className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
              variant="outline"
              label="Cancel"
            />
          </DialogClose>

          <ButtonCustomized
            type="submit"
            className="max-w-32 bg-sky-500 hover:bg-sky-700"
            variant="secondary"
            label={
              form.formState.isSubmitting ? (
                <WaitingSpinner
                  variant="pinwheel"
                  label="Registering..."
                  className="font-semibold "
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                "Register"
              )
            }
          />
        </DialogFooter>

        <div className="my-2">
          <h2 className="flex font-semibold items-center justify-center gap-x-1">
            Already have an account?{" "}
            <h3
              // onClick={handleOpenLogin}
              onClick={toggle}
              className="text-base font-semibold hover:scale-105 cursor-pointer hover:font-bold hover:underline transition duration-300 hover:motion-preset-confetti  text-violet-500"
            >
              Login here
            </h3>
          </h2>
        </div>
      </FormValues>
    </div>
  );

  return (
    <DialogReused
      content={body}
      open={registerDialog.isOpen}
      onClose={registerDialog.onClose}
      // open={isRegisterOpen}
      asChild
      trigger={trigger}
      title={title}
      description="Lets login to get sale!"
    />
  );
};
