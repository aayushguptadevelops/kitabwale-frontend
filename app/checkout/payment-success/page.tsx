"use client";

import { useGetOrderByIdQuery } from "@/store/api";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import confetti from "canvas-confetti";
import BookLoader from "@/components/book-loader";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle,
  MonitorDot,
  Package,
  Truck,
} from "lucide-react";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orderId } = useSelector((state: RootState) => state.checkout);
  const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId || "");

  useEffect(() => {
    if (!orderId) {
      router.push("/checkout/cart");
    } else {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
      });
    }
  }, [orderId, dispatch, router]);

  if (isLoading) {
    return <BookLoader />;
  }

  if (!orderId || !orderData) {
    return null;
  }

  const { totalAmount, items, status, createdAt } = orderData.data;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-opacity-90 bg-white shadow-2xl backdrop-blur-sm">
          <CardHeader className="border-b border-gray-200 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <CheckCircle className="h-12 w-12 text-green-500" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-green-700">
              Payment Successful!
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Order Details
                </h3>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">
                    Order Id:{" "}
                    <span className="font-medium text-blue-700">{orderId}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Date:{" "}
                    <span className="font-medium text-blue-700">
                      {new Date(createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Total Amount:{" "}
                    <span className="font-medium text-blue-700">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Items:{" "}
                    <span className="font-medium text-blue-700">
                      {items.length}
                    </span>
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="mb-2 font-semibold text-green-700">
                    Order Status
                  </h4>
                  <div className="flex items-center text-green-600">
                    <Package className="mr-2 h-5 w-5" />
                    <span className="text-sm font-medium">
                      {status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  What&apos;s Next?
                </h3>
                <ul className="space-y-3">
                  <motion.li
                    className="flex items-center text-gray-600"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                    <span className="text-sm">
                      You will receive an email confirmation shortly.
                    </span>
                  </motion.li>

                  <motion.li
                    className="flex items-center text-gray-600"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Truck className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="text-sm">
                      You order will be processed and shipped soon.
                    </span>
                  </motion.li>

                  <motion.li
                    className="flex items-center text-gray-600"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <MonitorDot className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-sm">
                      You can track your order status in your account.
                    </span>
                  </motion.li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 px-6 py-2 font-medium text-white shadow-lg transition duration-300 hover:shadow-xl"
                onClick={() => router.push("/")}
              >
                Continue Shopping
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;
