"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

import { createClient } from "@/lib/supabase/client";

interface LoginFormInput {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>();

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    clearErrors("root");

    const supabase = createClient();
    const { email, password } = data;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error) {
      setError("root.auth", {
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <div className="flex flex-col items-center px-6 py-8 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 shadow focus-within:shadow-lg transition duration-300">
      <h1 className="text-2xl font-bold mb-2">Login</h1>
      <p className="mb-6 text-center text-neutral-700 dark:text-neutral-300">
        Enter your email below to login to your account
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 w-full space-y-4">
        <div className="flex flex-col gap-1">
          <label className="font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email address is required" })}
            className="px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded"
          />
          <p className="text-xs text-red-500">{errors.email?.message}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded"
          />
          <p className="text-xs text-red-500">{errors.password?.message}</p>
        </div>
        {errors.root?.auth && (
          <p className="text-center text-sm text-red-500 mb-4">
            {errors.root?.auth?.message}
          </p>
        )}
        <input
          type="submit"
          value="Submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 rounded bg-black dark:bg-white text-white dark:text-black cursor-pointer disabled:cursor-not-allowed"
        />
      </form>
    </div>
  );
}
