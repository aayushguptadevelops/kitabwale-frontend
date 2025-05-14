"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddProductsMutation } from "@/store/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Controller, useForm } from "react-hook-form";
import { BookDetails } from "@/types";
import toast from "react-hot-toast";
import { toggleLoginDialog } from "@/store/slice/user-slice";
import NoData from "@/components/no-data";
import Link from "next/link";
import {
  Book,
  Camera,
  ChevronRight,
  CreditCard,
  DollarSign,
  HelpCircle,
  Loader2,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filters } from "@/lib/constant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const Page = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addProducts, { isLoading }] = useAddProductsMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<BookDetails>({
    defaultValues: {
      images: [],
    },
  });

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const currentFiles = watch("images") || [];

      setUploadedImages((prevImage) =>
        [
          ...prevImage,
          ...newFiles.map((file) => URL.createObjectURL(file)),
        ].slice(0, 4),
      );

      setValue(
        "images",
        [...currentFiles, ...newFiles].slice(0, 4) as string[],
      );
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));

    const currentFiles = watch("images") || [];
    const uploadFiles = currentFiles.filter((_, i) => i !== index);
    setValue("images", uploadFiles);
  };

  const onSubmit = async (data: BookDetails) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value as string);
        }
      });

      if (data.paymentMode === "UPI") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ upiId: data.paymentDetails.upiId }),
        );
      } else if (data.paymentMode === "Bank Account") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ bankDetails: data.paymentDetails.bankDetails }),
        );
      }

      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append("images", image));
      }

      const result = await addProducts(formData).unwrap();
      if (result.success) {
        router.push(`books/${result.data._id}`);
        toast.success("Book added successfully!.");
        reset();
      }
    } catch (e) {
      toast.error("Failed to list the book, please try again later.");
      console.error(e);
    }
  };

  const paymentMode = watch("paymentMode");

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600">
            Sell Your Used Books
          </h1>
          <p className="mt-4 mb-4 text-xl text-gray-600">
            Submit a free classified ad to sell your used books for cash in
            India
          </p>
          <Link
            href="#"
            className="inline-flex items-center text-blue-500 hover:underline"
          >
            Learn How It Works
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Book Details */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-2xl text-blue-700">
                <Book className="mr-2 h-6 w-6" />
                Book Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                <Label
                  htmlFor="title"
                  className="mt-4 font-medium text-gray-700 md:w-1/4"
                >
                  Ad Title
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("title", {
                      required: "Title is required.",
                    })}
                    placeholder="Enter your ad title"
                    type="text"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                <Label
                  htmlFor="category"
                  className="mt-4 font-medium text-gray-700 md:w-1/4"
                >
                  Book Type
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Book type is required." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select a book type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.category.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                <Label
                  htmlFor="category"
                  className="mt-4 font-medium text-gray-700 md:w-1/4"
                >
                  Book Condition
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Book condition is required." }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        {filters.condition.map((condition) => (
                          <div
                            key={condition}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={condition.toLowerCase()}
                              id={condition.toLowerCase()}
                            />
                            <Label
                              htmlFor={condition.toLowerCase()}
                              className="font-medium text-gray-700 md:w-1/4"
                            >
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                <Label
                  htmlFor="classType"
                  className="mt-4 font-medium text-gray-700 md:w-1/4"
                >
                  For Class
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: "Class type is required." }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.classType.map((classType) => (
                            <SelectItem key={classType} value={classType}>
                              {classType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.classType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.classType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                <Label
                  htmlFor="subject"
                  className="mt-4 font-medium text-gray-700 md:w-1/4"
                >
                  Book Title/Subject
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("subject", {
                      required: "Subject is required.",
                    })}
                    placeholder="Enter your book name"
                    type="text"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="mt-4 mb-2 block font-medium text-gray-700">
                  Upload Photos
                </Label>
                <div className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-8 w-8 text-blue-500" />
                    <Label
                      htmlFor="images"
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                    >
                      Click here to upload upto 4 images (Size: 15MB max. each)
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      className="hidden"
                      accept="images/"
                      multiple
                      onChange={handleUploadImage}
                    />
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Book Image ${index + 1}`}
                            width={200}
                            height={200}
                            className="h-32 w-full rounded-lg border border-gray-200 object-cover"
                          />
                          <Button
                            onClick={() => removeImage(index)}
                            size="icon"
                            className="absolute -top-2 -right-2"
                            variant="destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Details */}
          <Card className="border-t-4 border-t-green-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center text-2xl text-green-700">
                <HelpCircle className="mr-2 h-6 w-6" />
                Optionals Details
              </CardTitle>
              <CardDescription>
                (Description, MRP, Author, etc...)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Book Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                        <Label
                          htmlFor="price"
                          className="mt-4 font-medium text-gray-700 md:w-1/4"
                        >
                          MRP
                        </Label>
                        <Input
                          {...register("price", {
                            required: "Book MRP is required.",
                          })}
                          placeholder="Enter book MRP"
                          type="text"
                          className="md:w-3/4"
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.price.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                        <Label
                          htmlFor="author"
                          className="mt-4 font-medium text-gray-700 md:w-1/4"
                        >
                          Author
                        </Label>
                        <Input
                          {...register("author")}
                          placeholder="Enter book author name"
                          type="text"
                          className="md:w-3/4"
                        />
                      </div>

                      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                        <Label
                          htmlFor="edition"
                          className="mt-4 font-medium text-gray-700 md:w-1/4"
                        >
                          Edition (Year)
                        </Label>
                        <Input
                          {...register("edition")}
                          placeholder="Enter book edition year"
                          type="text"
                          className="md:w-3/4"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Ad Description</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                        <Label
                          htmlFor="description"
                          className="font-medium text-gray-700 md:w-1/4"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          {...register("description")}
                          placeholder="Enter ad description"
                          className="mt-3 md:w-3/4"
                          rows={4}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card className="border-t-4 border-t-yellow-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="flex items-center text-2xl text-yellow-700">
                <DollarSign className="mr-2 h-6 w-6" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                <Label
                  htmlFor="finalPrice"
                  className="mt-4 font-medium text-gray-700 md:w-1/4"
                >
                  Your Price (₹)
                </Label>
                <div className="md:w-3/4">
                  <Input
                    id="finalPrice"
                    {...register("finalPrice", {
                      required: "Final Price is required.",
                    })}
                    placeholder="Enter your book final price"
                    type="text"
                  />
                  {errors.finalPrice && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.finalPrice.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2 md:flex-row md:items-start md:space-y-4">
                <Label className="mt-4 font-medium text-gray-700 md:w-1/4">
                  Shipping Charges
                </Label>
                <div className="space-y-3 md:w-3/4">
                  <div className="mt-1 flex items-center gap-4">
                    <Input
                      id="shippingCharge"
                      {...register("shippingCharge")}
                      placeholder="Enter shipping charges"
                      type="text"
                      className="w-full md:w-1/2"
                      disabled={watch("shippingCharge") === "free"}
                    />
                    <span className="text-sm">Or</span>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="shippingCharge"
                        control={control}
                        rules={{ required: "Book type is required." }}
                        render={({ field }) => (
                          <Checkbox
                            id="freeShipping"
                            checked={field.value === "free"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? "free" : "");
                            }}
                          />
                        )}
                      />
                      <Label htmlFor="freeShipping">Free Shipping</Label>
                    </div>
                  </div>
                  <p className="text-sm">
                    Buyers prefer free shipping or low shipping charges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="border-t-4 border-t-blue-500 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center text-2xl text-blue-700">
                <CreditCard className="mr-2 h-6 w-6" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                <Label className="mt-4 font-medium text-gray-700 md:w-1/4">
                  Payment Mode
                </Label>
                <div className="space-y-2 md:w-3/4">
                  <p className="mb-2 text-sm">
                    After your book is sold, in what mode would you like to
                    receive the payment?
                  </p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    rules={{ required: "Payment Mode is required." }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="UPI"
                            id="UPI"
                            {...register("paymentMode")}
                          />
                          <Label htmlFor="upi">UPI ID/Number</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Bank Account"
                            id="Bank Account"
                            {...register("paymentMode")}
                          />
                          <Label htmlFor="Bank Account">Bank Account</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.paymentMode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.paymentMode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* For UPI */}
              {paymentMode === "UPI" && (
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                  <Label
                    htmlFor="upiId"
                    className="mt-4 font-medium text-gray-700 md:w-1/4"
                  >
                    UPI ID/Number
                  </Label>
                  <Input
                    {...register("paymentDetails.upiId", {
                      required: "UPI ID is required.",
                      pattern: {
                        value: /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/,
                        message: "Invalid UPI ID format",
                      },
                    })}
                    placeholder="Enter your UPI ID"
                    type="text"
                  />
                  {errors.paymentDetails?.upiId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.paymentDetails?.upiId.message}
                    </p>
                  )}
                </div>
              )}

              {/* For Bank Account */}
              {paymentMode === "Bank Account" && (
                <>
                  <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                    <Label
                      htmlFor="accountNumber"
                      className="mt-4 font-medium text-gray-700 md:w-1/4"
                    >
                      Account Number
                    </Label>
                    <Input
                      {...register("paymentDetails.bankDetails.accountNumber", {
                        required: "Account Number is required.",
                        pattern: {
                          value: /^[0-9]{9,18}$/,
                          message: "Invalid account number",
                        },
                      })}
                      placeholder="Enter your account number"
                      type="text"
                    />
                    {errors.paymentDetails?.bankDetails?.accountNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {
                          errors.paymentDetails?.bankDetails?.accountNumber
                            .message
                        }
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                    <Label
                      htmlFor="ifscCode"
                      className="mt-4 font-medium text-gray-700 md:w-1/4"
                    >
                      IFSC Code
                    </Label>
                    <Input
                      {...register("paymentDetails.bankDetails.ifscCode", {
                        required: "IFSC code is required.",
                        pattern: {
                          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                          message: "Invalid IFSC code",
                        },
                      })}
                      placeholder="Enter your bank IFSC code"
                      type="text"
                    />
                    {errors.paymentDetails?.bankDetails?.ifscCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.paymentDetails?.bankDetails?.ifscCode.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-4">
                    <Label
                      htmlFor="bankName"
                      className="mt-4 font-medium text-gray-700 md:w-1/4"
                    >
                      Bank Name
                    </Label>
                    <Input
                      {...register("paymentDetails.bankDetails.bankName", {
                        required: "Bank name is required.",
                      })}
                      placeholder="Enter your bank name"
                      type="text"
                    />
                    {errors.paymentDetails?.bankDetails?.bankName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.paymentDetails?.bankDetails?.bankName.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading}
            className="text-md w-60 transform rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-6 font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:from-orange-600 hover:to-orange-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Saving...
              </>
            ) : (
              "Post Your Book"
            )}
          </Button>

          <p className="mt-2 text-center text-sm text-gray-600">
            By clicking &#34;Post Your Book&#34;, you agree to our{" "}
            <Link
              href="/terms-of-use"
              className="text-blue-500 hover:underline"
            >
              Terms of Use
            </Link>
            ,{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-500 hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Page;
