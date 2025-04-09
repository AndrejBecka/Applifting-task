import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";

export const useLogin = () => {
  const router = useRouter();

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("Logged in successfully!");
      localStorage.setItem("token", data.access_token);
      // Dispatch auth change event
      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error?.message ?? "Login failed");
    },
  });

  const isLoading = loginMutation.status === "pending";

  return {
    login: loginMutation.mutate,
    isLoading,
  };
};
