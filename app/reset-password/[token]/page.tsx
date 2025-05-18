"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "@/store/api";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLoginDialog } from "@/store/slice/user-slice";

interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const [resetPassword] = useResetPasswordMutation();
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setResetPasswordLoading(true);
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match.");
      setResetPasswordLoading(false);
      return;
    }

    try {
      await resetPassword({
        token: token,
        newPassword: data.newPassword,
      }).unwrap();
      setResetPasswordSuccess(true);
      toast.success("Password reset successfully!.");
    } catch (e) {
      toast.error("Password reset failed!");
      console.error(e);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-700">
          Reset Your Password
        </h2>

        {!resetPasswordSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                {...register("newPassword", {
                  required: "New Password is required.",
                })}
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                className="pl-10"
              />
              <Lock
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
                size={20}
              />
              {showPassword ? (
                <EyeOff
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-500"
                  size={20}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-500"
                  size={20}
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}

            <Input
              {...register("confirmPassword", {
                required: "Please Confirm Your Password.",
              })}
              placeholder="Confirm New Password"
              type="password"
              className="pl-10"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full transform rounded-md bg-blue-500 px-4 py-2 font-bold transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
            >
              {resetPasswordLoading ? (
                <Loader2 className="mr-2 animate-spin" size={20} />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 text-center"
          >
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Password Reset Successfully
            </h2>
            <p className="text-gray-500">
              Your password has been reset successfully. You can now log in with
              the new password.
            </p>
            <Button
              onClick={handleLoginClick}
              className="mt-4 transform rounded-full bg-blue-500 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
            >
              Go To Login
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
export default ResetPasswordPage;
