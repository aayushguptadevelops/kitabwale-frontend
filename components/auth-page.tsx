"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  BASE_URL,
  useForgotPasswordMutation,
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authStatus, toggleLoginDialog } from "@/store/slice/user-slice";
import { useRouter } from "next/navigation";

interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

interface forgotPasswordFormData {
  email: string;
}

const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {
  const [currentTab, setCurrentTab] = useState<"login" | "signup" | "forgot">(
    "login",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm<LoginFormData>();
  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpError },
  } = useForm<SignUpFormData>();
  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordError },
  } = useForm<forgotPasswordFormData>();

  const onSubmitSignUp = async (data: SignUpFormData) => {
    setSignupLoading(true);

    try {
      const { name, email, password, agreeTerms } = data;
      const result = await register({
        name,
        email,
        password,
        agreeTerms,
      }).unwrap();
      if (result.success) {
        toast.success(
          "Verification link sent to email successfully. Please verify your email.",
        );
        dispatch(toggleLoginDialog());
        router.push("/");
      }
    } catch (e) {
      console.error(e);
      toast.error("Email already registered.");
    } finally {
      setSignupLoading(false);
    }
  };

  const onSubmitLogin = async (data: LoginFormData) => {
    setLoginLoading(true);

    try {
      const result = await login(data).unwrap();
      if (result.success) {
        toast.success("Logged in successfully!.");
        dispatch(toggleLoginDialog());
        dispatch(authStatus());
        router.push("/");
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      toast.error("Email or Password is incorrect.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      router.push(`${BASE_URL}/auth/google`);
      dispatch(authStatus());
      dispatch(toggleLoginDialog());
      setTimeout(() => {
        toast.success("Google Login successful!.");
        setIsLoginOpen(false);
        router.push("/");
      }, 3000);
    } catch (e) {
      console.error(e);
      toast.error("Email or Password is incorrect.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmitForgotPassword = async (data: forgotPasswordFormData) => {
    setForgotPasswordLoading(true);

    try {
      const result = await forgotPassword(data).unwrap();
      if (result.success) {
        toast.success("Password reset link sent to your email successfully!.");
        setForgotPasswordSuccess(true);
      }
    } catch (e) {
      console.error(e);
      toast.error(
        "Failed to send the password reset link to your email. Please try later.",
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="p-6 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4 text-center text-2xl font-bold">
            Welcome to KitabWale
          </DialogTitle>
          <Tabs
            value={currentTab}
            onValueChange={(value) =>
              setCurrentTab(value as "login" | "signup" | "forgot")
            }
          >
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="forgot">Forgot</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="login" className="space-y-4">
                  <form
                    onSubmit={handleLoginSubmit(onSubmitLogin)}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Input
                        {...registerLogin("email", {
                          required: "Email is required.",
                        })}
                        placeholder="Email"
                        type="email"
                        className="pl-10"
                      />
                      <Mail
                        className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
                        size={20}
                      />
                    </div>
                    {loginError.email && (
                      <p className="text-sm text-red-500">
                        {loginError.email.message}
                      </p>
                    )}

                    <div className="relative">
                      <Input
                        {...registerLogin("password", {
                          required: "Password is required.",
                        })}
                        placeholder="Password"
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
                    {loginError.password && (
                      <p className="text-sm text-red-500">
                        {loginError.password.message}
                      </p>
                    )}

                    <Button type="submit" className="w-full font-bold">
                      {loginLoading ? (
                        <Loader2 className="mr-2 animate-spin" size={20} />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                  <div className="my-4 flex items-center">
                    <div className="h-px flex-1 bg-gray-300"></div>
                    <p className="mx-2 text-sm text-gray-500">Or</p>
                    <div className="h-px flex-1 bg-gray-300"></div>
                  </div>
                  <Button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    {googleLoading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={20} />
                        Login with Google...
                      </>
                    ) : (
                      <>
                        <Image
                          src="/icons/google.svg"
                          alt="google"
                          width={20}
                          height={20}
                        />
                        Login with Google
                      </>
                    )}
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="space-y-4">
                  <form
                    onSubmit={handleSignUpSubmit(onSubmitSignUp)}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Input
                        {...registerSignUp("name", {
                          required: "Name is required.",
                        })}
                        placeholder="Name"
                        type="text"
                        className="pl-10"
                      />
                      <User
                        className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
                        size={20}
                      />
                    </div>
                    {signUpError.name && (
                      <p className="text-sm text-red-500">
                        {signUpError.name.message}
                      </p>
                    )}

                    <div className="relative">
                      <Input
                        {...registerSignUp("email", {
                          required: "Email is required.",
                        })}
                        placeholder="Email"
                        type="email"
                        className="pl-10"
                      />
                      <Mail
                        className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
                        size={20}
                      />
                    </div>
                    {signUpError.email && (
                      <p className="text-sm text-red-500">
                        {signUpError.email.message}
                      </p>
                    )}

                    <div className="relative">
                      <Input
                        {...registerSignUp("password", {
                          required: "Password is required.",
                        })}
                        placeholder="Password"
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
                    {signUpError.password && (
                      <p className="text-sm text-red-500">
                        {signUpError.password.message}
                      </p>
                    )}

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...registerSignUp("agreeTerms", {
                          required:
                            "You must agree to the terms and conditions.",
                        })}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">
                        I agree to the Terms and Conditions
                      </label>
                    </div>
                    {signUpError.agreeTerms && (
                      <p className="text-sm text-red-500">
                        {signUpError.agreeTerms.message}
                      </p>
                    )}

                    <Button type="submit" className="w-full font-bold">
                      {signupLoading ? (
                        <Loader2 className="mr-2 animate-spin" size={20} />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="forgot" className="space-y-4">
                  {!forgotPasswordSuccess ? (
                    <form
                      className="space-y-4"
                      onSubmit={handleForgotPasswordSubmit(
                        onSubmitForgotPassword,
                      )}
                    >
                      <div className="relative">
                        <Input
                          {...registerForgotPassword("email", {
                            required: "Email is required.",
                          })}
                          placeholder="Email"
                          type="email"
                          className="pl-10"
                        />
                        <Mail
                          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
                          size={20}
                        />
                      </div>
                      {forgotPasswordError.email && (
                        <p className="text-sm text-red-500">
                          {forgotPasswordError.email.message}
                        </p>
                      )}

                      <Button type="submit" className="w-full font-bold">
                        {forgotPasswordLoading ? (
                          <Loader2 className="mr-2 animate-spin" size={20} />
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 text-center"
                    >
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                      <h3 className="text-xl font-semibold text-gray-700">
                        Reset Link Sent
                      </h3>
                      <p className="text-gray-500">
                        We&#39;ve sent a password reset link to your email.
                        Please check your inbox and follow the instructions to
                        reset your password.
                      </p>
                      <Button
                        onClick={() => setForgotPasswordSuccess(false)}
                        className="w-full"
                      >
                        Send Another Link To Email
                      </Button>
                    </motion.div>
                  )}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>

          <p className="mt-2 text-center text-sm text-gray-600">
            By clicking &#34;agree&#34;, you agree to our{" "}
            <Link
              href="/terms-of-use"
              className="text-blue-500 hover:underline"
            >
              Terms of Use
            </Link>
            ,{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-500 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default AuthPage;
