import { number, string, z } from "zod";

export const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const isValidPhone = (phone: string) =>
  /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g.test(phone);

export const LoginSafeTypes = z.object({
  username: z.string().nonempty({
    message: "Vui lòng nhập tài khoản"
  }).email({
    message: "Email hoặc số điện thoại không hợp lệ"
  }).or(z.string().refine(isValidPhone, {
    message: "Email hoặc số điện thoại không hợp lệ",
  })),
  password: z.string({
    required_error: "Vui lòng nhập mật khẩu"
  }),
});

export const LoginSafeTypesHaveEmail = z.object({
  email: z.string({
    required_error: "Vui lòng nhập email"
  }).email({
    message: "Email không hợp lệ"
  }),
  password: z.string().nonempty({
    message: "Vui lòng nhập mật khẩu",
  }),
});


export const RegisterSafeTypes = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  name: z
    .string({
      required_error: "Vui lòng nhập họ và tên"
    }).nonempty({
      message: "Vui lòng nhập họ và tên"
    })
    .min(1, 'Vui lòng nhập họ và tên')
    .max(100, 'Họ và tên không thể dài quá 100 ký tự'),
  password: z.string({
    required_error: "Vui lòng nhập mật khẩu"
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tự" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
  type: z.string(),
  confirmPassword: z.string({
    required_error: "Vui lòng nhập xác nhận mật khẩu"
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tự" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
}).superRefine((values, ctx) => {
  const { phone, email, type } = values;

  const isValidPhone = (value: string) => /^[0-9]{10,11}$/.test(value);
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (type === "phone") {
    if (!phone) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng nhập số điện thoại",
        path: ["phone"],
      });
    } else if (!isValidPhone(phone)) {
      ctx.addIssue({
        code: "custom",
        message: "Số điện thoại không hợp lệ",
        path: ["phone"],
      });
    }
  }


  if (type === "email") {
    if (!email) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng nhập email",
        path: ["email"],
      });
    } else if (!isValidEmail(email)) {
      ctx.addIssue({
        code: "custom",
        message: "Email không hợp lệ",
        path: ["email"],
      });
    }
  }
})

export const UpdatePasswordSafeTypes = z.object({
  oldPassword: z.string({
    required_error: "Vui lòng nhập mật khẩu cũ"
  }).nonempty({
    message: "Vui lòng nhập mật khẩu cũ",
  }),
  newPassword: z.string({
    required_error: "Vui lòng nhập mật khẩu mới"
  }).nonempty({
    message: "Vui lòng nhập mật khẩu mới",
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
  confirmNewPassword: z.string({
    required_error: "Vui lòng nhập xác mật khẩu mới"
  }).nonempty({
    message: "Vui lòng nhập xác mật khẩu mới",
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmNewPassword"],
});

export const VerifySafeTypes = z.object({
  otp: z.string({ required_error: "Vui lòng nhập mã OTP" })
})

export const ForgetPasswordSafeTypes = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  type: z.string(),
}).superRefine((values, ctx) => {
  const { phone, email, type } = values;

  const isValidPhone = (value: string) => /^[0-9]{10,11}$/.test(value);
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (type === "phone") {
    if (!phone) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng nhập số điện thoại",
        path: ["phone"],
      });
    } else if (!isValidPhone(phone)) {
      ctx.addIssue({
        code: "custom",
        message: "Số điện thoại không hợp lệ",
        path: ["phone"],
      });
    }
  }

  if (type === "email") {
    if (!email) {
      ctx.addIssue({
        code: "custom",
        message: "Vui lòng nhập email",
        path: ["email"],
      });
    } else if (!isValidEmail(email)) {
      ctx.addIssue({
        code: "custom",
        message: "Email không hợp lệ",
        path: ["email"],
      });
    }
  }
})

export const NewPasswordSafeTypes = z.object({
  password: z.string({
    required_error: "Vui lòng nhập mật khẩu"
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
  confirmPassword: z.string({
    required_error: "Vui lòng nhập xác nhận mật khẩu"
  }).min(5, { message: "Mật khẩu lớn hơn hoặc bằng 5 kí tứ" }).max(32, { message: "Mật khẩu bé hơn hoặc bằng 32 kí tự" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Xác nhận mật khẩu không khớp",
  path: ["confirmPassword"],
})