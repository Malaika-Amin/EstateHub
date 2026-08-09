"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-ink">
          EstateHub
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-ink">
          <Link href="/?listingType=sale#listings" className="hover:text-accent transition-colors">
            Buy
          </Link>
          <Link href="/?listingType=rent#listings" className="hover:text-accent transition-colors">
            Rent
          </Link>
          <Link href="/agents" className="hover:text-accent transition-colors">
            Agents
          </Link>
          {session && (
            <Link href="/favorites" className="hover:text-accent transition-colors">
              Favorites
            </Link>
          )}
          {role === "agent" && (
            <>
              <Link href="/agent/listings" className="hover:text-accent transition-colors">
                My Listings
              </Link>
             <Link href="/agent/listings/new" className="hover:text-accent transition-colors">
                New Listing
              </Link>
              <Link href="/agent/bookings" className="hover:text-accent transition-colors">
                Bookings
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-ink hover:text-accent transition-colors"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink hover:text-accent transition-colors">
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-ink text-paper px-5 py-2.5 rounded-full hover:bg-accent transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}