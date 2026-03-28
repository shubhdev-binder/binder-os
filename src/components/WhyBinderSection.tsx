import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import NetworkNodeMotif from "./NetworkNodeMotif";

const values = [
  {
    title: "Purpose-built for textiles",
    desc: "Not a horizontal tool awkwardly fitted to manufacturing. Every field, every workflow, every term speaks your language — GSM, EPI, PPI, greige, liquor ratio, challan.",
  },
  {
    title: "Your data becomes your advantage",
    desc: "Proprietary manufacturing data accumulated through daily operations becomes a competitive moat no competitor can replicate.",
  },
  {
    title: "Embedded in your transactions",
    desc: "Binder OS lives inside your challans, your export docs, your compliance workflows — not beside them.",
  },
  {
    title: "AI-first, not AI-bolted",
    desc: "The COO Agent isn't a chatbot add-on. It's the primary interface layer designed to replace complex dashboards with simple conversations.",
  },
  {
    title: "The 3-to-300 problem protects you",
    desc: "Indian textile manufacturing has hundreds of machine types, thousands of process variations, and deep regional craft knowledge. This complexity is Binder OS's barrier to entry — and your barrier to competition.",
  },
];

const WhyBinderSection = () => {
  return (
    <section className="py-28 md:py-40 relative">
      <div className="absolute inset-0 weave-pattern" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            Our Edge
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Why Binder OS?
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className={`relative rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-8 hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/[0.05] overflow-hidden ${
                i === values.length - 1 && values.length % 3 !== 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <NetworkNodeMotif className="absolute top-3 right-3 opacity-25 group-hover:opacity-50 transition-opacity" size={24} />
              <motion.div
                className="w-10 h-1 bg-accent rounded-full mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
              />
              <h3 className="text-lg font-bold text-foreground mb-4">{v.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBinderSection;
