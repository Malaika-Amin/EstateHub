export default function Footer() {
  return (
    <footer className="mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-lg font-bold text-ink">EstateHub</p>
        <p className="text-xs text-slate">© {new Date().getFullYear()} EstateHub — Built by Malaika Amin</p>
      </div>
    </footer>
  );
}