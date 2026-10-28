import { useEffect, useRef } from 'react';
import { CONFETTI_COLORS } from '@/config/birthday';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  round: boolean;
}

interface ConfettiProps {
  durationMs?: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Full-screen confetti: two cannons from the bottom corners plus a shower from the top.
 * Mount it with a changing `key` to fire it again. Respects "reduce motion".
 */
export function Confetti({ durationMs = 4500 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const makeParticle = (x: number, y: number, vx: number, vy: number): Particle => ({
      x,
      y,
      vx,
      vy,
      size: rand(6, 11),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
      rotation: rand(0, Math.PI * 2),
      spin: rand(-0.25, 0.25),
      round: Math.random() < 0.25,
    });

    const particles: Particle[] = [];

    // Cannons: aimed up and towards the middle of the screen.
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 90; i++) {
      const speed = rand(13, 24);
      const spread = rand(-0.35, 0.35);
      particles.push(makeParticle(w * 0.04, h + 10, Math.cos(-1.0 + spread) * speed, Math.sin(-1.0 + spread) * speed));
      particles.push(makeParticle(w * 0.96, h + 10, -Math.cos(-1.0 + spread) * speed, Math.sin(-1.0 + spread) * speed));
    }
    // Shower from the top.
    for (let i = 0; i < 80; i++) {
      particles.push(makeParticle(rand(0, w), rand(-h * 0.6, -10), rand(-1.5, 1.5), rand(1, 4)));
    }

    const start = performance.now();
    let last = start;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const fade = elapsed > durationMs * 0.7 ? Math.max(0, 1 - (elapsed - durationMs * 0.7) / (durationMs * 0.3)) : 1;

      for (const p of particles) {
        p.vy += 0.32 * dt;
        p.vx *= 0.992;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.spin * dt;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }

      if (elapsed < durationMs) {
        frame = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [durationMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
