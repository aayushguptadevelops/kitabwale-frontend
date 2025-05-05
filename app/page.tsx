"use client";

import {
  ArrowRight,
  BookOpen,
  Camera,
  CreditCard,
  Library,
  Search,
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewBooks from "@/components/new-books";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const bannerImages = [
    "/images/book1.jpg",
    "/images/book2.jpg",
    "/images/book3.jpg",
  ];

  const blogPosts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "Where and how to sell old books online?",
      description:
        "Get started with selling your used books online and earn money from your old books.",
      icon: <BookOpen className="text-primary h-6 w-6" />,
    },
    {
      imageSrc:
        "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
      title: "What to do with old books?",
      description:
        "Learn about different ways to make use of your old books and get value from them.",
      icon: <Library className="text-primary h-6 w-6" />,
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "What is KitabWale?",
      description:
        "Discover how KitabWale helps you buy and sell used books online easily.",
      icon: <Store className="text-primary h-6 w-6" />,
    },
  ];

  const sellSteps = [
    {
      step: "Step 1",
      title: "Post an ad for selling used books",
      description:
        "Post an ad on KitabWale describing your book details to sell your old books online.",
      icon: <Camera className="text-primary h-8 w-8" />,
    },
    {
      step: "Step 2",
      title: "Set the selling price for your books",
      description:
        "Set the price for your books at which you want to sell them.",
      icon: <Tag className="text-primary h-8 w-8" />,
    },
    {
      step: "Step 3",
      title: "Get paid into your UPI/Bank account",
      description:
        "You will get money into your account once you receive an order for your book.",
      icon: <Wallet className="text-primary h-8 w-8" />,
    },
  ];

  const buySteps = [
    {
      step: "Step 1",
      title: "Select the used books you want",
      description:
        "Search from over thousands of used books listed on KitabWale.",
      icon: <Search className="text-primary h-8 w-8" />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className="text-primary h-8 w-8" />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className="text-primary h-8 w-8" />,
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={image}
              alt="banner"
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="mb-8 text-4xl font-bold md:text-6xl">
            Buy and Sell Old Books Online in India
          </h1>
          <div className="flex flex-col gap-6 sm:flex-row">
            <Button
              size="lg"
              className="group rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white hover:from-blue-700 hover:to-blue-800"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 p-2 transition-colors group-hover:bg-white/30">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <Link href="/books">
                  <div className="text-left">
                    <div className="text-sm opacity-90">Start Shopping</div>
                    <div className="font-semibold">Buy Used Books</div>
                  </div>
                </Link>
              </div>
            </Button>
            <Button
              size="lg"
              className="group rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-6 text-black hover:from-yellow-600 hover:to-yellow-700"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-black/20 p-2 transition-colors group-hover:bg-black/30">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <Link href="/book-sell">
                  <div className="text-left">
                    <div className="text-sm opacity-90">Start Selling</div>
                    <div className="font-semibold">Sell Old Books</div>
                  </div>
                </Link>
              </div>
            </Button>
          </div>
        </div>
      </section>

      <NewBooks />
      <Button
        size="lg"
        className="mx-auto mt-10 mb-10 flex rounded-xl bg-yellow-500 px-8 py-6"
      >
        <Link href="/books">
          <div className="text-sm">Explore All Books</div>
        </Link>
      </Button>

      {/*How to sell section*/}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              How to SELL your old books online on KitabWale?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Earning money by selling your old books is just 3 steps away from
              you :)
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute top-1/2 right-1/4 left-1/4 -z-10 hidden h-0.5 border-t-2 border-dashed border-gray-300 md:block" />
            {sellSteps.map((step, index) => (
              <div key={index} className="relative flex h-full flex-col">
                <div className="flex flex-grow flex-col rounded-xl bg-white p-8 text-center shadow-lg">
                  <div className="absolute top-2 left-14 z-10 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-medium text-gray-900">
                    {step.step}
                  </div>
                  <div className="bg-primary/10 mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="flex-grow text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*How to buy section*/}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              How to BUY second hand books online on KitabWale?
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Saving some good amount of money by buying used books is just 3
              steps away from you :)
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute top-1/2 right-1/4 left-1/4 -z-10 hidden h-0.5 border-t-2 border-dashed border-gray-300 md:block" />
            {buySteps.map((step, index) => (
              <div key={index} className="relative flex h-full flex-col">
                <div className="flex flex-grow flex-col rounded-xl bg-yellow-400 p-8 text-center shadow-lg">
                  <div className="absolute top-2 left-14 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-900">
                    {step.step}
                  </div>
                  <div className="bg-primary/10 mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="flex-grow text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Blog Post*/}
      <section className="bg-[rgb(221,234,254)] py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Read from our <span className="text-primary">Blog</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="flex h-full flex-col p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.imageSrc}
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-grow flex-col p-6">
                    <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold">
                      <div className="bg-primary/10 rounded-full p-2">
                        {post.icon}
                      </div>
                      <span className="flex-grow">{post.title}</span>
                    </h3>
                    <p className="flex-grow text-sm text-gray-600">
                      {post.description}
                    </p>
                    <Button
                      variant="link"
                      className="text-primary mt-4 flex items-center p-0"
                    >
                      Read more <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
