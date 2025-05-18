"use client";

import KitabLoader from "@/components/kitab-loader";
import NoData from "@/components/no-data";
import OrderDetailsDialog from "@/components/order-details-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUserOrdersQuery } from "@/store/api";
import { Order } from "@/types";
import { Calendar, CreditCard, IndianRupee, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const OrdersPage = () => {
  const [showAllOrders, setShowAllOrders] = useState(false);
  const { data: orderData, isLoading } = useGetUserOrdersQuery({});
  const router = useRouter();

  const orders: Order[] = orderData?.data || [];
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 10);

  if (isLoading) {
    return <KitabLoader />;
  }

  if (orders?.length === 0) {
    return (
      <div className="mx-auto my-10 max-w-3xl justify-center">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="You haven't order any books yet."
          description="Start order your books to reach potential buyers. order your first book now!"
          onClick={() => router.push("/books")}
          buttonText="Order Your First Book"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-lg">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">My Orders</h1>
        <p className="text-purple-100">View and manage your recent purchases</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {displayedOrders.map((order) => (
          <Card key={order?._id} className="flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center text-lg text-purple-700 sm:text-xl">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Order #{order?._id.slice(-6)}
              </CardTitle>
              <CardDescription className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {new Date(order?.createdAt).toLocaleDateString("en-IN")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <p className="font-medium">
                  {order?.items.map((item) => item.product.title).join(",")}
                </p>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>
                    {order?.items.map((item) => item.product.subject).join(",")}
                  </span>
                  <span>
                    {order?.items.map((item) => item.product.author).join(",")}
                  </span>
                </div>
                <p className="flex items-center text-sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Total:
                  <IndianRupee className="ml-1 h-4 w-4" />
                  {order?.totalAmount.toFixed(2)}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Status</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      order?.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order?.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : order?.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order?.status?.charAt(0).toUpperCase() +
                      order?.status?.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-purple-50">
              <OrderDetailsDialog order={order} />
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => setShowAllOrders(!showAllOrders)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {showAllOrders ? "Show Less" : "View All Orders"}
        </Button>
      </div>
    </div>
  );
};

export default OrdersPage;
