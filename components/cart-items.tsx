import { CartItem } from "@/types";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, IndianRupee, Trash2 } from "lucide-react";

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: { products: string[] }[];
}

const CartItems: React.FC<CartItemsProps> = ({
  items,
  onRemoveItem,
  onToggleWishlist,
  wishlist,
}) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex flex-col gap-4 border-b py-4 last:border-0 md:flex-row"
        >
          <Link href={`/books/${item.product._id}`}>
            <Image
              src={item?.product?.images?.[0]}
              alt={item?.product?.title}
              width={80}
              height={100}
              className="w-60 rounded-xl object-contain"
            />
          </Link>
          <div className="flex-1">
            <h3 className="font-medium">{item.product.title}</h3>
            <div className="mt-1 text-sm text-gray-500">
              Quantity: {item.quantity}
            </div>
            <div className="mt-1 flex font-medium">
              <span className="mr-2 flex text-gray-500 line-through">
                <IndianRupee className="mt-1 h-4 w-4" />
                {item.product.price.toFixed(2)}
              </span>
              <IndianRupee className="mt-1 h-4 w-4" />
              {item.product.finalPrice.toFixed(2)}
            </div>
            <div className="mt-1 flex text-sm text-green-600">
              {item.product.shippingCharge !== "free" && (
                <>
                  Shipping:
                  <IndianRupee className="mt-0.5 ml-1 h-4 w-4" />
                </>
              )}
              {item.product.shippingCharge === "free"
                ? "Free Shipping"
                : `${parseFloat(item.product.shippingCharge).toFixed(2)}`}
            </div>

            <div className="mt-2 flex gap-2">
              <Button
                className="w-[100px] md:w-[200px]"
                variant="outline"
                size="sm"
                onClick={() => onRemoveItem(item.product._id)}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                <span className="hidden md:inline">Remove</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleWishlist(item.product._id)}
              >
                <Heart
                  className={`mr-1 h-4 w-4 ${wishlist.some((w) => w.products.includes(item.product._id)) ? "fill-red-500" : ""}`}
                />
                <span className="hidden md:inline">
                  {wishlist.some((w) => w.products.includes(item.product._id))
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

export default CartItems;
