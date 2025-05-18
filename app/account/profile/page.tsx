"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUserMutation } from "@/store/api";
import { setUser } from "@/store/slice/user-slice";
import { RootState } from "@/store/store";
import { UserData } from "@/types";
import { Mail, Phone, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm<UserData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user, isEditing, reset]);

  const handleProfileEdit = async (data: UserData) => {
    const { name, phoneNumber } = data;
    try {
      const result = await updateUser({
        userId: user?._id,
        userData: { name, phoneNumber },
      }).unwrap();
      if (result && result?.data) {
        dispatch(setUser(result?.data));
        setIsEditing(false);
        toast.success("Profile updated successfully!.");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile!.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white shadow-lg">
        <h1 className="mb-2 text-4xl font-bold">My Profile</h1>
        <p className="text-pink-100">
          Manage your personal information and preferences
        </p>
      </div>

      <Card className="border-t-4 border-t-pink-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
          <CardTitle className="text-2xl text-pink-700">
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your profile details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={handleSubmit(handleProfileEdit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="username"
                    placeholder="John"
                    disabled={!isEditing}
                    className="pl-10"
                    {...register("name")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="email"
                    placeholder="john.doe@example.com"
                    disabled
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="phoneNumber"
                    placeholder="+1 234 567 890"
                    disabled={!isEditing}
                    className="pl-10"
                    {...register("phoneNumber")}
                  />
                </div>
              </div>
            </div>
            <CardFooter className="mt-4 flex justify-between bg-pink-50">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                  >
                    Discard Changes
                  </Button>

                  <Button
                    type="submit"
                    variant="outline"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
