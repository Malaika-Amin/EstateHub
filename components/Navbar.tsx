"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-stone/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight text-ink">
          Estate<span className="text-brass">Hub</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate">
          <Link href="/" className="hover:text-ink transition-colors">
            Browse
          </Link>
          {session && (
            <Link href="/favorites" className="hover:text-ink transition-colors">
              Favorites
            </Link>
          )}
        {role === "agent" && (
            <>
              <Link href="/agent/listings" className="hover:text-ink transition-colors">
                My Listings
              </Link>
              <Link href="/agent/listings/new" className="hover:text-ink transition-colors">
                New Listing
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden sm:inline text-xs font-mono uppercase tracking-wide text-slate">
                {role}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-ink hover:text-brass-dark transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink hover:text-brass-dark transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-ink text-stone px-4 py-2 rounded-full hover:bg-brass-dark transition-colors"
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