"use client";

import { useTranslations } from "next-intl";

interface PasswordStrengthProps {
  value: string;
}

export function PasswordStrength({ value }: PasswordStrengthProps) {
  const t = useTranslations("auth");

  if (!value) return null;

  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { label: t("weak"), color: "bg-destructive", width: "w-1/3" };
    if (score <= 4) return { label: t("medium"), color: "bg-amber-500", width: "w-2/3" };
    return { label: t("strong"), color: "bg-emerald-500", width: "w-full" };
  };

  const strength = getStrength(value);

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-muted-foreground">{t("passwordStrength")}:</span>
        <span className={strength.color.replace("bg-", "text-")}>
          {strength.label}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
      </div>
    </div>
  );
}

