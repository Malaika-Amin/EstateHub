"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Verified Agents",
    description: "Every agent on EstateHub is a real, active professional — no anonymous listings, no bots.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
  },
  {
    title: "Direct Contact",
    description: "Message an agent instantly on WhatsApp — no forms, no waiting, no middlemen.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  {
    title: "Real Listings",
    description: "Photos, pricing, and property details are kept accurate and current — no stale ads.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
];

export default function WhyEstateHub() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
     className="text-lg font-bold uppercase tracking-wide text-accent mb-4"
      >
        Why EstateHub
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl sm:text-6xl font-bold text-ink mb-16 max-w-2xl leading-tight"
      >
        Built to cut the noise out of property hunting.
      </motion.h2>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-16">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="group max-w-sm"
          >
            <div className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center mb-5 transition-colors group-hover:bg-accent">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">{f.title}</h3>
            <p className="text-slate leading-relaxed">{f.description}</p>
            <div className="h-px w-10 bg-ink/15 mt-6 transition-all duration-300 group-hover:w-16 group-hover:bg-accent" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}