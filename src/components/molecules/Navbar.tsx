"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, User, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const navItems = [
  { name: "Hjem", href: "/" },
  { name: "Om oss", href: "#about", hasDropdown: true },
  { name: "Viner", href: "/viinit-luettelo" },
  { name: "Kontakt oss", href: "/ota-yhteytta" },
  { name: "In English", href: "/in-english" },
];

const aboutUsSubItems = [
  { name: "Selskapsprofil", href: "/yrityksen-profiili" },
  { name: "Vårt team", href: "/tiimimme" },
];

export default function Navbar() {
  const session = useSession();
  const role = session?.data?.user?.role;
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const toggleSubmenu = (name: string) => {
    if (openSubmenu === name) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(name);
    }
  };

  return (
    <header className="flex h-16 w-full items-center px-3 md:px-5 lg:px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0" prefetch={false}>
        <Image
          src="/images/cw-black.svg"
          width={150}
          height={150}
          alt="Logo"
          className="w-24 h-auto sm:w-30 md:w-36 lg:w-40 object-contain"
          priority
        />
      </Link>
      {/* Mobile Menu */}
      <div className="ml-auto lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            {/* Visible title for accessibility */}
            <SheetTitle className="text-lg font-bold">Meny</SheetTitle>
            <div className="grid gap-2.5 py-5">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className="flex w-full items-center justify-between py-2.5 text-sm sm:text-base font-semibold hover:text-gray-600 transition-colors"
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSubmenu === item.name && (
                        <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                          {aboutUsSubItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block py-2 text-sm hover:text-gray-600 transition-colors"
                              prefetch={false}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex w-full items-center py-2.5 text-sm sm:text-base font-semibold hover:text-gray-600 transition-colors"
                      prefetch={false}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden lg:flex items-center gap-6 xl:gap-8">
        {navItems.map((item) => (
          <div key={item.name} className="relative">
            {item.hasDropdown ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`group inline-flex h-9 items-center justify-center rounded-md bg-white px-4 xl:px-5 py-1.5 text-sm lg:text-sm xl:text-base font-medium transition-colors hover:bg-gray-50 focus:bg-gray-100 focus:text-gray-900`}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 h-3 w-3" />
                    <span
                      className={`absolute bottom-0 left-1/2 h-0.5 w-1/2 bg-black scale-x-0 -translate-x-1/2 transition-transform duration-300 ease-in-out group-hover:scale-x-100`}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {aboutUsSubItems.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link
                        href={subItem.href}
                        className="w-full cursor-pointer text-sm"
                        prefetch={false}
                      >
                        {subItem.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={item.href}
                className={`relative group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 xl:px-5 py-1.5 text-sm lg:text-sm xl:text-base font-medium transition-colors hover:bg-gray-50 focus:bg-gray-100 focus:text-gray-900`}
                prefetch={false}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 w-1/2 bg-black scale-x-0 -translate-x-1/2 transition-transform duration-300 ease-in-out group-hover:scale-x-100 ${
                    pathname === item.href ? "scale-x-100" : ""
                  }`}
                />
              </Link>
            )}
          </div>
        ))}
        {role === "ADMIN" && (
          <Link href={"/admin/dashboard"} className="cursor-pointer ml-4">
            <User className="h-5 w-5 hover:text-gray-600 transition-colors" />
          </Link>
        )}
      </nav>
    </header>
  );
}
