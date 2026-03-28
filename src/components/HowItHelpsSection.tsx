import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const comparisons = [
  {
    before: "Stock counts done by walking the warehouse with a notebook.",
    after: "Real-time inventory dashboard updated with every transaction.",
  },
  {
    before: "Job worker calls asking 'did you send the material?'",
    after: "Both sides see the same challan, same UIN, same status — in real time.",
  },
  {
    before: "Quality complaints traced by memory and blame.",
    after: "Every defect traced to the exact batch, the exact process, the exact job worker.",
  },
  {
    before: "Company owner is the only person who knows what's going on.",
    after: "The COO Agent knows what's going on — and tells the right people at the right time.",
  },
  {
    before: "New implementation takes 6 months and a consultant.",
    after: "Onboard in minutes. 4-step setup. No consultants needed.",
  },
];

const HowItHelpsSection = () => {
  return (
    <section className="py-28 md:py-40 relative">
      <div className="absolute inset-0 bg-warm-alt" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="max-w-3xl mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            The Impact
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            What Changes When You Run on Binder OS
          </h2>
        </AnimatedSection>

        <div className="space-y-5">
          {comparisons.map((c, i) => (
            <motion.div
              key={i}
              className="group grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center rounded-2xl border border-border/40 bg-background/80 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, boxShadow: "0 12px 32px -8px hsl(var(--accent) / 0.08)" }}
            >
              {/* Before — muted, scattered feel */}
              <div className="p-6 md:p-8 bg-muted/30 md:border-r border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full border border-destructive/40 border-dashed" />
                  <span className="text-xs font-bold uppercase tracking-wider text-destructive/60">Before</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.before}</p>
              </div>

              <motion.div
                className="hidden md:flex items-center justify-center"
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 + 0.2, type: "spring" }}
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-accent" />
                </div>
              </motion.div>

              {/* After — connected, vibrant feel */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent/60" />
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">After</span>
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">{c.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItHelpsSection;
