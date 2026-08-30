"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter, Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordStrength } from "@/components/auth/password-strength";
import { toast } from "sonner";

export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const registerSchema = z
    .object({
      fullName: z.string().min(2, { message: t("auth.required") }),
      email: z.string().email({ message: t("auth.invalidEmail") }),
      username: z.string().min(3, { message: t("auth.required") }),
      password: z.string().min(6, { message: t("auth.required") }),
      confirmPassword: z.string().min(6, { message: t("auth.required") }),
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: t("auth.required")
      })
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.passwordsDoNotMatch"),
      path: ["confirmPassword"]
    });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false
    }
  });

  const passwordVal = watch("password");
  const acceptTermsVal = watch("acceptTerms");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await registerUser(data.fullName, data.email, data.username);
      setIsSuccess(true);
      toast.success("Account created successfully!");
      setTimeout(() => {
        router.push("/chat");
      }, 1500);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-card p-8 rounded-lg border shadow-sm text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">{t("auth.welcomeBack")}!</h2>
        <p className="text-sm text-muted-foreground">
          Your account has been created successfully. Redirecting you to chat...
        </p>
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-5 bg-card p-8 rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("auth.createAccount")}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="space-y-1">
          <Label htmlFor="fullName">{t("auth.fullName")}</Label>
          <Input
            id="fullName"
            disabled={isLoading}
            {...formRegister("fullName")}
            className={errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.fullName && (
            <p className="text-xs font-medium text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            {...formRegister("email")}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="username">{t("auth.username")}</Label>
          <Input
            id="username"
            disabled={isLoading}
            {...formRegister("username")}
            className={errors.username ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.username && (
            <p className="text-xs font-medium text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              {...formRegister("password")}
              className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-[50%] translate-y-[-50%] text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrength value={passwordVal} />
          {errors.password && (
            <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              disabled={isLoading}
              {...formRegister("confirmPassword")}
              className={`pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 top-[50%] translate-y-[-50%] text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-start space-x-2 pt-1">
          <Checkbox
            id="acceptTerms"
            checked={acceptTermsVal}
            onCheckedChange={(checked) => setValue("acceptTerms", !!checked)}
            disabled={isLoading}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="acceptTerms"
              className="text-xs font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t("auth.iAgreeToThe")}{" "}
              <Link href="#" className="underline text-primary hover:text-primary/80">
                {t("auth.termsOfService")}
              </Link>{" "}
              {t("auth.and")}{" "}
              <Link href="#" className="underline text-primary hover:text-primary/80">
                {t("auth.privacyPolicy")}
              </Link>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs font-medium text-destructive">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full pt-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("common.loading")}
            </>
          ) : (
            t("auth.register")
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        {t("auth.alreadyHaveAccount")}{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t("auth.signIn")}
        </Link>
      </p>
    </div>
  );
}

