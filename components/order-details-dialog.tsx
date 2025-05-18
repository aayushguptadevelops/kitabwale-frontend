import { Order } from "@/types";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Eye,
  IndianRupee,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";

interface OrderDetailsDialogProps {
  order: Order;
}

const StatusStep = ({
  title,
  icon,
  isCompleted,
  isActive,
}: {
  title: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
}) => {
  return (
    <div
      className={`flex flex-col items-center ${isCompleted ? "text-green-500" : isActive ? "text-blue-500" : "text-gray-400"}`}
    >
      <div
        className={`rounded-full p-2 ${isCompleted ? "bg-green-100" : isActive ? "bg-blue-100" : "bg-gray-100"}`}
      >
        {icon}
      </div>
      <span className="mt-1 text-xs">
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </span>
    </div>
  );
};

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order }) => {
  const getStatusIndex = (status: string) => {
    const statuses = ["processing", "shipped", "delivered", "cancelled"];
    return statuses.indexOf(status);
  };

  const statusIndex = getStatusIndex(order?.status);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-700">
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-4">
            <h3 className="mb-2 text-lg font-semibold text-purple-800">
              Order Status
            </h3>
            <div className="flex items-center justify-between">
              <StatusStep
                title="processing"
                icon={<Package className="h-5 w-5" />}
                isCompleted={statusIndex > 0}
                isActive={statusIndex === 0}
              />
              <div
                className={`h-1 flex-1 ${statusIndex > 0 ? "bg-green-500" : "bg-gray-300"}`}
              />

              <StatusStep
                title="shipped"
                icon={<Truck className="h-5 w-5" />}
                isCompleted={statusIndex > 1}
                isActive={statusIndex === 1}
              />
              <div
                className={`h-1 flex-1 ${statusIndex > 1 ? "bg-green-500" : "bg-gray-300"}`}
              />

              <StatusStep
                title="delivered"
                icon={<CheckCircle className="h-5 w-5" />}
                isCompleted={statusIndex > 2}
                isActive={statusIndex === 2}
              />
              {order?.status === "cancelled" && (
                <>
                  <div className="h-1 flex-1 bg-red-500" />
                  <StatusStep
                    title="cancelled"
                    icon={<XCircle className="h-5 w-5" />}
                    isCompleted={true}
                    isActive={true}
                  />
                </>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 p-4">
            <h3 className="mb-2 text-lg font-semibold text-blue-800">Items</h3>
            <div className="space-y-4">
              {order.items.map((items, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Image
                    src={items.product.images[0]}
                    alt={items.product.title}
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                  <div>
                    <p className="font-medium">{items.product.title}</p>
                    <div className="flex gap-2">
                      <p className="font-medium">{items.product.subject}</p>(
                      {order.items.map((item) => item.product.author).join(",")}
                      )
                    </div>
                    <p className="text-sm text-gray-600">
                      Quantity: {items.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-green-100 to-teal-100 p-4">
            <h3 className="mb-2 font-serif text-lg text-green-800">
              Shipping Address
            </h3>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order?.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 p-4">
            <h3 className="mb-2 font-serif text-lg text-green-800">
              Payment Details
            </h3>
            <p>Order ID: {order.paymentDetails.razorpay_order_id}</p>
            <p>Payment ID: {order.paymentDetails.razorpay_payment_id}</p>
            <p className="flex">
              Amount:
              <IndianRupee className="mt-1 ml-1 h-4 w-4" />
              {order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
