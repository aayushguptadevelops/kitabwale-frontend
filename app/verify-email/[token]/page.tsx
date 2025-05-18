"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyEmailMutation } from "@/store/api";
import { RootState } from "@/store/store";
import { authStatus, setEmailVerified } from "@/store/slice/user-slice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyEmailPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();
  const isEmailVerified = useSelector(
    (state: RootState) => state.user.isEmailVerified,
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "alreadyVerified" | "failed"
  >("loading");

  useEffect(() => {
    const verify = async () => {
      if (isEmailVerified) {
        setVerificationStatus("alreadyVerified");
        return;
      }

      try {
        const result = await verifyEmail(token).unwrap();
        if (result.success) {
          dispatch(setEmailVerified(true));
          setVerificationStatus("success");
          dispatch(authStatus());
          toast.success("Email verified successfully!.");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          throw new Error(result.message || "Verification failed.");
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (token) {
      verify();
    }
  }, [token, verifyEmail, dispatch, isEmailVerified]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg"
      >
        {verificationStatus === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="mb-4 h-16 w-16 animate-spin text-blue-500" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Verifying your email
            </h2>
            <p className="text-gray-500">
              Please wait while we confirm your email address...
            </p>
          </div>
        )}
        {verificationStatus === "success" && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Email Verified
            </h2>
            <p className="text-gray-500">
              Your email has been successfully verified. You&#39;ll be
              redirecting to the homepage shortly.
            </p>
          </motion.div>
        )}
        {verificationStatus === "alreadyVerified" && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-800">
              Email Already Verified
            </h2>
            <p className="text-gray-500">
              Your email is already verified. You can use our services.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4 transform rounded-full bg-blue-500 py-2 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
            >
              Go To Homepage
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
export default VerifyEmailPage;
