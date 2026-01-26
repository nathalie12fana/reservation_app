"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

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

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

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
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem>
                      <span className="font-medium">👋 {user?.fullName}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">🎛️ Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/appartements">🏠 Mes Réservations</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      🚪 Déconnexion
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">🔑 Connexion</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">📝 Inscription</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />

            {/* USER BUTTON - Replaced Clerk UserButton */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${scrolled ? 'bg-gray-100' : 'bg-white/20'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${scrolled ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className={`text-sm font-medium ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  scrolled
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-blue-600 hover:bg-gray-100'
                }`}
              >
                Connexion
              </Link>
            )}
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

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-gray-700">
                    👋 {user?.fullName}
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      🎛️ Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    🚪 Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    🔑 Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    📝 Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}