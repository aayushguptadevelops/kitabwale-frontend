"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Heart,
  IndianRupee,
  Loader2,
  MapPin,
  MessageCircle,
  ShoppingCart,
  User2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookDetails } from "@/types";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useGetProductByIdQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import BookLoader from "@/components/book-loader";
import NoData from "@/components/no-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart } from "@/store/slice/cart-slice";
import toast from "react-hot-toast";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/store/slice/wishlist-slice";
import { ShareButton } from "@/components/share";

const BookPage = () => {
  const params = useParams();
  const id = params.id;
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [book, setBook] = useState<BookDetails | null>(null);
  const {
    data: apiResponse = {},
    isLoading,
    isError,
  } = useGetProductByIdQuery(id);
  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    if (apiResponse.success) {
      setBook(apiResponse.data);
    }
  }, [apiResponse]);

  const handleAddToCart = async () => {
    if (book) {
      setIsAddToCart(true);
      try {
        const result = await addToCartMutation({
          productId: book?._id,
          quantity: 1,
        }).unwrap();
        if (result.success && result.data) {
          dispatch(addToCart(result.data));
          toast.success(result.message || "Added to cart successfully!.");
        } else {
          throw new Error(result.message || "Failed to add to cart.");
        }
      } catch (e: any) {
        const errorMessage = e?.data?.message;
        toast.error(errorMessage || "Failed to add to cart.");
      } finally {
        setIsAddToCart(false);
      }
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

  const bookImage = book?.images || [];

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (isLoading) {
    return <BookLoader />;
  }

  if (!book || isError) {
    return (
      <div className="mx-auto my-10 max-w-3xl justify-center">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="Loading...."
          description="Wait, we are fetching book details"
          onClick={() => router.push("/book-sell")}
          buttonText="Sell Your First Book"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-primary hover:underline">
            {" "}
            Home{" "}
          </Link>
          <span>/</span>
          <Link href="/books" className="text-primary hover:underline">
            Books
          </Link>
          <span>/</span>
          <span className="text-gray-600">{book.category}</span>
          <span>/</span>
          <span className="text-gray-600">{book.title}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative h-[400px] overflow-hidden rounded-lg border bg-white shadow-md">
              <Image
                src={bookImage[selectedImage]}
                alt={book.title}
                fill
                className="object-contain"
              />
              {calculateDiscount(book.price, book.finalPrice) > 0 && (
                <span className="absolute top-2 left-0 rounded-r-lg bg-orange-600/90 px-2 py-1 text-xs font-medium text-white hover:bg-orange-700">
                  {calculateDiscount(book.price, book.finalPrice)}% Off
                </span>
              )}
            </div>
            {/*overflow-x-auto to be removed*/}
            <div className="flex gap-2 overflow-x-auto">
              {bookImage.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-200 ${selectedImage === index ? "ring-primary scale-105 ring-2" : "hover:scale-105"}`}
                >
                  <Image
                    src={image}
                    alt={`${book.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/*book details*/}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <p className="text-muted-foreground text-sm">
                  Posted {formatDate(book.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <ShareButton
                  url={`${window.location.origin}/books/${book._id}`}
                  title={`Check out this book: ${book.title}`}
                  text={`I found this interesting book on KitabWale: ${book.title}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToWishlist(book._id)}
                >
                  <Heart
                    className={`mr-1 h-4 w-4 ${wishlist.some((w) => w.products.includes(book._id)) ? "fill-red-500" : ""}`}
                  />
                  <span className="hidden md:inline">
                    {wishlist.some((w) => w.products.includes(book._id))
                      ? "Remove"
                      : "Add"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="flex text-3xl font-bold">
                  <IndianRupee className="mt-2 h-6 w-6" />
                  {book.finalPrice.toFixed(2)}
                </span>
                {book.price && (
                  <span className="text-muted-foreground flex text-lg line-through">
                    <IndianRupee className="mt-1.5 h-4 w-4" />
                    {book.price.toFixed(2)}
                  </span>
                )}

                <Badge variant="secondary" className="text-green-600">
                  Shipping Available
                </Badge>
              </div>
              <Button
                className="w-60 bg-blue-700 py-6"
                onClick={handleAddToCart}
                disabled={isAddToCart}
              >
                {isAddToCart ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </>
                )}
              </Button>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Book Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-muted-foreground font-medium">
                      Subject/Title
                    </div>
                    <div>{book.subject}</div>
                    <div className="text-muted-foreground font-medium">
                      Course
                    </div>
                    <div>{book.classType}</div>
                    <div className="text-muted-foreground font-medium">
                      Category
                    </div>
                    <div>{book.category}</div>
                    <div className="text-muted-foreground font-medium">
                      Author
                    </div>
                    <div>{book.author}</div>
                    <div className="text-muted-foreground font-medium">
                      Edition
                    </div>
                    <div>{book.edition}</div>
                    <div className="text-muted-foreground font-medium">
                      Condition
                    </div>
                    <div>
                      {book.condition.charAt(0).toUpperCase() +
                        book.condition.slice(1)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{book.description}</p>
              <div className="border-t pt-4">
                <h3 className="mb-2 font-medium">Our Community</h3>
                <p className="text-muted-foreground">
                  We&#39;re not just another shopping website where you buy from
                  professional sellers - we are a vibrant community of students,
                  book lovers across India who deliver happiness to each other!
                </p>
              </div>
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <div>Ad Id: {book._id}</div>
                <div>Posted: {formatDate(book.createdAt)}</div>
              </div>
            </CardContent>
          </Card>

          {/*book seller details*/}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Sold By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <User2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{book.seller.name}</span>
                      <Badge variant="secondary" className="text-green-600">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {book.seller?.addresses?.[0]?.city
                        ? `${book.seller?.addresses?.[0]?.city}, ${book.seller?.addresses?.[0]?.state}`
                        : "Location Not Specified"}
                    </div>
                  </div>
                </div>
              </div>
              {book.seller.phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span>Contact: {book.seller.phoneNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/*how it works section*/}
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">How does it work?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "Step 1",
                title: "Seller posts an Ad",
                description:
                  "Seller posts an ad on KitabWale to sell their used books.",
                image: { src: "/icons/ads.png", alt: "Post Ad" },
              },
              {
                step: "Step 2",
                title: "Buyer Pays Online",
                description:
                  "Buyer makes an online payment to KitabWale to buy those books.",
                image: { src: "/icons/pay_online.png", alt: "Payment" },
              },
              {
                step: "Step 3",
                title: "Seller ships the books",
                description: "Seller then ships the books to the buyer",
                image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-none bg-gradient-to-br from-amber-50 to-amber-100"
              >
                <CardHeader>
                  <Badge className="mb-2 w-fit">{item.step}</Badge>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
export default BookPage;
