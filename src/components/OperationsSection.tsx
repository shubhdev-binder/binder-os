import { FileText, Truck, ShieldCheck, BarChart3 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "./AnimatedSection";
import NetworkNodeMotif from "./NetworkNodeMotif";

const steps = [
  {
    icon: FileText,
    title: "Job Order Management",
    desc: "Create, dispatch, and track job orders to external job workers. Every unit carries its original UIN reference that travels with the goods — even across company boundaries when both parties are on Binder OS. Inventory automatically adjusts on dispatch and receipt.",
    color: "from-accent/10 to-accent/5",
    networkDesc: "Company → Job Workers",
  },
  {
    icon: Truck,
    title: "Delivery Challans & Documentation",
    desc: "Generate challans linked to actual inventory records — not typed from memory. Department-to-department transfers, external dispatches, and job work movements are all documented with full traceability back to the source material.",
    color: "from-primary/10 to-primary/5",
    networkDesc: "Dept ↔ Dept",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Compliance",
    desc: "Attach quality reports to specific units and batches. Know the GSM, EPI, PPI, AQL results, and defect records for any piece of inventory at any point in its lifecycle.",
    color: "from-accent/10 to-accent/5",
    networkDesc: "Unit → QC",
  },
  {
    icon: BarChart3,
    title: "Operational Intelligence",
    desc: "Every transaction — every challan, every job order, every quality check — feeds into a growing body of operational data unique to your company. The longer you run on Binder OS, the clearer your patterns, costs, and bottlenecks become.",
    color: "from-primary/10 to-primary/5",
    networkDesc: "All → Insights",
  },
];

const OperationsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="features" className="py-28 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 weave-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        <AnimatedSection className="max-w-3xl mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            Full Operations
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            From Inventory to Full Operations
          </h2>
        </AnimatedSection>

        <div className="relative">
          {/* Animated vertical line — the spine growing */}
          <div className="hidden lg:block absolute left-10 top-0 bottom-0 w-px bg-border/40">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent to-accent/30"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="relative flex gap-6 lg:gap-10 items-start"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Timeline node with branch */}
                <motion.div
                  className="hidden lg:flex flex-shrink-0 w-20 h-20 rounded-2xl border border-border/60 bg-background items-center justify-center z-10 shadow-sm relative"
                  whileHover={{ scale: 1.08, borderColor: "hsl(var(--accent))" }}
                  transition={{ duration: 0.2 }}
                >
                  <step.icon className="w-7 h-7 text-accent" />
                  {/* Branch line to card */}
                  <motion.div
                    className="absolute left-full top-1/2 -translate-y-1/2 h-px bg-accent/30"
                    initial={{ width: 0 }}
                    whileInView={{ width: 20 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                  />
                </motion.div>
                <motion.div
                  className={`flex-1 rounded-2xl border border-border/40 bg-gradient-to-br ${step.color} backdrop-blur-sm p-8 lg:p-10 hover:border-accent/30 transition-all duration-300 relative overflow-hidden`}
                  whileHover={{ y: -4, boxShadow: "0 16px 40px -12px hsl(var(--accent) / 0.1)" }}
                  transition={{ duration: 0.25 }}
                >
                  <NetworkNodeMotif className="absolute top-4 right-4 opacity-30" size={32} />
                  <div className="lg:hidden w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-[1.7] text-[15px] lg:text-base">{step.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OperationsSection;
