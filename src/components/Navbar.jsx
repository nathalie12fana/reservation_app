"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "./modeTogle/ModeToggle";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/appartements", label: "Appartements" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-white shadow-md"
            : "bg-gradient-to-r from-blue-600 to-indigo-500"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className={`text-2xl font-bold tracking-wide transition-colors
              ${scrolled ? "text-gray-800" : "text-white"}
            `}
          >
            APPART
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative transition-colors
                  ${
                    pathname === href
                      ? scrolled
                        ? "text-blue-600 font-semibold"
                        : "text-yellow-300 font-semibold"
                      : scrolled
                        ? "text-gray-700 hover:text-blue-600"
                        : "text-white hover:text-yellow-200"
                  }
                `}
              >
                {label}
              </Link>
            ))}

            {/* DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Menu
                    size={28}
                    className={scrolled ? "text-gray-700" : "text-white"}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <SignedOut>
                  <DropdownMenuItem>
                    <SignInButton />
                  </DropdownMenuItem>
                </SignedOut>

                <SignedIn>
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </SignedIn>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />
            <UserButton />
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={26} className={scrolled ? "text-gray-700" : "text-white"} />
            ) : (
              <Menu
                size={26}
                className={scrolled ? "text-gray-700" : "text-white"}
              />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md
                  ${
                    pathname === href
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
