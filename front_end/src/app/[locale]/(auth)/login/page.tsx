import { LoginForm } from "@/components/auth/login-form";
import { PublicRoute } from "@/contexts/protected-route";

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <LoginForm />
      </div>
    </PublicRoute>
  );
}

