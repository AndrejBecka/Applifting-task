import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";

export const useLogin = () => {
  const router = useRouter();

  const { mutate, status } = api.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("Logged in successfully!");
      localStorage.setItem("token", data.access_token);
      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    },
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      toast.error(err.message ?? "Login failed");
    },
  });

  return {
    login: mutate,
    isLoading: status === "pending",
    isError: status === "error",
    isSuccess: status === "success",
  };
};
