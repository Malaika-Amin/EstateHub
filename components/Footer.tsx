export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-lg text-ink">
          Estate<span className="text-brass">Hub</span>
        </p>
        <p className="text-xs font-mono text-slate uppercase tracking-wide">
          © {new Date().getFullYear()} EstateHub — Built by Malaika Amin
        </p>
      </div>
    </footer>
  );
}