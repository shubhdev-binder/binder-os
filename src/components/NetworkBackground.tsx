import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const NetworkBackground = ({ className = "", nodeCount = 35, opacity = 0.12 }: { className?: string; nodeCount?: number; opacity?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    // Init nodes
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1.5,
    }));

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent").trim();

    const draw = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      const nodes = nodesRef.current;
      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > cw) n.vx *= -1;
        if (n.y < 0 || n.y > ch) n.vy *= -1;
      }

      // Draw connections
      const maxDist = 120;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * opacity;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(${accentColor || "25 70% 48%"} / ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${accentColor || "25 70% 48%"} / ${opacity * 1.5})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!motionQuery.matches) {
      draw();
    } else {
      // Draw once static
      const nodes = nodesRef.current;
      const cw = canvas.offsetWidth;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(25 70% 48% / ${(1 - dist / 120) * opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(25 70% 48% / ${opacity * 1.5})`;
        ctx.fill();
      }
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [nodeCount, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default NetworkBackground;
