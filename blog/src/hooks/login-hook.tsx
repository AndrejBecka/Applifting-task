import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";

export const useLogin = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
      window.dispatchEvent(new Event("authChange"));
      toast.success("Logged in successfully");
      setError(null);
      router.push("/");
    },
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      const msg = err?.message ?? "Login failed";
      setError(msg);
      toast.error(msg);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.status === "pending",
    error,
  };
};
