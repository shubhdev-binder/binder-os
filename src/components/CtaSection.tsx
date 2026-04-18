import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import PrimeRadiantCanvas from "./PrimeRadiantCanvas";
import DemoRequestForm from "./DemoRequestForm";

const CtaSection = () => {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <section id="cta" className="py-16 md:py-28 bg-section-dark relative overflow-hidden">
      {/* Updated Prime Radiant neural web */}
      <PrimeRadiantCanvas className="z-0 opacity-30" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--section-dark)/0.5)]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          {!showDemoForm ? (
            // Hero CTA Section
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
                This is what your company looks like on Binder OS
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                Ready to Run Your Company on One System?
              </h2>
              <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
                Currently onboarding textile manufacturers in the Panipat ecosystem. Get personalized demo to see how Binder OS can transform your operations.
              </p>

              <motion.button
                onClick={() => setShowDemoForm(true)}
                className="inline-block rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground text-base shadow-lg shadow-accent/30 hover:shadow-accent/50 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Request Demo</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                />
              </motion.button>
            </div>
          ) : null}

          {/* Demo Form Section */}
          {showDemoForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-8">
                <motion.button
                  onClick={() => setShowDemoForm(false)}
                  className="text-white/60 hover:text-white transition-colors mb-6"
                  whileHover={{ x: -4 }}
                >
                  ← Back
                </motion.button>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">Request Your Demo</h3>
                <p className="text-white/60">
                  Fill out the form below and we'll get in touch to schedule your personalized walkthrough.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8">
                <DemoRequestForm onSuccess={() => setShowDemoForm(false)} />
              </div>
            </motion.div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CtaSection;
