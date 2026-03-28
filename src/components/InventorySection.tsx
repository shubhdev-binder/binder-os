import { Package, Fingerprint, ClipboardList, Building2, Layers } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import NetworkNodeMotif from "./NetworkNodeMotif";

const features = [
  {
    icon: Package,
    title: "Real-time stock visibility",
    desc: "Know exactly what raw materials, WIP, and finished goods you hold across every location and department.",
    direction: { x: -60, y: 20 },
  },
  {
    icon: Fingerprint,
    title: "Unit-level traceability",
    desc: "Every unit gets a unique identification number (UIN) that follows it from intake to dispatch — across your floor and across company boundaries.",
    direction: { x: 0, y: 60 },
  },
  {
    icon: ClipboardList,
    title: "Inward & outward registers",
    desc: "Digital replacements for the paper registers every company maintains. Linked to challans, purchase orders, and job orders automatically.",
    direction: { x: 60, y: 20 },
  },
  {
    icon: Building2,
    title: "Multi-unit, multi-location",
    desc: "Track inventory across departments, warehouses, and branch units — all in one view.",
    direction: { x: -40, y: 40 },
  },
  {
    icon: Layers,
    title: "Foundation for everything else",
    desc: "Production, job orders, quality reports, costing — they all read from inventory. Get this right, and everything downstream works.",
    direction: { x: 40, y: 40 },
  },
];

const InventorySection = () => {
  return (
    <section id="inventory" className="py-28 md:py-40 relative">
      <div className="absolute inset-0 bg-warm-alt weave-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Root node indicator */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-3 h-3 rounded-full bg-accent/60" />
          <div className="h-px w-12 bg-accent/30" />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent/60">System Root</span>
        </motion.div>

        <AnimatedSection className="max-w-3xl mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            The Foundation
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
            It All Starts with Inventory
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-[1.7] mb-5">
            Every company operation — production, dispatching, quality, costing — depends on knowing exactly what you have, where it is, and where it came from. That's why Binder OS starts with a complete Inventory Management System.
          </p>
          <p className="text-base text-muted-foreground leading-[1.7]">
            IMS is not a standalone module you bolt on later. It is the foundation layer that every other part of Binder OS builds on — production planning reads from it, job orders dispatch against it, challans reference it, and traceability traces back to it.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group relative rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-8 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/[0.06]"
              initial={{ opacity: 0, x: f.direction.x, y: f.direction.y }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <NetworkNodeMotif className="absolute top-3 right-3 opacity-40 group-hover:opacity-70 transition-opacity" size={28} />
              <div className="w-12 h-12 rounded-xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
                <f.icon className="w-5.5 h-5.5 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InventorySection;
