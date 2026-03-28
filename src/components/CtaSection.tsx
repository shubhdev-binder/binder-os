import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import PrimeRadiantCanvas from "./PrimeRadiantCanvas";

const CtaSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="cta" className="py-28 md:py-40 bg-section-dark relative overflow-hidden">
      {/* Updated Prime Radiant neural web */}
      <PrimeRadiantCanvas className="z-0 opacity-30" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--section-dark)/0.5)]" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
            This is what your company looks like on Binder OS
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Ready to Run Your Company on One System?
          </h2>
          <p className="text-lg text-white/50 mb-12">
            Currently onboarding textile manufacturers in the Panipat ecosystem. Expanding soon.
          </p>

          {submitted ? (
            <motion.div
              className="rounded-2xl border border-[hsl(44_24%_92%/0.15)] bg-white/5 backdrop-blur-sm p-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xl font-semibold text-white">Thank you!</p>
              <p className="text-white/50 mt-2">We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-[hsl(44_24%_92%/0.15)] bg-white/5 px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-base transition-all backdrop-blur-sm"
              />
              <motion.button
                type="submit"
                className="rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground text-sm sm:text-base shadow-lg shadow-accent/30 whitespace-nowrap relative overflow-hidden shrink-0"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Request Early Access</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full"
                  whileHover={{ translateX: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CtaSection;
