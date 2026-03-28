import { Factory, Globe, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import NetworkNodeMotif from "./NetworkNodeMotif";

const personas = [
  {
    icon: Factory,
    title: "Vertically Integrated Companies",
    desc: "Manage end-to-end operations — inventory, internal production, job work coordination, dispatch — under one system.",
    detail: "Full control from raw material intake to finished goods dispatch, with real-time visibility across all departments.",
  },
  {
    icon: Globe,
    title: "Exporters & Manufacturers",
    desc: "Maintain the traceability international buyers demand. Every unit documented from raw material to container.",
    detail: "Compliance-ready documentation with unit-level tracking that satisfies international audit requirements.",
  },
  {
    icon: Wrench,
    title: "Job Workers",
    desc: "Get your own system. Track incoming orders, manage your inventory and production, build a verifiable work history.",
    detail: "Build a digital track record that helps you win more business and operate more efficiently.",
  },
];

const WhoItsForSection = () => {
  return (
    <section id="who" className="py-28 md:py-40 relative">
      <div className="absolute inset-0 weave-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            Our Users
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Built for the Textile Ecosystem
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              className="group relative rounded-2xl border border-border/40 bg-background/80 backdrop-blur-sm p-10 text-center hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/[0.06] cursor-default overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: i === 0 ? 3 : i === 2 ? -3 : 0,
                transition: { duration: 0.3 },
              }}
              style={{ perspective: 800, transformStyle: "preserve-3d" }}
            >
              <NetworkNodeMotif className="absolute top-3 right-3 opacity-30 group-hover:opacity-60 transition-opacity" size={28} />
              <div className="w-16 h-16 rounded-2xl bg-accent/8 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/15 group-hover:scale-110 transition-all duration-300">
                <p.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              {/* Reveal on hover */}
              <motion.p
                className="text-sm text-accent/80 font-medium overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                whileHover={{ height: "auto", opacity: 1 }}
              >
                {p.detail}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
