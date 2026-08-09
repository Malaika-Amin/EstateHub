export default function WhatsAppButton({
  phone,
  propertyTitle,
  refCode,
  email,
}: {
  phone: string;
  propertyTitle: string;
  refCode: string;
  email?: string;
}) {
  if (!phone) {
    if (!email) return null;
    return (
      <a
        href={`mailto:${email}?subject=${encodeURIComponent(`Inquiry: ${propertyTitle} (${refCode})`)}`}
        className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 rounded-full font-medium hover:bg-accent transition-colors w-full justify-center"
      >
        Contact Agent by Email
      </a>
    );
  }

 let cleanPhone = phone.replace(/[^0-9]/g, "");

  // Auto-correct Pakistani numbers: convert local format (03XXXXXXXXX) to international (923XXXXXXXXX)
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "92" + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith("92")) {
    cleanPhone = "92" + cleanPhone;
  }
  const message = `Hi, I'm interested in "${propertyTitle}" (${refCode}). Is it still available?`;
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-medium hover:bg-[#1fb855] transition-colors w-full justify-center"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.004 2C6.478 2 2 6.477 2 12c0 1.85.505 3.58 1.382 5.06L2 22l5.06-1.382A9.94 9.94 0 0012.004 22C17.53 22 22 17.523 22 12S17.53 2 12.004 2zm0 18.033a8.01 8.01 0 01-4.085-1.121l-.293-.174-3.043.83.83-3.043-.174-.293A8.01 8.01 0 013.967 12c0-4.435 3.602-8.037 8.037-8.037 4.435 0 8.037 3.602 8.037 8.037 0 4.435-3.602 8.033-8.037 8.033z" />
      </svg>
      Message on WhatsApp
    </a>
  );
}