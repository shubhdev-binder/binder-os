import { useRef, useEffect, useCallback } from "react";

const ORANGE_TACO = { r: 232, g: 118, b: 43 };
const CLOUD_DANCER = { r: 240, g: 237, b: 229 };

const LABELS = [
  "Inquiry & Order Management",
  "Procurement",
  "Goods Receipt & Inward",
  "Quality Control — Incoming Inspection",
  "Stock Management",
  "Production Planning & Orders",
  "Weaving",
  "Knitting",
  "Dyeing",
  "Printing",
  "Tufting",
  "Embroidery",
  "Finishing",
  "Cutting",
  "Sewing / Stitching",
  "Quilting",
  "Quality Control — Final Inspection",
  "Packaging",
  "Dispatch & Logistics",
];

interface Node {
  x: number; y: number; vx: number; vy: number;
  phaseX: number; phaseY: number; freqX: number; freqY: number;
  label: string;
}

interface Particle {
  from: number; to: number; t: number; speed: number;
}

type Vec3 = [number, number, number];

function rgb(c: typeof ORANGE_TACO, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function rotateXYZ(v: Vec3, ax: number, ay: number, az: number): Vec3 {
  let [x, y, z] = v;
  // X
  let cy = Math.cos(ax), sy = Math.sin(ax);
  let y1 = y * cy - z * sy, z1 = y * sy + z * cy;
  y = y1; z = z1;
  // Y
  cy = Math.cos(ay); sy = Math.sin(ay);
  let x1 = x * cy + z * sy; z1 = -x * sy + z * cy;
  x = x1; z = z1;
  // Z
  cy = Math.cos(az); sy = Math.sin(az);
  x1 = x * cy - y * sy; y1 = x * sy + y * cy;
  return [x1, y1, z];
}

function project(v: Vec3, cx: number, cy: number, fov: number): [number, number, number] {
  const scale = fov / (fov + v[2]);
  return [cx + v[0] * scale, cy + v[1] * scale, scale];
}

function makeIcosahedron(r: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  const s = r / Math.sqrt(1 + t * t);
  const raw: Vec3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const verts: Vec3[] = raw.map(([x, y, z]) => [x * s, y * s, z * s]);
  const faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const f of faces) {
    for (let i = 0; i < 3; i++) {
      const a = Math.min(f[i], f[(i+1)%3]), b = Math.max(f[i], f[(i+1)%3]);
      const k = `${a}-${b}`;
      if (!edgeSet.has(k)) { edgeSet.add(k); edges.push([a, b]); }
    }
  }
  return { verts, edges, faces };
}

function makeOctahedron(r: number) {
  const verts: Vec3[] = [[0,r,0],[0,-r,0],[r,0,0],[-r,0,0],[0,0,r],[0,0,-r]];
  const edges: [number,number][] = [
    [0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]
  ];
  return { verts, edges };
}

function makeCube(r: number) {
  const s = r / Math.sqrt(3);
  const verts: Vec3[] = [];
  for (let x = -1; x <= 1; x += 2)
    for (let y = -1; y <= 1; y += 2)
      for (let z = -1; z <= 1; z += 2)
        verts.push([x * s, y * s, z * s]);
  const edges: [number,number][] = [
    [0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]
  ];
  return { verts, edges };
}

function makeDiamond(r: number) {
  const h = r, w = r * 0.6;
  const verts: Vec3[] = [[0,h,0],[0,-h,0],[w,0,0],[-w,0,0],[0,0,w],[0,0,-w]];
  const edges: [number,number][] = [
    [0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]
  ];
  return { verts, edges };
}

interface PrimeRadiantCanvasProps {
  className?: string;
}

const PrimeRadiantCanvas = ({ className = "" }: PrimeRadiantCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    nodes: Node[]; particles: Particle[];
    mouseX: number; mouseY: number; mouseActive: boolean;
    animId: number;
  } | null>(null);

  const initNodes = useCallback((w: number, h: number): Node[] => {
    const pad = 60;
    return LABELS.map((label) => ({
      x: pad + Math.random() * (w - pad * 2),
      y: pad + Math.random() * (h - pad * 2),
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      freqX: 0.0005 + Math.random() * 0.001,
      freqY: 0.0005 + Math.random() * 0.001,
      label,
    }));
  }, []);

  const initParticles = useCallback((count: number): Particle[] => {
    return Array.from({ length: count }, () => ({
      from: Math.floor(Math.random() * 19),
      to: Math.floor(Math.random() * 19),
      t: Math.random(),
      speed: 0.001 + Math.random() * 0.002,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 45;
    const connDist = isMobile ? 300 : 450;
    const fontSize = isMobile ? 7.5 : 8.5;
    const polyScales = isMobile ? [55, 33, 22, 12] : [90, 54, 36, 20];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth * 0.9;
      const h = parent.clientHeight * 0.9;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const w = () => canvas.width / Math.min(window.devicePixelRatio || 1, 2);
    const h = () => canvas.height / Math.min(window.devicePixelRatio || 1, 2);

    const state = {
      nodes: initNodes(w(), h()),
      particles: initParticles(particleCount),
      mouseX: -9999, mouseY: -9999, mouseActive: false,
      animId: 0,
    };
    stateRef.current = state;

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      state.mouseX = e.clientX - rect.left;
      state.mouseY = e.clientY - rect.top;
      state.mouseActive = true;
    };
    const onLeave = () => { state.mouseActive = false; };

    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    const ico = makeIcosahedron(polyScales[0]);
    const oct = makeOctahedron(polyScales[1]);
    const cube = makeCube(polyScales[2]);
    const diamond = makeDiamond(polyScales[3]);

    const shapes = [
      { ...ico, color: `rgb(${ORANGE_TACO.r},${ORANGE_TACO.g},${ORANGE_TACO.b})`, lw: 1.2, rx: 0.0003, ry: 0.0004, rz: 0.0001 },
      { ...oct, color: "rgb(200,100,40)", lw: 1.0, rx: 0.0005, ry: 0.0002, rz: 0.0003, faces: undefined as number[][] | undefined },
      { ...cube, color: "rgb(240,160,60)", lw: 0.8, rx: 0.0002, ry: 0.0006, rz: 0.0004, faces: undefined as number[][] | undefined },
      { ...diamond, color: "rgb(230,140,100)", lw: 0.7, rx: 0.0007, ry: 0.0003, rz: 0.0005, faces: undefined as number[][] | undefined },
    ];

    const draw = (now: number) => {
      if (prefersReduced && now > 100) return;

      const cw = w(), ch = h();
      ctx.clearRect(0, 0, cw, ch);

      const { nodes, particles } = state;
      const pad = 25;

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx + Math.sin(now * n.freqX + n.phaseX) * 0.3;
        n.y += n.vy + Math.cos(now * n.freqY + n.phaseY) * 0.3;

        if (n.x < pad) { n.x = pad; n.vx = Math.abs(n.vx); }
        if (n.x > cw - pad) { n.x = cw - pad; n.vx = -Math.abs(n.vx); }
        if (n.y < pad) { n.y = pad; n.vy = Math.abs(n.vy); }
        if (n.y > ch - pad) { n.y = ch - pad; n.vy = -Math.abs(n.vy); }

        // Mouse repulsion
        if (state.mouseActive) {
          const dx = n.x - state.mouseX, dy = n.y - state.mouseY;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 && d > 0) {
            const force = (120 - d) / 120 * 2;
            n.x += (dx / d) * force;
            n.y += (dy / d) * force;
          }
        }

        // Node-to-node repulsion
        for (let j = i + 1; j < nodes.length; j++) {
          const o = nodes[j];
          const dx = n.x - o.x, dy = n.y - o.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 90 && d > 0) {
            const force = (90 - d) / 90 * 0.5;
            const fx = (dx / d) * force, fy = (dy / d) * force;
            n.x += fx; n.y += fy;
            o.x -= fx; o.y -= fy;
          }
        }
      }

      const globalPulse = 0.7 + Math.sin(now * 0.0012) * 0.3;

      // Connection lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connDist) {
            const localShimmer = Math.sin(now * 0.0008 + (i + j) * 0.05) * 0.15;
            const alpha = (1 - d / connDist) * 0.55 * (globalPulse + localShimmer);
            ctx.strokeStyle = rgb(ORANGE_TACO, Math.max(0, alpha));
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        p.t += p.speed;
        if (p.t >= 1) {
          p.from = p.to;
          p.to = Math.floor(Math.random() * 19);
          p.t = 0;
        }
        const a = nodes[p.from], b = nodes[p.to];
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grad.addColorStop(0, rgb(ORANGE_TACO, 0.5));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgb(CLOUD_DANCER, 0.95);
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw nodes
      ctx.font = `800 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      for (const n of nodes) {
        // Outer glow
        ctx.fillStyle = rgb(ORANGE_TACO, 0.15);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.fillStyle = rgb(ORANGE_TACO, 0.85);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        // White center
        ctx.fillStyle = rgb(CLOUD_DANCER, 0.95);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 0.8, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.fillStyle = `rgba(60,50,40,0.65)`;
        ctx.fillText(n.label, n.x, n.y + 14);
      }

      // 3D Polyhedron
      const cx = cw / 2, cy = ch / 2;
      const corePulse = 0.5 + Math.sin(now * 0.002) * 0.3;

      // Center glow
      const glowR = polyScales[0] * 1.2;
      const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      cGrad.addColorStop(0, rgb(ORANGE_TACO, 0.12 * corePulse));
      cGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = cGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      for (let si = shapes.length - 1; si >= 0; si--) {
        const shape = shapes[si];
        const ax = now * shape.rx, ay = now * shape.ry, az = now * shape.rz;

        const projected = shape.verts.map(v => {
          const rv = rotateXYZ(v, ax, ay, az);
          return project(rv, cx, cy, 500);
        });

        // Icosahedron faces
        if (si === 0 && shape.faces) {
          for (const face of shape.faces) {
            const avgZ = face.reduce((s, fi) => {
              const rv = rotateXYZ(shape.verts[fi], ax, ay, az);
              return s + rv[2];
            }, 0) / face.length;
            const depthNorm = (avgZ + polyScales[0]) / (polyScales[0] * 2);
            const fAlpha = 0.03 + depthNorm * 0.04;
            ctx.fillStyle = rgb(ORANGE_TACO, fAlpha);
            ctx.beginPath();
            ctx.moveTo(projected[face[0]][0], projected[face[0]][1]);
            ctx.lineTo(projected[face[1]][0], projected[face[1]][1]);
            ctx.lineTo(projected[face[2]][0], projected[face[2]][1]);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Edges sorted by depth
        const edgesWithDepth = shape.edges.map(([a, b]) => {
          const za = rotateXYZ(shape.verts[a], ax, ay, az)[2];
          const zb = rotateXYZ(shape.verts[b], ax, ay, az)[2];
          return { a, b, z: (za + zb) / 2 };
        }).sort((a, b) => a.z - b.z);

        const maxZ = polyScales[si];
        for (const edge of edgesWithDepth) {
          const depthNorm = (edge.z + maxZ) / (maxZ * 2);
          const depthFactor = 0.4 + depthNorm * 0.6;
          const [x1, y1] = projected[edge.a];
          const [x2, y2] = projected[edge.b];

          // Glow
          ctx.strokeStyle = rgb(ORANGE_TACO, 0.25 * depthFactor);
          ctx.lineWidth = shape.lw * 4;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

          // Core
          const c = shape.color;
          const cMatch = c.match(/\d+/g)!;
          ctx.strokeStyle = `rgba(${cMatch[0]},${cMatch[1]},${cMatch[2]},${0.85 * depthFactor})`;
          ctx.lineWidth = shape.lw;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }

        // Vertex glows
        for (const [px, py, ps] of projected) {
          const vr = 3 * ps;
          const vGrad = ctx.createRadialGradient(px, py, 0, px, py, vr);
          vGrad.addColorStop(0, rgb(ORANGE_TACO, 0.4));
          vGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = vGrad;
          ctx.beginPath();
          ctx.arc(px, py, vr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      state.animId = requestAnimationFrame(draw);
    };

    state.animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.animId);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [initNodes, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 m-auto ${className}`}
      style={{ cursor: "default", width: "90%", height: "90%" }}
    />
  );
};

export default PrimeRadiantCanvas;
