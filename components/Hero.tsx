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
  
    <section className="relative h-[80vh] min-h-140 w-full overflow-hidden">
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

      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/10" />

      <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-5xl sm:text-7xl font-bold text-paper max-w-3xl leading-[1.05]"
        >
          Find your next property.
        </motion.h1>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-paper/80 mt-5 max-w-md text-lg"
        >
          Browse verified listings for sale and rent, no clutter, no noise.
        </motion.p>

        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="mt-8">
          <a
            href="#listings"
            className="inline-flex items-center gap-2 bg-paper text-ink px-7 py-3.5 rounded-full font-semibold hover:bg-accent hover:text-paper transition-colors"
          >
            Browse Listings
          </a>
        </motion.div>
      </div>
    </section>
  );
}