import { Cog, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import NetworkNodeMotif from "./NetworkNodeMotif";

const items = [
  {
    icon: Cog,
    title: "Production Layer",
    desc: "Full production process management — define sequences, track work-in-progress across departments and machines, and connect every production step back to inventory and job orders.",
    extra: "The COO Agent will extend into production monitoring automatically.",
  },
  {
    icon: Smartphone,
    title: "Binder Lite",
    desc: "A standalone product for job workers — independently useful from day one. No dependency on a parent company's onboarding. Track incoming orders, manage production, and build reputation.",
    extra: null,
  },
];

const ComingSoonSection = () => {
  return (
    <section className="py-28 md:py-40 relative">
      <div className="absolute inset-0 bg-warm-alt" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            Roadmap
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            What's Next
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              className="relative rounded-2xl p-[1px] overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              {/* Shimmer border */}
              <div className="absolute inset-0 shimmer-border rounded-2xl" />
              <div className="relative rounded-2xl bg-background p-8 lg:p-10">
                <NetworkNodeMotif className="absolute top-4 right-4 opacity-25" size={28} />
                <motion.span
                  className="inline-block text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent px-3 py-1.5 rounded-full mb-5"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  Coming Soon
                </motion.span>
                <div className="w-12 h-12 rounded-xl bg-accent/8 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-[1.7] mb-3">{item.desc}</p>
                {item.extra && (
                  <p className="text-sm text-accent font-medium">{item.extra}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
