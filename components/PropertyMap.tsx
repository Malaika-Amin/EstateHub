export default function PropertyMap({
  address,
  city,
}: {
  address: string;
  city: string;
}) {
  const query = encodeURIComponent(`${address}, ${city}`);
  const mapSrc = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-ink mb-4">Location</h2>
      <div className="rounded-2xl overflow-hidden h-80 bg-fog">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing ${address}, ${city}`}
        />
      </div>
    </div>
  );
}