"use client";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.7, ease: "easeOut" },
  }),
};

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-140 w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/50 to-ink/20" />
      <div className="absolute inset-0 bg-linear-to-r from-ink/40 via-transparent to-ink/10" />

      <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-mono text-xs uppercase tracking-widest text-brass mb-4"
        >
          EstateHub
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display text-5xl sm:text-6xl text-stone max-w-2xl leading-tight"
        >
          Property, presented properly.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-stone/75 mt-5 max-w-md text-lg"
        >
          Browse verified listings for sale and rent, no clutter, no noise.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8"
        >
          <a
            href="#listings"
            className="inline-flex items-center gap-2 bg-stone text-ink px-6 py-3 rounded-full font-medium hover:bg-brass hover:text-stone transition-colors"
          >
            Browse Listings
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="hidden md:block absolute bottom-10 right-8 bg-stone/95 backdrop-blur-sm border border-brass/40 rounded-xl px-5 py-4"
      >
        <p className="font-display text-2xl text-ink">EH-0001</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate mt-1">
          First listing on the platform
        </p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone/60"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </section>
  );
}