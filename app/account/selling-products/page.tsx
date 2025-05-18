"use client";

import BookLoader from "@/components/book-loader";
import NoData from "@/components/no-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useDeleteProductByIdMutation,
  useGetProductBySellerIdQuery,
} from "@/store/api";
import { RootState } from "@/store/store";
import { BookDetails } from "@/types";
import { IndianRupee, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const SellingProductsPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const { data: products, isLoading } = useGetProductBySellerIdQuery(user?._id);
  const [deleteProductById] = useDeleteProductByIdMutation();
  const [books, setBooks] = useState<BookDetails[]>([]);

  useEffect(() => {
    if (products?.success) {
      setBooks(products.data);
    }
  }, [products]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductById(productId).unwrap();
      toast.success("Book deleted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete book.");
    }
  };

  if (isLoading) {
    return <BookLoader />;
  }

  if (!books || books.length === 0) {
    return (
      <div className="mx-auto my-10 max-w-3xl justify-center">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="You haven't sold any books yet."
          description="Start selling your books to reach potential buyers. List your first book now and make it available to others."
          onClick={() => router.push("/book-sell")}
          buttonText="Sell Your First Book"
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-6">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold text-purple-600">
            Your Listed Books
          </h1>
          <p className="mb-4 text-xl text-gray-600">
            Manage and track your book listings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {books.map((product: BookDetails) => (
            <Card
              key={product?._id}
              className="overflow-hidden border-t-4 border-t-purple-500 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
                <CardTitle className="flex items-center text-xl text-purple-700">
                  <Package className="mr-2 h-5 w-5" />
                  {product.title}
                </CardTitle>
                <CardDescription>{product.subject}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <Image
                    src={product?.images?.[0]}
                    alt={product?.title}
                    width={80}
                    height={100}
                    className="w-60 rounded-lg object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Category: {product.category}
                  </p>
                  <p className="text-sm text-gray-600">
                    Class: {product.classType}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      <IndianRupee className="-mr-1" />
                      {product.finalPrice}
                    </Badge>
                    <span className="flex text-sm text-gray-500 line-through">
                      <IndianRupee className="mt-1 h-3 w-3" />
                      {product.price}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex bg-purple-50 p-4">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProduct(product?._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellingProductsPage;
