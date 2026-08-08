import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xl font-bold mb-3">EstateHub</p>
            <p className="text-sm text-paper/60 leading-relaxed">
              Property, presented properly. Buy, rent, and connect with verified agents.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-paper/40 mb-4">
              Explore
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/?listingType=sale#listings" className="text-paper/80 hover:text-accent transition-colors">
                Buy
              </Link>
              <Link href="/?listingType=rent#listings" className="text-paper/80 hover:text-accent transition-colors">
                Rent
              </Link>
              <Link href="/agents" className="text-paper/80 hover:text-accent transition-colors">
                Agents
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-paper/40 mb-4">
              Account
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/login" className="text-paper/80 hover:text-accent transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="text-paper/80 hover:text-accent transition-colors">
                Sign up
              </Link>
              <Link href="/favorites" className="text-paper/80 hover:text-accent transition-colors">
                Favorites
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-paper/40 mb-4">
              About
            </p>
            <p className="text-sm text-paper/60 leading-relaxed">
              A platform built for real estate agencies and their clients.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper/40">
            © {new Date().getFullYear()} EstateHub. Built by Malaika Amin.
          </p>
          <p className="text-xs text-paper/40 font-mono">EH — PROPERTY, PRESENTED PROPERLY</p>
        </div>
      </div>
    </footer>
  );
}