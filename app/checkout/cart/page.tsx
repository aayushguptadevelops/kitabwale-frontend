"use client";

import BookLoader from "@/components/book-loader";
import CartItems from "@/components/cart-items";
import CheckoutAddress from "@/components/checkout-address";
import NoData from "@/components/no-data";
import PriceDetails from "@/components/price-details";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAddToWishlistMutation,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useGetCartQuery,
  useGetOrderByIdQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { clearCart, setCart } from "@/store/slice/cart-slice";
import {
  resetCheckout,
  setCheckoutStep,
  setOrderId,
} from "@/store/slice/checkout-slice";
import { toggleLoginDialog } from "@/store/slice/user-slice";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/store/slice/wishlist-slice";
import { RootState } from "@/store/store";
import { Address } from "@/types";
import { ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { orderId, step } = useSelector((state: RootState) => state.checkout);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(
    user?._id,
  );
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(
    orderId || "",
  );
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (orderData && orderData.shippingAddress) {
      setSelectedAddress(orderData.shippingAddress);
    }
  }, [orderData]);

  useEffect(() => {
    if (step === "address" && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step]);

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeCartMutation(productId).unwrap();
      if (result.success) {
        dispatch(setCart(result.data));
        toast.success(
          result.message || "Item removed from cart successfully!.",
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove item from cart.");
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId),
      );
      if (isWishlist) {
        const result = await removeFromWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishlistAction(productId));
          toast.success(result.message || "Removed from wishlist.");
        } else {
          throw new Error(result.message || "Failed to remove from wishlist.");
        }
      } else {
        const result = await addToWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(addToWishlistAction(result.data));
          toast.success(result.message || "Added to wishlist.");
        } else {
          throw new Error(result.message || "Failed to add to wishlist.");
        }
      }
    } catch (e: any) {
      const errorMessage = e?.data?.message;
      toast.error(errorMessage || "Failed to add to wishlist.");
    }
  };

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.finalPrice * item.quantity,
    0,
  );
  const totalOriginalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const totalDiscount = totalOriginalAmount - totalAmount;
  const shippingCharge = cart.items.map((item) =>
    item.product.shippingCharge.toLowerCase() === "free"
      ? 0
      : parseFloat(item.product.shippingCharge) || 0,
  );
  const maxShippingCharge = Math.max(...shippingCharge, 0);
  const finalAmount = totalAmount + maxShippingCharge;

  const handleProceedToCheckout = async () => {
    if (step === "cart") {
      try {
        const result = await createOrUpdateOrder({
          orderData: { items: cart.items, totalAmount: finalAmount },
        }).unwrap();
        if (result.success) {
          toast.success(result.message || "Order created successfully.");
          dispatch(setOrderId(result.data._id));
          dispatch(setCheckoutStep("address"));
        } else {
          throw new Error(result.message || "Failed to create order.");
        }
      } catch (e) {
        toast.error("Failed to create an order.");
        console.error(e);
      }
    } else if (step === "address") {
      if (selectedAddress) {
        dispatch(setCheckoutStep("payment"));
      } else {
        setShowAddressDialog(true);
      }
    } else if (step === "payment") {
      handlePayment();
    }
  };

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
    if (orderId) {
      try {
        await createOrUpdateOrder({
          orderData: { orderId, shippingAddress: address },
        }).unwrap();
        toast.success("Address updated successfully.");
      } catch (e) {
        console.error(e);
        toast.error("Failed to update address.");
      }
    }
  };

  const handlePayment = async () => {
    if (!orderId) {
      toast.error("No order found. Please try again later.");
      return;
    }
    setIsProcessing(true);
    try {
      const { data, error } = await createRazorpayPayment(orderId);
      console.log("Payment data:", data);
      if (error) {
        throw new Error("Failed to create razorpay order.");
      }
      const razorpayOrder = data.data.order;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Kitab Wale",
        description: "Payment for your Book Purchase",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const result = await createOrUpdateOrder({
              orderData: {
                orderId,
                paymentDetails: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              },
            }).unwrap();
            if (result.success) {
              dispatch(clearCart());
              dispatch(resetCheckout());
              toast.success("Payment successful!.");
              router.push(`/checkout/payment-success?orderId=${orderId}`);
            } else {
              throw new Error(result.message || "Payment failed.");
            }
          } catch (e) {
            console.error("Failed to update order:", e);
            toast.error("Payment Success, but order update failed.");
          }
        },
        prefill: {
          name: orderData?.data?.user?.name,
          email: orderData?.data?.user?.email,
          contact: orderData?.data?.user?.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (e) {
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your cart is empty."
        description="Looks like you haven't added any items yet. 
            Explore our collection and find something you love!"
        buttonText="Browse Books"
        imageUrl="/images/cart.webp"
        onClick={() => router.push("/books")}
      />
    );
  }

  if (isCartLoading || isOrderLoading) {
    return <BookLoader />;
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="min-h-screen bg-white">
        <div className="mb-8 bg-gray-100 px-6 py-4">
          <div className="container mx-auto flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6 text-gray-600" />
            <span className="text-lg font-semibold text-gray-800">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
              in your cart
            </span>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "cart" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <span className="hidden font-medium md:inline">Cart</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "address" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="hidden font-medium md:inline">Address</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "payment" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="hidden font-medium md:inline">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                  <CardDescription>Review your items</CardDescription>
                </CardHeader>
                <CardContent>
                  <CartItems
                    items={cart.items}
                    onRemoveItem={handleRemoveItem}
                    onToggleWishlist={handleAddToWishlist}
                    wishlist={wishlist}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <PriceDetails
                totalOriginalAmount={totalOriginalAmount}
                totalAmount={finalAmount}
                totalDiscount={totalDiscount}
                shippingCharge={maxShippingCharge}
                itemCount={cart.items.length}
                isProcessing={isProcessing}
                step={step}
                onProceed={handleProceedToCheckout}
                onBack={() =>
                  dispatch(
                    setCheckoutStep(step === "address" ? "cart" : "address"),
                  )
                }
              />

              {selectedAddress && (
                <Card className="mt-6 mb-6 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p>{selectedAddress?.addressLine1}</p>
                      {selectedAddress?.addressLine2 && (
                        <p>{selectedAddress?.addressLine2}</p>
                      )}
                      <p>
                        {selectedAddress.city}, {selectedAddress.state} -{" "}
                        {selectedAddress.pincode}
                      </p>
                      <p>Contact: {selectedAddress.phoneNumber}</p>
                    </div>
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => setShowAddressDialog(true)}
                    >
                      <MapPin className="mr-2 h-4 w-4" /> Change Address
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Select or Add Delivery Address</DialogTitle>
              </DialogHeader>
              <CheckoutAddress
                onAddressSelect={handleSelectAddress}
                selectedAddressId={selectedAddress?._id}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default CartPage;
