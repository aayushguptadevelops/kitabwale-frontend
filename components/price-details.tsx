import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  IndianRupee,
  Shield,
} from "lucide-react";

interface PriceDetailsProps {
  totalOriginalAmount: number;
  totalAmount: number;
  totalDiscount: number;
  shippingCharge: number;
  itemCount: number;
  isProcessing: boolean;
  step: "cart" | "address" | "payment";
  onProceed: () => void;
  onBack: () => void;
}

const PriceDetails: React.FC<PriceDetailsProps> = ({
  totalOriginalAmount,
  totalAmount,
  totalDiscount,
  shippingCharge,
  itemCount,
  isProcessing,
  step,
  onProceed,
  onBack,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="text-xl">
        <CardTitle>Price Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Price ({itemCount} items)</span>
          <span className="flex">
            <IndianRupee className="mt-1 h-4 w-4" />
            {totalOriginalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span className="flex">
            -
            <IndianRupee className="mt-1 h-4 w-4" />
            {totalDiscount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span
            className={`${shippingCharge === 0 ? "text-green-600" : "text-black"} flex`}
          >
            {shippingCharge !== 0 && <IndianRupee className="mt-1 h-4 w-4" />}
            {shippingCharge === 0 ? "Free" : `${shippingCharge.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between border-t pt-4 font-medium">
          <span>Total Amount</span>
          <span className="flex">
            <IndianRupee className="mt-1 h-4 w-4" />
            {totalAmount.toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          size="lg"
          disabled={isProcessing}
          onClick={onProceed}
        >
          {isProcessing ? (
            "Processing..."
          ) : step === "payment" ? (
            <>
              <CreditCard className="mr-2 h-4 w-4" /> Continue to Pay
            </>
          ) : (
            <>
              <ChevronRight className="mr-2 h-4 w-4" />
              {step === "cart" ? "Proceed to Checkout" : "Proceed to Payment"}
            </>
          )}
        </Button>
        {step !== "cart" && (
          <Button variant="outline" className="w-full" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>Safe and Secure Payments</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceDetails;
