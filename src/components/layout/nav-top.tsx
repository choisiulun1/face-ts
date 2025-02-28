"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

export default function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<{ name: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    console.log("Fetching user...");

    const fetchUser = async () => {
      try {
        console.log("gg");
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return;
        }

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data?.user) {
          const userData = { name: data.user.email };
          setUser(userData as { name: string });
          sessionStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        console.log("Session:", session);
        fetchUser();
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]); // Dependency array ensures this runs only once

  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Logo & Title */}
          <Link href="/" className="text-lg font-semibold">
            Face Attendance
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-6">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>
            <NavLink href="/dashboard" pathname={pathname}>
              Dashboard
            </NavLink>
            <NavLink href="/reports" pathname={pathname}>
              Reports
            </NavLink>
          </div>

          {/* User Dropdown */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {user ? user.name : "Loading..."}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.name || "Loading..."}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={toggleMenu}>
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow-sm py-2">
            <div className="flex flex-col items-center space-y-3">
              <NavLink href="/" pathname={pathname} onClick={toggleMenu}>
                Home
              </NavLink>
              <NavLink
                href="/dashboard"
                pathname={pathname}
                onClick={toggleMenu}
              >
                Dashboard
              </NavLink>
              <NavLink href="/reports" pathname={pathname} onClick={toggleMenu}>
                Reports
              </NavLink>
              <button className="text-red-500 mt-2" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
      {children}
    </>
  );
}

// Reusable NavLink Component for Active Styling
function NavLink({
  href,
  pathname,
  children,
  onClick,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`text-gray-600 hover:text-gray-900 transition ${
        isActive ? "font-semibold border-b-2 border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
