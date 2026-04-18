import { useEffect, useRef, useCallback } from "react";

// ── Full 86 textile process labels ──
const ALL_NODES = [
  "Buyer Inquiry", "Internal Purchase Order (IPO)", "Sampling", "Vendor Purchase Order (VPO)",
  "Vendor Management", "Receivable Challan (Gate Entry)", "UIN Creation", "USN Creation",
  "Inward Register", "UQR — Incoming", "Incoming Quality Parameters", "UQR Decision",
  "Stock Dashboard", "Stock Transfers (Internal)", "IPC Allocation", "Outward Register",
  "Production Order / IPC Creation", "Process Sequence Management", "Handloom", "Frame Loom (Semi-Manual)",
  "Power Loom (Shuttle)", "Rapier Loom", "Air-Jet Loom", "Water-Jet Loom",
  "Jacquard Loom", "Dobby Loom", "Weaving Quality Checkpoints", "Circular Knitting",
  "Flat Knitting", "Warp Knitting (Tricot / Raschel)", "Knitting Quality Checkpoints", "Pre-Treatment",
  "Fabric Dyeing — Batch", "Fabric Dyeing — Continuous", "Yarn Dyeing",
  "Garment Dyeing", "Specialty Dyeing", "Dyeing Quality Checkpoints", "Screen Printing (Flat Bed)",
  "Rotary Screen Printing", "Digital Printing", "Sublimation Printing (Transfer)",
  "Block Printing (Traditional)", "Specialty Printing", "Printing Quality Checkpoints",
  "Cut Pile Tufting", "Loop Pile Tufting", "Cut & Loop Combination",
  "Hand Tufting (Gun Tufting)", "Graphics Tufting (CNC)", "Tufting Quality Checkpoints",
  "Multi-Head Embroidery Machine", "Schiffli Embroidery", "Aari / Chain Stitch Embroidery",
  "Computerized Single-Head Embroidery", "Embroidery Quality Checkpoints", "Mechanical Finishing",
  "Heat Setting / Stentering", "Chemical Finishing", "Coating & Lamination",
  "Finishing Quality Checkpoints", "Manual Cutting", "Automated / CAM Cutting",
  "Specialty Cutting", "Cutting Quality Checkpoints", "Stitch Types & Machines",
  "Sewing Line Flow", "Sewing Quality Checkpoints", "Multi-Needle Quilting",
  "Single Needle / Longarm Quilting", "Ultrasonic Quilting", "Quilting Quality Checkpoints",
  "In-Line Inspection", "End-Line Inspection", "Final Random Inspection (AQL-Based)",
  "Lab Testing", "Individual Product Packaging", "Inner Carton Packing",
  "Master Carton Packing", "Palletization", "Packaging Quality Checkpoints",
  "Delivery Challan Generation", "Types of Challans", "Export Documentation",
  "Domestic Dispatch", "Dispatch Quality Checkpoints",
];

// ── 3D math for the polyhedron ──
type Vec3 = [number, number, number];

function rotateX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}
function rotateY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}
function rotateZ(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}
function project3D(v: Vec3, cx: number, cy: number, fov: number) {
  const p = fov / (fov + v[2]);
  return { x: cx + v[0] * p, y: cy + v[1] * p, z: v[2], s: p };
}

// Polyhedra
function icosahedron(r: number) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = r / Math.sqrt(1 + phi * phi), b = a * phi;
  const verts: Vec3[] = [
    [-a,b,0],[a,b,0],[-a,-b,0],[a,-b,0],
    [0,-a,b],[0,a,b],[0,-a,-b],[0,a,-b],
    [b,0,-a],[b,0,a],[-b,0,-a],[-b,0,a],
  ];
  const edges: [number,number][] = [
    [0,11],[0,5],[0,1],[0,7],[0,10],[3,9],[3,4],[3,2],[3,6],[3,8],
    [1,5],[5,11],[11,10],[10,7],[7,1],[1,9],[5,4],[11,2],[10,6],[7,8],
    [9,4],[4,2],[2,6],[6,8],[8,9],[1,8],[9,5],[4,11],[2,10],[6,7],
  ];
  // Triangular faces for translucent panels
  const faces: [number,number,number][] = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [9,5,4],[4,11,2],[2,10,6],[6,7,8],[8,1,9],
  ];
  return { verts, edges, faces };
}
function octahedron(r: number) {
  const verts: Vec3[] = [[r,0,0],[-r,0,0],[0,r,0],[0,-r,0],[0,0,r],[0,0,-r]];
  const edges: [number,number][] = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]];
  return { verts, edges };
}
function cube(r: number) {
  const s = r * 0.577;
  const verts: Vec3[] = [[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
  const edges: [number,number][] = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  return { verts, edges };
}
function diamond(r: number) {
  const verts: Vec3[] = [[0,r,0],[0,-r,0],[r*.5,0,r*.5],[r*.5,0,-r*.5],[-r*.5,0,r*.5],[-r*.5,0,-r*.5]];
  const edges: [number,number][] = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,3],[3,5],[5,4],[4,2]];
  return { verts, edges };
}
function dodecahedron(r: number) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const inv = 1 / phi;
  const norm = r / Math.sqrt(3);
  const raw: Vec3[] = [
    [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
    [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],
    [0,-inv,-phi],[0,inv,-phi],[0,-inv,phi],[0,inv,phi],
    [-inv,-phi,0],[inv,-phi,0],[inv,phi,0],[-inv,phi,0],
    [-phi,0,-inv],[phi,0,-inv],[phi,0,inv],[-phi,0,inv],
  ];
  const verts: Vec3[] = raw.map(v => [v[0] * norm, v[1] * norm, v[2] * norm]);
  const pentagons: number[][] = [
    [0,8,9,3,16],[0,16,19,4,12],[0,12,13,1,8],
    [1,13,5,18,17],[1,17,2,9,8],[2,17,18,6,14],
    [2,14,15,3,9],[3,15,7,19,16],[4,19,7,11,10],
    [4,10,5,13,12],[5,10,11,6,18],[6,11,7,15,14],
  ];
  const faces: [number,number,number][] = [];
  pentagons.forEach(p => {
    for (let k = 1; k < p.length - 1; k++) faces.push([p[0], p[k], p[k+1]]);
  });
  const edgeSet = new Set<string>();
  pentagons.forEach(p => {
    for (let k = 0; k < p.length; k++) {
      const a = p[k], b = p[(k + 1) % p.length];
      edgeSet.add(a < b ? `${a}-${b}` : `${b}-${a}`);
    }
  });
  const edges: [number,number][] = [...edgeSet].map(k => {
    const [a, b] = k.split("-").map(Number);
    return [a, b];
  });
  return { verts, edges, faces };
}

// ── 2D neural web node ──
interface GNode {
  x: number; y: number; vx: number; vy: number;
  label: string; radius: number; phase: number;
}
interface GParticle {
  srcIdx: number; dstIdx: number; t: number; speed: number;
}

function buildGraph(w: number, h: number, isMobile: boolean) {
  const labels = isMobile ? ALL_NODES.slice(0, 50) : ALL_NODES;
  const nodes: GNode[] = [];
  const pad = isMobile ? 30 : 50;
  labels.forEach((label) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.15 + Math.random() * 0.4;
    nodes.push({
      x: pad + Math.random() * (w - pad * 2),
      y: pad + Math.random() * (h - pad * 2),
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      label, radius: isMobile ? 2.5 : 3,
      phase: Math.random() * Math.PI * 2,
    });
  });
  const particles: GParticle[] = [];
  const pCount = isMobile ? 35 : 65;
  for (let i = 0; i < pCount; i++) {
    const s = Math.floor(Math.random() * nodes.length);
    let d = Math.floor(Math.random() * nodes.length);
    if (d === s) d = (d + 1) % nodes.length;
    particles.push({ srcIdx: s, dstIdx: d, t: Math.random(), speed: 0.003 + Math.random() * 0.007 });
  }
  return { nodes, particles };
}

const REPULSION = 800, DAMPING = 0.92, MAX_VEL = 1.5;
const GOLD = { r: 212, g: 170, b: 90 };
const COPPER = { r: 200, g: 130, b: 70 };
const AMBER = { r: 230, g: 190, b: 110 };
const ROSE = { r: 210, g: 160, b: 140 };
const CREAM = { r: 250, g: 240, b: 220 };

const BindingHeroCanvas = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const graphRef = useRef<ReturnType<typeof buildGraph>>({ nodes: [], particles: [] });
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const init = useCallback((canvas: HTMLCanvasElement) => {
    graphRef.current = buildGraph(canvas.offsetWidth, canvas.offsetHeight, canvas.offsetWidth < 640);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(canvas);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const dod = dodecahedron(1);
    const ico = icosahedron(1);
    const octa = octahedron(1);
    const cub = cube(1);
    const dia = diamond(1);

    const draw = (now: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const isMob = w < 640;
      const cx = w / 2, cy = h / 2;
      const connectDist = isMob ? 260 : 350;
      const polySize = Math.min(w, h) * 0.32;
      const fov = 500;
      const t = now * 0.001;

      // ── Background — matches site's --background: 48 33% 97% ──
      ctx.fillStyle = "#F0EDE5";
      ctx.fillRect(0, 0, w, h);

      // Subtle golden center glow
      const pa = 0.08 + Math.sin(now * 0.0006) * 0.04;
      const cGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, polySize * 1.8);
      cGlow.addColorStop(0, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${pa})`);
      cGlow.addColorStop(0.5, `rgba(${AMBER.r}, ${AMBER.g}, ${AMBER.b}, ${pa * 0.2})`);
      cGlow.addColorStop(1, "rgba(255, 248, 235, 0)");
      ctx.fillStyle = cGlow;
      ctx.fillRect(0, 0, w, h);

      const { nodes, particles } = graphRef.current;

      // ── Node physics ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist > 90) continue;
          const force = REPULSION / (dist * dist);
          const fx = (dx / dist) * force, fy = (dy / dist) * force;
          nodes[i].vx += fx; nodes[i].vy += fy;
          nodes[j].vx -= fx; nodes[j].vy -= fy;
        }
      }
      const pad = 25;
      for (const node of nodes) {
        node.vx += Math.sin(now * 0.0004 + node.phase) * 0.012;
        node.vy += Math.cos(now * 0.00045 + node.phase * 1.7) * 0.012;
        node.vx += Math.cos(now * 0.00012 + node.phase * 3.1) * 0.006;
        node.vy += Math.sin(now * 0.00015 + node.phase * 2.3) * 0.006;
        if (mouseRef.current.active) {
          const mdx = node.x - mouseRef.current.x, mdy = node.y - mouseRef.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
          if (mdist < 120) {
            node.vx += (mdx / mdist) * (120 - mdist) * 0.06;
            node.vy += (mdy / mdist) * (120 - mdist) * 0.06;
          }
        }
        node.vx *= DAMPING; node.vy *= DAMPING;
        const mag = Math.sqrt(node.vx ** 2 + node.vy ** 2);
        if (mag > MAX_VEL) { node.vx = (node.vx / mag) * MAX_VEL; node.vy = (node.vy / mag) * MAX_VEL; }
        node.x += node.vx; node.y += node.vy;
        if (node.x < pad) { node.x = pad; node.vx = Math.abs(node.vx) * 0.6; }
        if (node.x > w - pad) { node.x = w - pad; node.vx = -Math.abs(node.vx) * 0.6; }
        if (node.y < pad) { node.y = pad; node.vy = Math.abs(node.vy) * 0.6; }
        if (node.y > h - pad) { node.y = h - pad; node.vy = -Math.abs(node.vy) * 0.6; }
      }

      // ── Neural web connections with breathing pulse ──
      const breathe = 0.7 + Math.sin(now * 0.0012) * 0.3;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const localPulse = Math.sin(now * 0.0008 + (i + j) * 0.05) * 0.15;
            const alpha = (0.35 + localPulse) * (1 - dist / connectDist) * breathe;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${COPPER.r}, ${COPPER.g}, ${COPPER.b}, ${alpha})`;
            ctx.lineWidth = (0.8 + (1 - dist / connectDist) * 0.7) * (0.85 + breathe * 0.15);
            ctx.stroke();
          }
        }
      }

      // ── 3D Prime Radiant polyhedron — center piece ──
      const drawPoly = (
        verts: Vec3[], edges: [number, number][],
        scale: number, rx: number, ry: number, rz: number,
        col: typeof GOLD, lw: number, alpha: number
      ) => {
        const pts = verts.map(v => {
          let p: Vec3 = [v[0] * scale, v[1] * scale, v[2] * scale];
          p = rotateX(p, rx); p = rotateY(p, ry); p = rotateZ(p, rz);
          return project3D(p, cx, cy, fov);
        });
        const sorted = [...edges].sort((a, b) =>
          (pts[a[0]].z + pts[a[1]].z) - (pts[b[0]].z + pts[b[1]].z)
        );
        for (const [i, j] of sorted) {
          const a = pts[i], b = pts[j];
          const dAlpha = alpha * (0.3 + 0.7 * ((a.z + b.z) / 2 + scale) / (scale * 2));
          const flicker = dAlpha * (0.7 + Math.sin(now * 0.002 + i * 0.7) * 0.12);
          // Glow
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${flicker * 0.25})`;
          ctx.lineWidth = lw * 4; ctx.stroke();
          // Core
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${flicker})`;
          ctx.lineWidth = lw; ctx.stroke();
        }
        // Vertices
        for (const pt of pts) {
          const dA = alpha * (0.4 + 0.6 * (pt.z + scale) / (scale * 2));
          const vr = (1.2 + pt.s * 1.8) * (lw / 1.2);
          const vg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, vr * 4);
          vg.addColorStop(0, `rgba(${CREAM.r}, ${CREAM.g}, ${CREAM.b}, ${dA * 0.5})`);
          vg.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
          ctx.beginPath(); ctx.arc(pt.x, pt.y, vr * 4, 0, Math.PI * 2);
          ctx.fillStyle = vg; ctx.fill();
          ctx.beginPath(); ctx.arc(pt.x, pt.y, vr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col.r + 30}, ${col.g + 40}, ${col.b + 20}, ${dA * 0.9})`;
          ctx.fill();
        }
      };

      // Draw translucent dodecahedron faces first (outer shell)
      const dodSize = polySize * 1.25;
      const dodFacePts = dod.verts.map(v => {
        let p: Vec3 = [v[0] * dodSize, v[1] * dodSize, v[2] * dodSize];
        p = rotateX(p, t * 0.08); p = rotateY(p, t * -0.1); p = rotateZ(p, t * 0.18);
        return project3D(p, cx, cy, fov);
      });
      const sortedDodFaces = [...dod.faces].sort((a, b) => {
        const zA = (dodFacePts[a[0]].z + dodFacePts[a[1]].z + dodFacePts[a[2]].z) / 3;
        const zB = (dodFacePts[b[0]].z + dodFacePts[b[1]].z + dodFacePts[b[2]].z) / 3;
        return zA - zB;
      });
      for (const [i, j, k] of sortedDodFaces) {
        const a = dodFacePts[i], b = dodFacePts[j], c = dodFacePts[k];
        const avgZ = (a.z + b.z + c.z) / 3;
        const faceAlpha = 0.02 + 0.03 * ((avgZ + dodSize) / (dodSize * 2));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
        ctx.fillStyle = `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${faceAlpha})`;
        ctx.fill();
      }

      // Draw translucent icosahedron faces
      const icoFacePts = ico.verts.map(v => {
        let p: Vec3 = [v[0] * polySize, v[1] * polySize, v[2] * polySize];
        p = rotateX(p, t * 0.1); p = rotateY(p, t * 0.15); p = rotateZ(p, t * 0.04);
        return project3D(p, cx, cy, fov);
      });
      // Sort faces by average z
      const sortedFaces = [...ico.faces].sort((a, b) => {
        const zA = (icoFacePts[a[0]].z + icoFacePts[a[1]].z + icoFacePts[a[2]].z) / 3;
        const zB = (icoFacePts[b[0]].z + icoFacePts[b[1]].z + icoFacePts[b[2]].z) / 3;
        return zA - zB;
      });
      for (const [i, j, k] of sortedFaces) {
        const a = icoFacePts[i], b = icoFacePts[j], c = icoFacePts[k];
        const avgZ = (a.z + b.z + c.z) / 3;
        const faceAlpha = 0.03 + 0.04 * ((avgZ + polySize) / (polySize * 2));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath();
        ctx.fillStyle = `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${faceAlpha})`;
        ctx.fill();
      }

      // Layer 0: Dodecahedron — outermost shell
      drawPoly(dod.verts, dod.edges, dodSize, t * 0.08, t * -0.1, t * 0.18, GOLD, isMob ? 0.7 : 1.0, 0.4);
      // Layer 1: Icosahedron — outer shell
      drawPoly(ico.verts, ico.edges, polySize, t * 0.1, t * 0.15, t * 0.04, AMBER, isMob ? 0.8 : 1.2, 0.5);
      // Layer 2: Octahedron — mid
      drawPoly(octa.verts, octa.edges, polySize * 0.52, t * -0.18, t * 0.12, t * 0.08, COPPER, isMob ? 1.0 : 1.5, 0.6);
      // Layer 3: Cube — inner
      drawPoly(cub.verts, cub.edges, polySize * 0.32, t * 0.25, t * -0.2, t * -0.06, AMBER, isMob ? 0.8 : 1.2, 0.7);
      // Layer 4: Diamond — core
      drawPoly(dia.verts, dia.edges, polySize * 0.18, t * -0.12, t * 0.28, 0, ROSE, isMob ? 1.0 : 1.5, 0.85);

      // Core glow
      const cp = 0.18 + Math.sin(now * 0.001) * 0.1;
      const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, polySize * 0.12);
      coreG.addColorStop(0, `rgba(255, 230, 170, ${cp})`);
      coreG.addColorStop(0.6, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${cp * 0.3})`);
      coreG.addColorStop(1, "rgba(255, 248, 235, 0)");
      ctx.fillStyle = coreG;
      ctx.beginPath(); ctx.arc(cx, cy, polySize * 0.12, 0, Math.PI * 2); ctx.fill();

      // ── Particles ──
      for (const p of particles) {
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0; p.srcIdx = p.dstIdx;
          p.dstIdx = Math.floor(Math.random() * nodes.length);
          if (p.dstIdx === p.srcIdx) p.dstIdx = (p.dstIdx + 1) % nodes.length;
        }
        const a = nodes[p.srcIdx], b = nodes[p.dstIdx];
        if (!a || !b) continue;
        const px = a.x + (b.x - a.x) * p.t, py = a.y + (b.y - a.y) * p.t;

        const pg = ctx.createRadialGradient(px, py, 0, px, py, 5);
        pg.addColorStop(0, `rgba(${CREAM.r}, ${CREAM.g}, ${CREAM.b}, 0.45)`);
        pg.addColorStop(1, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, 0)`);
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CREAM.r}, ${CREAM.g}, ${CREAM.b}, 0.8)`; ctx.fill();
      }

      // ── All nodes + labels — always visible ──
      const fontSize = isMob ? 7.5 : 8.5;
      ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";

      for (const node of nodes) {
        const rr = node.radius;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, rr * 5);
        glow.addColorStop(0, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, 0.1)`);
        glow.addColorStop(1, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, 0)`);
        ctx.beginPath(); ctx.arc(node.x, node.y, rr * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        ctx.beginPath(); ctx.arc(node.x, node.y, rr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COPPER.r}, ${COPPER.g}, ${COPPER.b}, 0.85)`; ctx.fill();

        ctx.beginPath(); ctx.arc(node.x, node.y, rr * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CREAM.r}, ${CREAM.g}, ${CREAM.b}, 0.6)`; ctx.fill();

        ctx.fillStyle = "rgba(100, 65, 25, 0.8)";
        ctx.fillText(node.label, node.x, node.y + rr + 3);
      }

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ cursor: "default", width: "90%", height: "90%", margin: "auto", top: 0, bottom: 0, left: 0, right: 0 }}
    />
  );
};

export default BindingHeroCanvas;
