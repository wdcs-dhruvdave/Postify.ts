"use client";
import {
  MESSAGES,
  PLACEHOLDERS,
  LABELS,
  ROUTES,
  CONFIG,
  TOKEN_KEY,
} from "@/constants/index";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/utils/Apis/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginForm } from "@/validations/login.form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginUser(data);
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success(MESSAGES.SUCCESS.LOGIN_SUCCESSFUL);
      router.push(ROUTES.FEED);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(MESSAGES.ERROR.GENERIC);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href={ROUTES.HOME}
            className="inline-block text-4xl font-bold text-blue-600"
          >
            Postify
          </Link>
          <p className="text-gray-500 mt-2">{MESSAGES.AUTH.LOGIN_SUBTITLE}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: CONFIG.ANIMATION.DURATION_MEDIUM,
            delay: CONFIG.ANIMATION.DELAY_SHORT,
          }}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                {...register("email")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                placeholder={PLACEHOLDERS.EMAIL}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                placeholder={PLACEHOLDERS.PASSWORD}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? LABELS.BUTTONS.LOGGING_IN : LABELS.BUTTONS.LOGIN}
            </button>
          </form>

          {/* <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
              <button type="button" className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  <GoogleIcon />
                  <span className="ml-3">Continue with Google</span>
              </button>
              <button type="button" className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  <Github className="h-5 w-5" />
                  <span className="ml-3">Continue with GitHub</span>
              </button>
          </div> */}

          <p className="text-center text-sm text-gray-600 mt-8">
            {MESSAGES.AUTH.DONT_HAVE_ACCOUNT}{" "}
            <Link
              href={ROUTES.SIGNUP}
              className="font-semibold text-blue-600 hover:underline"
            >
              {LABELS.BUTTONS.REGISTER}
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
