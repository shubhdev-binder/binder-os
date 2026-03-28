import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SECTION_IDS = ["inventory", "features", "coo-agent", "who"];

const VerticalSpine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const lineScaleY = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  const [sectionPositions, setSectionPositions] = useState<number[]>([]);

  useEffect(() => {
    const calc = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const positions = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return -1;
        return el.offsetTop / docH;
      }).filter((p) => p >= 0);
      setSectionPositions(positions);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed left-8 top-0 bottom-0 z-30 pointer-events-none hidden xl:block"
    >
      {/* Background track */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border/20" />

      {/* Animated fill */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-gradient-to-b from-accent/40 via-accent/25 to-accent/10 origin-top"
        style={{ scaleY: lineScaleY, height: "100%" }}
      />

      {/* Section branch nodes */}
      {sectionPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 -translate-x-1/2 flex items-center"
          style={{ top: `${pos * 100}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5 + i * 0.2 }}
        >
          {/* Node diamond */}
          <motion.div
            className="w-3 h-3 rotate-45 border border-accent/50 bg-background"
            animate={{
              borderColor: ["hsla(25,70%,48%,0.3)", "hsla(25,70%,48%,0.7)", "hsla(25,70%,48%,0.3)"],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          />
          {/* Branch line extending right */}
          <motion.div
            className="h-px bg-accent/20 ml-1"
            initial={{ width: 0 }}
            whileInView={{ width: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.div>
      ))}

      {/* Traveling particle */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent/60"
        style={{ top: useTransform(scrollYProgress, [0, 1], ["5%", "95%"]) }}
      />
    </div>
  );
};

export default VerticalSpine;
