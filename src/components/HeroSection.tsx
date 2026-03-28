import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import PrimeRadiantCanvas from "./PrimeRadiantCanvas";

const headlineWords = ["Your", "Company's", "Nervous", "System."];

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.1]);
  const canvasY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col pt-20 pb-12 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div className="max-w-3xl mx-auto text-center space-y-6 pt-8 sm:pt-12" style={{ y: textY }}>

          {/* 1. "Manufacturing Operating System" */}
          <motion.p
            className="text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-accent"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Textile Manufacturing Operating System
          </motion.p>

          {/* 2. "A Factory's Nervous System" */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black leading-[1.05] tracking-tight text-foreground">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                className={`inline-block mr-[0.25em] ${i >= 2 ? "text-gradient-copper" : ""}`}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Canvas animation — cinematic Prime Radiant display */}
        <motion.div
          className="relative w-full mx-auto mt-6 rounded-2xl overflow-hidden"
          style={{ opacity: canvasOpacity, y: canvasY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl shadow-[0_0_80px_-20px_rgba(212,170,90,0.2)]">
            <PrimeRadiantCanvas />
          </div>
        </motion.div>

        {/* Description + CTAs — below the animation */}
        <motion.div className="max-w-3xl mx-auto text-center space-y-6 mt-12 sm:mt-16 lg:mt-20">
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            One system of record for complete traceability of operations — from raw material to finished goods.
          </motion.p>
          <motion.p
            className="text-base text-muted-foreground leading-[1.7] max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            Binder OS replaces the chaos of spreadsheets, WhatsApp groups, and disconnected registers with a single manufacturing operating system built for India's textile ecosystem. We start where every company starts — with inventory.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 pt-2 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <motion.a
              href="#cta"
              className="group relative inline-flex items-center justify-center rounded-xl bg-accent px-10 py-4 text-base font-bold text-accent-foreground overflow-hidden shadow-lg shadow-accent/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Request a Demo</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                whileHover={{ translateX: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.a>
            <motion.a
              href="#inventory"
              className="group inline-flex items-center justify-center rounded-xl border-2 border-foreground/15 px-10 py-4 text-base font-semibold text-foreground hover:border-accent/50 hover:text-accent transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              See How It Works
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-accent/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
