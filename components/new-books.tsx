"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { BookDetails } from "@/types";
import { useGetProductsQuery } from "@/store/api";

const NewBooks = () => {
  const [currentBookSlide, setCurrentBookSlide] = useState(0);
  const [books, setBooks] = useState<BookDetails[]>([]);
  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});

  useEffect(() => {
    if (apiResponse.success) {
      setBooks(apiResponse.data);
    }
  }, [apiResponse]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentBookSlide((prev) => (prev - 1 + 3) % 3);
  };

  const nextSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1) % 3);
  };

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Newly Added Books
        </h2>
        <div className="relative">
          {books.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentBookSlide * 100}%)`,
                  }}
                >
                  {[0, 1, 2].map((slideIndex) => (
                    <div key={slideIndex} className="w-full flex-none">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {books
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((book) => (
                            <Card key={book._id} className="relative">
                              <CardContent className="p-4">
                                <Link href={`books/${book._id}`}>
                                  <div className="relative">
                                    <Image
                                      src={book.images[0]}
                                      alt={book.title}
                                      width={200}
                                      height={300}
                                      className="mb-4 h-[200px] w-full rounded-md object-cover"
                                    />
                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice,
                                    ) > 0 && (
                                      <span className="absolute top-2 left-0 rounded-r-lg bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                        {calculateDiscount(
                                          book.price,
                                          book.finalPrice,
                                        )}
                                        % Off
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="mb-2 line-clamp-2 text-sm font-medium">
                                    {book.title}
                                  </h3>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                      <span className="flex text-lg font-bold">
                                        <IndianRupee className="mt-1.5 ml-1 h-4 w-4" />
                                        {book.finalPrice}
                                      </span>
                                      {book.price && (
                                        <span className="text-muted-foreground flex text-sm line-through">
                                          <IndianRupee className="mt-1 ml-1 h-3 w-3" />
                                          {book.price}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-zinc-400">
                                      <span>{book.condition}</span>
                                    </div>
                                  </div>
                                  <div className="pt-4">
                                    <Button className="float-end mb-2 flex bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-600">
                                      Buy Now
                                    </Button>
                                  </div>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/*scroll button*/}
              <button
                className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/*dot animation*/}
              <div className="mt-8 flex justify-center space-x-2">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentBookSlide(dot)}
                    className={`h-3 w-3 rounded-full ${currentBookSlide === dot ? "bg-blue-600" : "bg-gray-300"}`}
                  ></button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No Books to display</p>
          )}
        </div>
      </div>
    </section>
  );
};
export default NewBooks;
