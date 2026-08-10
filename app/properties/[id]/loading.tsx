export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="aspect-[16/10] max-h-[520px] bg-fog rounded-2xl mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-4 w-24 bg-fog rounded" />
          <div className="h-10 w-2/3 bg-fog rounded" />
          <div className="h-4 w-1/3 bg-fog rounded" />
          <div className="h-24 bg-fog rounded mt-6" />
        </div>
        <div className="bg-fog rounded-2xl h-64" />
      </div>
    </main>
  );
}