import { useEffect, useRef } from "react";

const ORANGE = "232,118,43"; // Orange Taco

type Vec3 = [number, number, number];

function rotX(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a),
    s = Math.sin(a);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}
function rotY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a),
    s = Math.sin(a);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}
function rotZ(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a),
    s = Math.sin(a);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}
function project(v: Vec3, cx: number, cy: number, fov: number) {
  const s = fov / (fov + v[2]);
  return { x: cx + v[0] * s, y: cy + v[1] * s, z: v[2] };
}

function icosahedron(r: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  const s = r / Math.sqrt(1 + t * t);
  const raw: Vec3[] = [
    [-1, t, 0],
    [1, t, 0],
    [-1, -t, 0],
    [1, -t, 0],
    [0, -1, t],
    [0, 1, t],
    [0, -1, -t],
    [0, 1, -t],
    [t, 0, -1],
    [t, 0, 1],
    [-t, 0, -1],
    [-t, 0, 1],
  ];
  const verts: Vec3[] = raw.map(([x, y, z]) => [x * s, y * s, z * s]);
  const faces: number[][] = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];
  const eSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const f of faces) {
    for (let i = 0; i < 3; i++) {
      const a = Math.min(f[i], f[(i + 1) % 3]),
        b = Math.max(f[i], f[(i + 1) % 3]);
      const k = `${a}-${b}`;
      if (!eSet.has(k)) {
        eSet.add(k);
        edges.push([a, b]);
      }
    }
  }
  return { verts, edges, faces };
}

function cube(r: number) {
  const s = r / Math.sqrt(3);
  const verts: Vec3[] = [];
  for (let x = -1; x <= 1; x += 2)
    for (let y = -1; y <= 1; y += 2)
      for (let z = -1; z <= 1; z += 2) verts.push([x * s, y * s, z * s]);
  const faces: number[][] = [
    [0, 1, 3, 2],
    [4, 5, 7, 6],
    [0, 1, 5, 4],
    [2, 3, 7, 6],
    [0, 2, 6, 4],
    [1, 3, 7, 5],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 4],
    [1, 3],
    [1, 5],
    [2, 3],
    [2, 6],
    [3, 7],
    [4, 5],
    [4, 6],
    [5, 7],
    [6, 7],
  ];
  return { verts, edges, faces };
}

function diamond(r: number) {
  const h = r,
    w = r * 0.7;
  const verts: Vec3[] = [
    [0, h, 0],
    [0, -h, 0],
    [w, 0, 0],
    [-w, 0, 0],
    [0, 0, w],
    [0, 0, -w],
  ];
  const faces: number[][] = [
    [0, 2, 4],
    [0, 4, 3],
    [0, 3, 5],
    [0, 5, 2],
    [1, 4, 2],
    [1, 3, 4],
    [1, 5, 3],
    [1, 2, 5],
  ];
  const edges: [number, number][] = [
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 4],
    [4, 3],
    [3, 5],
    [5, 2],
  ];
  return { verts, edges, faces };
}

interface BinderLogoProps {
  size?: number;
  className?: string;
}

const BinderLogo = ({ size = 200, className = "" }: BinderLogoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2,
      cy = size / 2;
    const fov = 500;
    const r0 = size * 0.42;
    const r1 = size * 0.28;
    const r2 = size * 0.18;

    const ico = icosahedron(r0);
    const cub = cube(r1);
    const dia = diamond(r2);

    const shapes = [
      {
        geom: ico,
        rx: 0.0003,
        ry: 0.0004,
        rz: 0.0001,
        faceAlpha: 0.05,
        edgeAlpha: 0.75,
        lw: 1.1,
      },
      {
        geom: cub,
        rx: 0.0002,
        ry: 0.0006,
        rz: 0.0004,
        faceAlpha: 0.08,
        edgeAlpha: 0.85,
        lw: 1.2,
      },
      {
        geom: dia,
        rx: 0.0007,
        ry: 0.0003,
        rz: 0.0005,
        faceAlpha: 0.18,
        edgeAlpha: 0.95,
        lw: 1.3,
      },
    ];

    const draw = (now: number) => {
      ctx.clearRect(0, 0, size, size);

      for (const s of shapes) {
        const ax = now * s.rx,
          ay = now * s.ry,
          az = now * s.rz;
        const projected = s.geom.verts.map((v) => {
          let p: Vec3 = [v[0], v[1], v[2]];
          p = rotX(p, ax);
          p = rotY(p, ay);
          p = rotZ(p, az);
          return project(p, cx, cy, fov);
        });

        if (s.geom.faces) {
          const sortedFaces = [...s.geom.faces].sort((a, b) => {
            const zA =
              a.reduce((sum: number, i: number) => sum + projected[i].z, 0) /
              a.length;
            const zB =
              b.reduce((sum: number, i: number) => sum + projected[i].z, 0) /
              b.length;
            return zA - zB;
          });
          for (const face of sortedFaces) {
            ctx.beginPath();
            ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
            for (let i = 1; i < face.length; i++) {
              ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(${ORANGE}, ${s.faceAlpha})`;
            ctx.fill();
          }
        }

        for (const [i, j] of s.geom.edges) {
          const a = projected[i],
            b = projected[j];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ORANGE}, ${s.edgeAlpha})`;
          ctx.lineWidth = s.lw;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  );
};

export default BinderLogo;
