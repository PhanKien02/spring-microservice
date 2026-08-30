import { RegisterForm } from "@/components/auth/register-form";
import { PublicRoute } from "@/contexts/protected-route";

export default function RegisterPage() {
  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <RegisterForm />
      </div>
    </PublicRoute>
  );
}

