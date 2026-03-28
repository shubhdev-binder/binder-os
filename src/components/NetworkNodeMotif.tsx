import { motion } from "framer-motion";

/** Small 3-4 connected dots motif used as recurring brand element on cards */
const NetworkNodeMotif = ({ className = "", size = 32 }: { className?: string; size?: number }) => {
  const r = size;
  const nodes = [
    { cx: r * 0.25, cy: r * 0.3 },
    { cx: r * 0.7, cy: r * 0.15 },
    { cx: r * 0.85, cy: r * 0.65 },
    { cx: r * 0.4, cy: r * 0.8 },
  ];
  const connections = [
    [0, 1], [1, 2], [2, 3], [0, 3], [0, 2],
  ];

  return (
    <motion.svg
      width={r}
      height={r}
      viewBox={`0 0 ${r} ${r}`}
      className={`pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {connections.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="hsl(var(--accent))"
          strokeWidth={0.8}
          strokeOpacity={0.2}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={1.8}
          fill="hsl(var(--accent))"
          fillOpacity={0.35}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
        />
      ))}
    </motion.svg>
  );
};

export default NetworkNodeMotif;
