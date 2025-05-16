import { useAddOrUpdateAddressMutation, useGetAddressQuery } from "@/store/api";
import { Address } from "@/types";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import BookLoader from "@/components/book-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    addresses: Address[];
  };
}

const addressFormSchema = z.object({
  addressLine1: z
    .string()
    .min(5, "Address line 1 must be at least 5 characters."),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters."),
  state: z.string().min(2, "State must be at least 2 characters."),
  pincode: z.string().min(6, "Pincode must be at least 6 digits."),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits."),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface CheckoutAddressProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  onAddressSelect,
  selectedAddressId,
}) => {
  const { data: addressData, isLoading } = useGetAddressQuery() as {
    data: AddressResponse | undefined;
    isLoading: boolean;
  };
  const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const addresses = addressData?.data?.addresses || [];

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      phoneNumber: "",
    },
  });

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    form.reset(address);
    setShowAddressForm(true);
  };

  const onSubmit = async (data: AddressFormValues) => {
    try {
      let result;
      if (editingAddress) {
        const updateAddress = {
          ...editingAddress,
          ...data,
          addressId: editingAddress._id,
        };
        result = await addOrUpdateAddress(updateAddress).unwrap();
      } else {
        result = await addOrUpdateAddress(data).unwrap();
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <BookLoader />;
  }

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {addresses.map((address: Address) => (
          <Card
            key={address._id}
            className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddressId === address._id ? "border-blue-500 shadow-lg" : "border-gray-200 shadow-md hover:shadow-lg"}`}
          >
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={selectedAddressId === address._id}
                  onCheckedChange={() => onAddressSelect(address)}
                  className="h-5 w-5"
                />
                <div className="flex items-center justify-between">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Pencil className="hover: h-5 w-5 text-gray-600 hover:text-blue-500" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>{address?.addressLine1}</p>
                {address?.addressLine2 && <p>{address?.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="mt-2 font-medium">
                  Contact: {address.phoneNumber}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" />{" "}
            {editingAddress ? "Edit Address" : "Add New Address"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Street Address, House Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartment, Suite, Unit, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your 10 digit mobile number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {editingAddress ? "Update Address" : "Add New Address"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutAddress;
