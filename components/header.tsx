"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BookLock,
  ChevronRight,
  FileTerminal,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Menu,
  Package,
  PiggyBank,
  Search,
  ShoppingCart,
  User,
  User2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleLoginDialog } from "@/store/slice/user-slice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen,
  );
  const user = {
    profilePicture: "",
    name: "Aayush Gupta",
    email: "aayushguptaworks@gmail.com",
  };
  const userPlaceholder = "";
  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };
  const handleLogout = () => {};
  const handleProtectionNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };
  const menuItems = [
    ...(user && user
      ? [
          {
            href: "account/profile",
            content: (
              <div className="flex items-center space-x-4 border-b p-2">
                <Avatar className="-ml-2 h-12 w-12 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage alt="user_image"></AvatarImage>
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-base font-semibold">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            ),
          },
        ]
      : [
          {
            icon: <Lock className="h-5 w-5" />,
            label: "Login/Sign Up",
            onClick: handleLoginClick,
          },
        ]),
    {
      icon: <User className="h-5 w-5" />,
      label: "My Profile",
      onClick: () => handleProtectionNavigation("/account/profile"),
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "My Orders",
      onClick: () => handleProtectionNavigation("/account/orders"),
    },
    {
      icon: <PiggyBank className="h-5 w-5" />,
      label: "My Selling Orders",
      onClick: () => handleProtectionNavigation("/account/selling-products"),
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Cart",
      onClick: () => handleProtectionNavigation("/checkout/cart"),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "My Wishlist",
      onClick: () => handleProtectionNavigation("/account/wishlist"),
    },
    {
      icon: <User2 className="h-5 w-5" />,
      label: "About Us",
      href: "/about-us",
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      label: "Terms & Use",
      href: "/terms-of-use",
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      href: "/how-it-works",
    },
    ...(user && [
      {
        icon: <LogOut className="h-5 w-5" />,
        label: "Logout",
        onClick: handleLogout,
      },
    ]),
  ];

  const MenuItems = ({ className = "" }) => (
    <div>
      {menuItems?.map((item, index) =>
        item?.href ? (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            {item.icon}
            <span>{item?.label}</span>
            {item?.content && <div className="mt-1">{item?.content}</div>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        ) : (
          <button
            key={index}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-200"
            onClick={item.onClick}
          >
            {item.icon}
            <span>{item?.label}</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </button>
        ),
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      {/* Desktop Header */}
      <div className="container mx-auto hidden w-[80%] items-center justify-between p-4 lg:flex">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/web-logo.png"
            alt="desktop_logo"
            width={450}
            height={100}
            className="h-15 w-auto"
          />
        </Link>
        <div className="flex max-w-xl flex-1 items-center justify-center px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Book Name / Author / Subject / Publisher"
              className="w-full pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1/2 right-0 -translate-y-1/2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/book-sell">
            <Button
              variant="secondary"
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              Sell Used Book
            </Button>
          </Link>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar className="h-8 w-8 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage alt="user_image"></AvatarImage>
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="mt-2 ml-2" />
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-2">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/checkout/cart">
            <div className="relative">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart
              </Button>
              {user && (
                <span className="absolute top-2 left-4 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-red-500 px-1 text-xs text-white">
                  3
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/*Mobile Header*/}
      <div className="container mx-auto flex items-center justify-between p-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <div className="border-b p-4">
              <Link href="/">
                <Image
                  src="/images/web-logo.png"
                  alt="mobile_logo"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <MenuItems className="py-2" />
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center">
          <Image
            src="/images/web-logo.png"
            alt="desktop_logo"
            width={450}
            height={100}
            className="h-6 w-20 md:h-10 md:w-auto"
          />
        </Link>
        <div className="flex max-w-xl flex-1 items-center justify-center px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search books..."
              className="w-full pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1/2 right-0 -translate-y-1/2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Link href="/checkout/cart">
          <div className="relative">
            <Button variant="ghost" className="relative">
              <ShoppingCart className="mr-2 h-5 w-5" />
            </Button>
            {user && (
              <span className="absolute top-2 left-4 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-red-500 px-1 text-xs text-white">
                3
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
